import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const numberMeanings: Record<number, { keywords: string[]; talents: string[]; shadows: string[]; evolution: string }> = {
  1: { keywords: ["iniziativa", "autonomia", "leadership"], talents: ["indipendenza", "coraggio", "spirito pionieristico"], shadows: ["egoismo", "impulsività"], evolution: "imparare a guidare senza dominare" },
  2: { keywords: ["collaborazione", "sensibilità", "relazione"], talents: ["empatia", "diplomazia", "ascolto"], shadows: ["dipendenza", "insicurezza"], evolution: "sviluppare fiducia in sé" },
  3: { keywords: ["comunicazione", "creatività", "espressione"], talents: ["entusiasmo", "arte", "socialità"], shadows: ["dispersione", "superficialità"], evolution: "dare forma concreta alle idee" },
  4: { keywords: ["struttura", "stabilità", "metodo"], talents: ["affidabilità", "costanza", "concretezza"], shadows: ["rigidità", "paura del cambiamento"], evolution: "costruire senza irrigidirsi" },
  5: { keywords: ["cambiamento", "libertà", "esperienza"], talents: ["adattabilità", "curiosità"], shadows: ["instabilità", "eccessi"], evolution: "libertà con responsabilità" },
  6: { keywords: ["responsabilità", "amore", "armonia"], talents: ["cura", "senso estetico", "protezione"], shadows: ["controllo", "sacrificio eccessivo"], evolution: "amare senza annullarsi" },
  7: { keywords: ["introspezione", "ricerca", "spiritualità"], talents: ["analisi", "profondità", "intuizione"], shadows: ["isolamento", "diffidenza"], evolution: "fidarsi e condividere" },
  8: { keywords: ["potere", "realizzazione", "materia"], talents: ["leadership", "gestione", "successo"], shadows: ["materialismo", "durezza"], evolution: "usare il potere con etica" },
  9: { keywords: ["umanità", "chiusura", "servizio"], talents: ["compassione", "visione ampia"], shadows: ["vittimismo", "dispersione emotiva"], evolution: "lasciare andare il passato" },
};

const personalYearMeanings: Record<number, string> = {
  1: "Nuovi inizi, decisioni, autonomia. Anno per prendere in mano la propria vita.",
  2: "Collaborazione, pazienza, relazioni. Anno per lavorare con gli altri.",
  3: "Espansione, comunicazione, creatività. Anno per esprimersi e socializzare.",
  4: "Costruzione, impegno, disciplina. Anno per lavorare sulle basi solide.",
  5: "Cambiamento, movimento, libertà. Anno di trasformazioni e novità.",
  6: "Responsabilità, amore, famiglia. Anno per consolidare i rapporti.",
  7: "Introspezione, studio, rallentamento. Anno per riflettere e crescere interiormente.",
  8: "Risultati, carriera, potere personale. Anno di raccolta e concretezza.",
  9: "Chiusura, conclusione, trasformazione. Anno per fare bilanci e lasciar andare.",
  11: "Visione, risveglio, ispirazione. Anno di alta vibrazione spirituale.",
  22: "Realizzazione concreta, costruzione duratura. Anno per grandi progetti.",
  33: "Servizio, amore, responsabilità collettiva. Anno di insegnamento e guarigione.",
};

const dayVibeDescriptions: Record<number, string> = {
  1: "energia dinamica, iniziativa, colori rosso e oro, stile deciso e autorevole",
  2: "armonia, delicatezza, colori pastello e argento, stile morbido ed elegante",
  3: "creatività, gioia, colori vivaci e giallo, stile espressivo e artistico",
  4: "ordine, stabilità, colori terra e verde scuro, stile classico e strutturato",
  5: "libertà, avventura, colori elettrici e turchese, stile versatile e moderno",
  6: "bellezza, cura, colori rosa e verde, stile raffinato e romantico",
  7: "introspezione, mistero, colori viola e indaco, stile minimalista e sofisticato",
  8: "potere, successo, colori nero e oro, stile lussuoso e potente",
  9: "universalità, compassione, colori bordeaux e bianco, stile eclettico e spirituale",
};

function reduceNumber(num: number): number {
  const masterNumbers = [11, 22, 33];
  while (num > 9 && !masterNumbers.includes(num)) {
    num = num.toString().split("").reduce((sum, digit) => sum + parseInt(digit), 0);
  }
  return num;
}

function calculateDayVibration(day: number, month: number, year: number): number {
  const sum = day + month + reduceNumber(year);
  return reduceNumber(sum);
}

function isOutfitRequest(message: string): boolean {
  const keywords = [
    "vestir", "outfit", "look", "abbigliamento", "indossare", "metter",
    "cosa mi metto", "come mi vesto", "vestito", "abito", "stile",
    "guardaroba", "moda", "fashion", "dress code", "tenuta",
    "foto", "immagine", "ricrea", "genera", "mostrami", "fammi vedere",
    "aspetto", "sembrare", "provare addosso", "specchio",
  ];
  const lower = message.toLowerCase();
  return keywords.some(k => lower.includes(k));
}

async function getUserPhotoUrls(userId: string): Promise<string[]> {
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: photos } = await supabaseAdmin
    .from("photos")
    .select("storage_path, type")
    .eq("user_id", userId)
    .limit(3);

  if (!photos || photos.length === 0) return [];

  const urls: string[] = [];
  for (const photo of photos) {
    const { data } = await supabaseAdmin.storage
      .from("user-photos")
      .createSignedUrl(photo.storage_path, 600);
    if (data?.signedUrl) urls.push(data.signedUrl);
  }
  return urls;
}

async function analyzeUserAppearance(photoUrls: string[], apiKey: string): Promise<{ description: string; gender: string }> {
  if (photoUrls.length === 0) return { description: "persona di corporatura media", gender: "non specificato" };

  const content: any[] = [
    {
      type: "text",
      text: `Analizza questa persona per consigliare abbigliamento. Rispondi ESATTAMENTE in questo formato JSON e nient'altro:
{"gender":"uomo" o "donna","body":"descrizione corporatura in 10 parole max","skin":"tonalità pelle in 5 parole max","hair":"colore e tipo capelli in 5 parole max"}`,
    },
  ];

  for (const url of photoUrls.slice(0, 2)) {
    content.push({ type: "image_url", image_url: { url } });
  }

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [{ role: "user", content }],
      max_tokens: 200,
    }),
  });

  if (!response.ok) {
    console.error("Vision analysis failed:", await response.text());
    return { description: "persona di corporatura media", gender: "non specificato" };
  }

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content || "";
  
  try {
    // Extract JSON from response
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      const gender = parsed.gender?.toLowerCase().includes("uomo") ? "uomo" : "donna";
      const description = `${gender}, corporatura: ${parsed.body || "media"}, pelle: ${parsed.skin || "media"}, capelli: ${parsed.hair || "non specificato"}`;
      return { description, gender };
    }
  } catch (e) {
    console.error("Failed to parse appearance JSON:", e);
  }
  
  return { description: raw || "persona di corporatura media", gender: "non specificato" };
}

async function generateOutfitImage(userPhotoUrl: string | null, outfitDescription: string, apiKey: string): Promise<string | null> {
  try {
    // If we have a user photo, use image editing to dress them
    const content: any[] = [];
    
    if (userPhotoUrl) {
      content.push(
        {
          type: "text",
          text: outfitDescription,
        },
        {
          type: "image_url",
          image_url: { url: userPhotoUrl },
        }
      );
    } else {
      content.push({ type: "text", text: outfitDescription });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [{ role: "user", content }],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      console.error("Image generation failed:", await response.text());
      return null;
    }

    const data = await response.json();
    const imageData = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    return imageData || null;
  } catch (e) {
    console.error("Image generation error:", e);
    return null;
  }
}

async function uploadGeneratedImage(base64Data: string, userId: string): Promise<string | null> {
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Extract the base64 content after the data URI prefix
  const base64Content = base64Data.replace(/^data:image\/\w+;base64,/, "");
  const binaryData = Uint8Array.from(atob(base64Content), c => c.charCodeAt(0));

  const fileName = `${userId}/${crypto.randomUUID()}.png`;

  const { error } = await supabaseAdmin.storage
    .from("generated-images")
    .upload(fileName, binaryData, { contentType: "image/png" });

  if (error) {
    console.error("Upload error:", error);
    return null;
  }

  // Create a signed URL valid for 7 days
  const { data } = await supabaseAdmin.storage
    .from("generated-images")
    .createSignedUrl(fileName, 60 * 60 * 24 * 7);

  return data?.signedUrl || null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, profile, numerologyContext, conversationHistory, userId } = await req.json();

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

    const today = new Date();
    const dayVibration = calculateDayVibration(today.getDate(), today.getMonth() + 1, today.getFullYear());

    // Build numerology context
    const numerologyInfo = numerologyContext
      ? `
I numeri dell'utente:
- Life Path: ${numerologyContext.lifePath} (${numberMeanings[numerologyContext.lifePath > 9 ? (numerologyContext.lifePath === 11 ? 2 : numerologyContext.lifePath === 22 ? 4 : 6) : numerologyContext.lifePath]?.keywords.join(", ")})
- Espressione: ${numerologyContext.expression}
- Anima: ${numerologyContext.soul}
- Personalità: ${numerologyContext.personality}
- Anno Personale: ${numerologyContext.personalYear} (${personalYearMeanings[numerologyContext.personalYear] || ""})
`
      : "L'utente non ha ancora generato la mappa numerologica.";

    // Check if this is an outfit request
    const wantsOutfit = isOutfitRequest(message);
    let outfitImageUrl: string | null = null;
    let appearanceDescription = "";
    let userGender = "non specificato";
    let userPhotoUrl: string | null = null;

    if (wantsOutfit && userId) {
      const photoUrls = await getUserPhotoUrls(userId);
      if (photoUrls.length > 0) {
        userPhotoUrl = photoUrls[0]; // Use first photo for image editing
        const analysis = await analyzeUserAppearance(photoUrls, apiKey);
        appearanceDescription = analysis.description;
        userGender = analysis.gender;
      } else {
        appearanceDescription = "L'utente non ha caricato foto. Suggerisci un look generico.";
      }
    }

    const dayVibeDesc = dayVibeDescriptions[dayVibration] || "equilibrio e armonia";

    const outfitContext = wantsOutfit
      ? `

RICHIESTA LOOK/ABBIGLIAMENTO RILEVATA.
Sesso dell'utente: ${userGender}
Descrizione fisica dell'utente: ${appearanceDescription}
Vibrazione del giorno ${dayVibration}: ${dayVibeDesc}
IMPORTANTE: Suggerisci SOLO abbigliamento ${userGender === "uomo" ? "MASCHILE da uomo" : userGender === "donna" ? "FEMMINILE da donna" : "adeguato al sesso dell'utente"}.
Fornisci consigli dettagliati su cosa indossare basandoti su:
1. La vibrazione numerologica del giorno (colori e stile associati)
2. L'anno personale dell'utente
3. La corporatura e tonalità della pelle dell'utente
4. Il sesso dell'utente (${userGender})
Sii specifico su colori, stili e accessori ${userGender === "uomo" ? "maschili" : userGender === "donna" ? "femminili" : ""}.`
      : "";

    const systemPrompt = `Sei un consulente di numerologia pitagorica professionale per l'app "Destino Numerologico".

REGOLE FONDAMENTALI:
1. Applichi SOLO le regole della numerologia pitagorica classica
2. Non fai diagnosi mediche, legali o finanziarie
3. Usi linguaggio orientativo: "favorisce", "tende a", "è più probabile"
4. Non fai promesse assolute o predizioni fatalistiche
5. Rispondi in italiano in modo caldo e professionale

CONTESTO UTENTE:
Nome: ${profile?.nome || "Utente"}
Data di nascita: ${profile?.birth_date || "non specificata"}
${numerologyInfo}

VIBRAZIONE DEL GIORNO (${today.toLocaleDateString("it-IT")}): ${dayVibration}
Questa vibrazione influenza le energie della giornata portando qualità di ${numberMeanings[dayVibration]?.keywords.join(", ") || "equilibrio"}.
${outfitContext}

ISTRUZIONI:
- Rispondi in modo chiaro e utile basandoti sui numeri dell'utente
- Se ti chiedono delle date favorevoli, considera la compatibilità tra i numeri dell'utente e le vibrazioni delle date
- Per consigli sulla giornata, integra la vibrazione del giorno con l'Anno Personale dell'utente
- Se manca la mappa numerologica, suggerisci gentilmente di generarla prima
- Mantieni un tono professionale ma accogliente`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(conversationHistory || []),
      { role: "user", content: message },
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", errorText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit raggiunto. Riprova tra qualche istante." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Crediti AI esauriti." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "Mi dispiace, non sono riuscito a elaborare la risposta.";

    // Generate outfit image if requested
    if (wantsOutfit && userId) {
      const genderLabel = userGender === "uomo" ? "man" : userGender === "donna" ? "woman" : "person";
      
      const imagePrompt = userPhotoUrl
        ? `Transform this photo: dress this ${genderLabel} in the following outfit while keeping their exact face, body shape, and skin tone. Outfit: ${dayVibeDesc} inspired style. Colors: ${dayVibeDesc}. ${userGender === "uomo" ? "Men's clothing only: shirt, trousers, shoes, watch." : "Women's clothing only: dress or blouse with skirt/pants, heels, jewelry."} Professional fashion photography, full body shot, elegant background. Keep the person's face and features exactly as they are.`
        : `Fashion photo of a ${genderLabel} wearing an elegant outfit. Style: ${dayVibeDesc}. ${userGender === "uomo" ? "Men's clothing: shirt, trousers, leather shoes, watch." : "Women's clothing: elegant dress, heels, jewelry."} Full body shot, professional fashion photography, elegant background.`;

      const base64Image = await generateOutfitImage(userPhotoUrl, imagePrompt, apiKey);
      if (base64Image) {
        outfitImageUrl = await uploadGeneratedImage(base64Image, userId);
      }
    }

    return new Response(
      JSON.stringify({
        response: aiResponse,
        ...(outfitImageUrl && { imageUrl: outfitImageUrl }),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error in chat-numerology:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        response: "Mi dispiace, si è verificato un errore. Riprova tra qualche istante.",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
