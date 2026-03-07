import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const dayVibeStyles: Record<number, { day1: string; day2: string; eve1: string; eve2: string; mood: string }> = {
  1: { day1: "dark burgundy polo shirt, charcoal chinos, brown leather belt and shoes", day2: "white crew-neck t-shirt under a dark navy zip-up jacket, dark grey jeans, white sneakers", eve1: "deep wine button-down shirt, dark grey fitted blazer, black trousers, dark leather shoes", eve2: "black turtleneck sweater, dark burgundy trousers, suede ankle boots", mood: "authoritative, confident, decisive" },
  2: { day1: "light blue oxford shirt, beige chinos, white sneakers", day2: "soft grey V-neck sweater over white t-shirt, navy chinos, grey suede shoes", eve1: "pale blue linen shirt, light grey unstructured blazer, dark navy trousers, loafers", eve2: "navy blue knit polo, stone-grey trousers, brown leather loafers", mood: "harmonious, diplomatic, approachable" },
  3: { day1: "mustard yellow polo, beige chinos, brown leather belt, tan shoes", day2: "warm terracotta henley, dark olive cargo pants, brown boots", eve1: "warm ochre button-down shirt, tan cotton blazer, dark brown trousers, cognac shoes", eve2: "burnt orange knit sweater, dark indigo jeans, brown suede desert boots", mood: "creative, joyful, expressive" },
  4: { day1: "olive green polo, khaki trousers, brown leather shoes", day2: "camel crew-neck sweater, dark green corduroy trousers, brown boots", eve1: "forest green button-down, charcoal wool blazer, dark trousers, black shoes", eve2: "dark brown turtleneck, olive green trousers, dark leather ankle boots", mood: "stable, grounded, reliable" },
  5: { day1: "bright blue crew-neck t-shirt, grey casual jacket, dark jeans, white sneakers", day2: "teal henley shirt, dark grey jogger-chinos, navy blue slip-on sneakers", eve1: "cobalt blue fitted shirt, dark grey modern blazer, black trousers, black leather shoes", eve2: "steel blue knit polo, dark navy trousers, charcoal suede loafers", mood: "adventurous, dynamic, free" },
  6: { day1: "sage green linen shirt, cream chinos, tan leather shoes", day2: "soft mint polo, light beige trousers, white canvas sneakers", eve1: "muted green button-down, ivory cotton blazer, beige trousers, cognac loafers", eve2: "emerald green V-neck sweater, cream chinos, tan suede shoes", mood: "caring, elegant, refined" },
  7: { day1: "navy blue crew-neck sweater, dark grey trousers, minimalist black watch", day2: "dark grey henley, black slim jeans, navy blue canvas sneakers", eve1: "dark navy fitted shirt, anthracite blazer, black trousers, black leather shoes", eve2: "charcoal turtleneck, dark navy trousers, black suede chelsea boots", mood: "intellectual, mysterious, minimal" },
  8: { day1: "black polo shirt, charcoal trousers, dark leather belt and shoes", day2: "dark grey crew-neck sweater, black jeans, black leather sneakers", eve1: "dark charcoal button-down shirt, black fitted blazer, dark trousers, polished black shoes", eve2: "black V-neck cashmere sweater, dark grey wool trousers, black leather ankle boots", mood: "powerful, sophisticated, commanding" },
  9: { day1: "burgundy henley, off-white chinos, brown leather shoes", day2: "wine-red crew-neck t-shirt, dark khaki trousers, tan suede boots", eve1: "deep wine button-down, cream unstructured blazer, dark burgundy trousers, cognac shoes", eve2: "maroon knit polo, dark charcoal trousers, brown leather loafers", mood: "compassionate, wise, universal" },
};

function reduceNumber(num: number): number {
  while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
    num = num.toString().split("").reduce((sum, digit) => sum + parseInt(digit), 0);
  }
  return num;
}

function getDayVibration(): number {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const sum = day + month + reduceNumber(year);
  return reduceNumber(sum);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Non autorizzato" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

    if (!lovableApiKey) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY non configurata" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from token
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Utente non trovato" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse body for force refresh
    let force = false;
    try {
      const body = await req.json();
      force = body?.force === true;
    } catch { /* no body is fine */ }

    // Check if we already generated outfits today
    const today = new Date().toISOString().split("T")[0];

    if (!force) {
      // Check existing cached files
      const { data: existingFiles } = await supabase.storage
        .from("user-photos")
        .list(`${user.id}/outfits`, { search: today });

      if (existingFiles && existingFiles.length >= 4) {
        const urls = await Promise.all(
          existingFiles.slice(0, 4).map(async (file) => {
            const { data } = await supabase.storage
              .from("user-photos")
              .createSignedUrl(`${user.id}/outfits/${file.name}`, 3600);
            return data?.signedUrl;
          })
        );
        return new Response(JSON.stringify({ outfits: urls.filter(Boolean) }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Get user photo for reference
    const { data: photos } = await supabase
      .from("photos")
      .select("type, storage_path")
      .eq("user_id", user.id);

    let userPhotoUrl: string | null = null;
    if (photos && photos.length > 0) {
      // Prefer full_front, then face
      const preferred = photos.find(p => p.type === "full_front") || photos.find(p => p.type === "face") || photos[0];
      const { data } = await supabase.storage
        .from("user-photos")
        .createSignedUrl(preferred.storage_path, 600);
      userPhotoUrl = data?.signedUrl || null;
    }

    const dayVibe = getDayVibration();
    const vibeKey = dayVibe > 9 ? reduceNumber(dayVibe) : dayVibe;
    const style = dayVibeStyles[vibeKey] || dayVibeStyles[1];

    // Define 4 outfit prompts - each with COMPLETELY DIFFERENT garments
    const baseRules = "IMPORTANT: SIMPLE, SOBER, EVERYDAY clothing. NO suits with ties, NO flashy accessories, NO gold jewelry, NO ceremonial clothing, NO glitter, NO sequins, NO extravagant fashion. Just clean, well-fitted, normal clothes for a regular person who wants to look good. Show full body from head to feet in a realistic photo.";
    
    const outfitPrompts = [
      {
        label: "day1",
        prompt: `Generate a realistic full-body photo of a man wearing this SPECIFIC daytime outfit: ${style.day1}. Mood: ${style.mood}. Setting: modern urban street with natural daylight. ${baseRules}`,
      },
      {
        label: "day2",
        prompt: `Generate a realistic full-body photo of a man wearing this SPECIFIC ALTERNATIVE daytime outfit (COMPLETELY DIFFERENT from a polo with chinos): ${style.day2}. Mood: ${style.mood}. Setting: bright office entrance or café terrace. ${baseRules}`,
      },
      {
        label: "eve1",
        prompt: `Generate a realistic full-body photo of a man wearing this SPECIFIC evening outfit for dinner: ${style.eve1}. Mood: ${style.mood}. Setting: upscale restaurant entrance with warm lighting. ${baseRules}`,
      },
      {
        label: "eve2",
        prompt: `Generate a realistic full-body photo of a man wearing this SPECIFIC ALTERNATIVE evening outfit (COMPLETELY DIFFERENT garments from the first evening look): ${style.eve2}. Mood: ${style.mood}. Setting: stylish lounge bar with ambient lighting. ${baseRules}`,
      },
    ];

    // If we have user photo, use image editing to preserve their appearance
    const generateImage = async (prompt: string, label: string) => {
      try {
        const messages: any[] = [];

        if (userPhotoUrl) {
          messages.push({
            role: "user",
            content: [
              { type: "text", text: `Based on this person's appearance (face, skin tone, body type, hair), generate a new full-body image of them wearing the described outfit. Preserve their facial features, skin tone, hair color and body build faithfully. ${prompt}` },
              { type: "image_url", image_url: { url: userPhotoUrl } },
            ],
          });
        } else {
          messages.push({
            role: "user",
            content: prompt,
          });
        }

        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${lovableApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image",
            messages,
            modalities: ["image", "text"],
          }),
        });

        if (!response.ok) {
          console.error(`AI error for ${label}:`, response.status, await response.text());
          return null;
        }

        const data = await response.json();
        const imageData = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

        if (!imageData) {
          console.error(`No image returned for ${label}`);
          return null;
        }

        // Extract base64 data
        const base64 = imageData.replace(/^data:image\/\w+;base64,/, "");
        const binaryData = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

        // Upload to storage
        const filePath = `${user.id}/outfits/${today}_${label}.png`;
        const { error: uploadError } = await supabase.storage
          .from("user-photos")
          .upload(filePath, binaryData, {
            contentType: "image/png",
            upsert: true,
          });

        if (uploadError) {
          console.error(`Upload error for ${label}:`, uploadError);
          return null;
        }

        const { data: signedData } = await supabase.storage
          .from("user-photos")
          .createSignedUrl(filePath, 3600);

        return signedData?.signedUrl || null;
      } catch (e) {
        console.error(`Error generating ${label}:`, e);
        return null;
      }
    };

    // Generate all 4 in parallel
    const results = await Promise.all(
      outfitPrompts.map(op => generateImage(op.prompt, op.label))
    );

    return new Response(JSON.stringify({ outfits: results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-outfits error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Errore sconosciuto" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
