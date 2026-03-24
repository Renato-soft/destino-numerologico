import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

    if (!lovableApiKey) {
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { language = "it" } = await req.json();

    // Fetch user photos
    const { data: photos } = await supabase
      .from("photos")
      .select("storage_path, type")
      .eq("user_id", user.id);

    if (!photos || photos.length === 0) {
      return new Response(JSON.stringify({ description: null, reason: "no_photos" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch user profile for name
    const { data: profile } = await supabase
      .from("profiles")
      .select("nome")
      .eq("user_id", user.id)
      .single();

    const nome = profile?.nome || "";

    // Download photos and convert to base64
    const imageContents: { type: string; base64: string; mimeType: string }[] = [];
    for (const photo of photos.slice(0, 5)) {
      const { data: fileData } = await supabase.storage
        .from("user-photos")
        .download(photo.storage_path);

      if (fileData) {
        const arrayBuffer = await fileData.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        let binary = "";
        for (let i = 0; i < uint8Array.length; i++) {
          binary += String.fromCharCode(uint8Array[i]);
        }
        const base64 = btoa(binary);
        const mimeType = fileData.type || "image/jpeg";
        imageContents.push({ type: photo.type, base64, mimeType });
      }
    }

    if (imageContents.length === 0) {
      return new Response(JSON.stringify({ description: null, reason: "no_photos_loaded" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build AI message with images
    const imageMessages = imageContents.map((img) => ({
      type: "image_url" as const,
      image_url: { url: `data:${img.mimeType};base64,${img.base64}` },
    }));

    const isIT = language.startsWith("it");

    const systemPrompt = isIT
      ? `Sei un osservatore empatico e sensibile. Analizza le foto della persona e scrivi una descrizione calda, positiva e rispettosa del suo aspetto e della sua energia.

REGOLE FONDAMENTALI:
- Descrivi SOLO ciò che vedi: espressione del viso, sguardo, sorriso, energia che trasmette, postura
- Usa un tono poetico ma autentico, come se stessi parlando con un amico caro
- NON fare commenti sul peso, sull'età apparente, o su caratteristiche fisiche che potrebbero risultare sensibili
- NON usare aggettivi che possano sembrare giudicanti o offensivi
- Concentrati sull'energia, sulla luce, sullo sguardo, sul sorriso, sull'espressione
- Se ci sono più foto, cerca tratti ricorrenti e l'essenza della persona
- Scrivi in prima persona rivolgendoti alla persona con il suo nome
- Includi alla fine una nota che specifica che questa è una lettura empatica basata sulle foto, non un giudizio
- Circa 200-250 parole
- NON usare markdown, asterischi o formattazione tecnica`
      : `You are an empathetic and sensitive observer. Analyze the person's photos and write a warm, positive, and respectful description of their appearance and energy.

FUNDAMENTAL RULES:
- Describe ONLY what you see: facial expression, gaze, smile, energy they convey, posture
- Use a poetic but authentic tone, as if speaking to a dear friend
- Do NOT comment on weight, apparent age, or physical characteristics that could be sensitive
- Do NOT use adjectives that could seem judgmental or offensive
- Focus on energy, light, gaze, smile, expression
- If there are multiple photos, look for recurring traits and the person's essence
- Write addressing the person by their name
- Include at the end a note specifying this is an empathic reading based on photos, not a judgment
- About 200-250 words
- Do NOT use markdown, asterisks, or technical formatting`;

    const userPrompt = isIT
      ? `Ecco le foto di ${nome}. Scrivi una descrizione empatica e positiva di ciò che percepisci dalla sua immagine.`
      : `Here are ${nome}'s photos. Write an empathic and positive description of what you perceive from their image.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              { type: "text", text: userPrompt },
              ...imageMessages,
            ],
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errText);
      return new Response(JSON.stringify({ error: "AI analysis failed" }), {
        status: aiResponse.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    const description = aiData.choices?.[0]?.message?.content || null;

    return new Response(JSON.stringify({ description }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Photo analysis error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
