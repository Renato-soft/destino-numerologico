import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const dayVibeStyles: Record<number, { dayColors: string; eveningColors: string; mood: string }> = {
  1: { dayColors: "dark red/burgundy polo, dark navy jacket, charcoal trousers", eveningColors: "deep burgundy button-down shirt, dark grey fitted blazer, black trousers", mood: "authoritative, confident, decisive" },
  2: { dayColors: "light grey sweater, white shirt underneath, navy chinos", eveningColors: "soft blue shirt, light grey blazer, dark navy trousers", mood: "harmonious, diplomatic, approachable" },
  3: { dayColors: "mustard yellow polo, beige chinos, brown leather belt", eveningColors: "warm ochre shirt, tan blazer, dark brown trousers", mood: "creative, joyful, expressive" },
  4: { dayColors: "olive green polo, khaki trousers, brown leather shoes", eveningColors: "forest green button-down, charcoal blazer, dark trousers", mood: "stable, grounded, reliable" },
  5: { dayColors: "electric blue t-shirt under grey casual jacket, dark jeans", eveningColors: "cobalt blue shirt, dark grey modern blazer, black trousers", mood: "adventurous, dynamic, free" },
  6: { dayColors: "sage green linen shirt, cream chinos, tan shoes", eveningColors: "soft green button-down, ivory blazer, beige trousers", mood: "caring, elegant, refined" },
  7: { dayColors: "navy blue crew neck, dark grey trousers, minimalist watch", eveningColors: "dark navy shirt, anthracite blazer, black trousers", mood: "intellectual, mysterious, minimal" },
  8: { dayColors: "black polo, charcoal trousers, dark leather belt", eveningColors: "dark charcoal shirt, black fitted blazer, dark trousers", mood: "powerful, sophisticated, commanding" },
  9: { dayColors: "burgundy henley, off-white chinos, leather bracelet", eveningColors: "deep wine shirt, cream blazer, dark burgundy trousers", mood: "compassionate, wise, universal" },
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

    // Check if we already generated outfits today
    const today = new Date().toISOString().split("T")[0];
    const storagePath = `${user.id}/outfits/${today}`;

    // Check existing cached files
    const { data: existingFiles } = await supabase.storage
      .from("user-photos")
      .list(`${user.id}/outfits`, { search: today });

    if (existingFiles && existingFiles.length >= 4) {
      // Return cached URLs
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

    // Define 4 outfit prompts
    const outfitPrompts = [
      {
        label: "day1",
        prompt: `Generate a realistic full-body photo of a man wearing EVERYDAY CASUAL-SMART clothing for daytime work. Outfit: ${style.dayColors}. Style mood: ${style.mood}. The man is standing in a modern urban setting with natural daylight. IMPORTANT: The clothing must be SIMPLE, SOBER, EVERYDAY wear suitable for going to work or meeting people casually. NO suits, NO ties, NO flashy accessories, NO gold jewelry, NO ceremonial clothing, NO glitter, NO sequins. Just clean, well-fitted, normal everyday clothes that make a good impression. Show full body from head to feet.`,
      },
      {
        label: "day2",
        prompt: `Generate a realistic full-body photo of a man wearing a DIFFERENT CASUAL-SMART daytime outfit. Outfit variation: swap the colors slightly - ${style.dayColors} but with a different combination. Style mood: ${style.mood}. Standing in a clean, bright environment. IMPORTANT: SIMPLE, SOBER, EVERYDAY clothing for work or casual meetings. NO suits, NO ties, NO flashy items, NO gold, NO ceremonial wear. Clean, well-fitted, normal clothes. Full body head to feet.`,
      },
      {
        label: "eve1",
        prompt: `Generate a realistic full-body photo of a man wearing SMART-CASUAL evening clothing for a dinner or social gathering. Outfit: ${style.eveningColors}. Style mood: ${style.mood}. The man is in a sophisticated but relaxed evening setting (restaurant or lounge). IMPORTANT: The clothing must be ELEVATED but SOBER - suitable for a nice dinner or evening with friends. NO tuxedos, NO bow ties, NO flashy accessories, NO gold jewelry, NO ceremonial clothing, NO glitter. Just well-chosen, elegant everyday evening wear. Show full body from head to feet.`,
      },
      {
        label: "eve2",
        prompt: `Generate a realistic full-body photo of a man wearing a DIFFERENT SMART-CASUAL evening outfit. Outfit variation: ${style.eveningColors} in a different arrangement. Style mood: ${style.mood}. Evening setting with warm ambient lighting. IMPORTANT: ELEVATED but SOBER evening wear for dinner or social events. NO tuxedos, NO bow ties, NO flashy items, NO gold, NO ceremonial clothing. Elegant everyday clothes. Full body head to feet.`,
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
