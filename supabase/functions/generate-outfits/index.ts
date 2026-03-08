import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Male outfit styles by vibration number
const maleVibeStyles: Record<number, { day1: string; day2: string; eve1: string; eve2: string; mood: string }> = {
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

// Female outfit styles by vibration number
const femaleVibeStyles: Record<number, { day1: string; day2: string; eve1: string; eve2: string; mood: string }> = {
  1: { day1: "tailored dark burgundy blazer over white silk blouse, black slim trousers, pointed-toe heels", day2: "fitted black turtleneck, charcoal high-waisted pants, burgundy leather bag, ankle boots", eve1: "deep wine wrap dress, delicate gold necklace, black stiletto heels", eve2: "black fitted jumpsuit, dark red clutch, strappy heels", mood: "authoritative, confident, decisive" },
  2: { day1: "soft blue cashmere sweater, white midi skirt, nude flats", day2: "light grey knit top, powder blue wide-leg pants, white sneakers", eve1: "pale blue silk midi dress, silver bracelet, nude heels", eve2: "lavender blouse, navy tailored trousers, grey suede pumps", mood: "harmonious, diplomatic, approachable" },
  3: { day1: "mustard yellow blouse, camel wide-leg trousers, tan leather sandals", day2: "terracotta wrap top, dark olive midi skirt, brown ankle boots", eve1: "warm gold satin blouse, dark brown fitted pants, cognac heels", eve2: "burnt orange knit dress, tan leather belt, brown suede boots", mood: "creative, joyful, expressive" },
  4: { day1: "olive green linen shirt dress, brown leather belt, tan sandals", day2: "camel turtleneck, dark green corduroy pants, brown boots", eve1: "forest green fitted dress, gold stud earrings, dark leather heels", eve2: "brown knit sweater, olive tailored trousers, dark ankle boots", mood: "stable, grounded, reliable" },
  5: { day1: "bright blue silk blouse, white jeans, colorful sneakers", day2: "teal wrap top, dark grey tailored pants, navy loafers", eve1: "cobalt blue one-shoulder dress, silver earrings, black strappy heels", eve2: "steel blue satin blouse, dark navy skirt, charcoal pumps", mood: "adventurous, dynamic, free" },
  6: { day1: "sage green linen blouse, cream wide-leg pants, woven sandals", day2: "soft pink knit top, beige midi skirt, white ballet flats", eve1: "emerald green wrap dress, gold pendant, nude heels", eve2: "mint green silk blouse, ivory tailored pants, tan leather pumps", mood: "caring, elegant, refined" },
  7: { day1: "navy blue cashmere sweater, dark grey slim pants, minimal silver jewelry", day2: "charcoal silk blouse, black tailored trousers, dark loafers", eve1: "midnight blue midi dress, subtle silver cuff, black heels", eve2: "dark grey wrap dress, navy clutch, black suede ankle boots", mood: "intellectual, mysterious, minimal" },
  8: { day1: "black blazer over charcoal top, dark trousers, pointed black heels", day2: "dark grey fitted dress, black leather belt, black ankle boots", eve1: "black fitted dress, statement silver earrings, black stilettos", eve2: "charcoal tailored jumpsuit, dark clutch, polished black heels", mood: "powerful, sophisticated, commanding" },
  9: { day1: "burgundy wrap blouse, off-white wide-leg pants, brown leather sandals", day2: "wine-red knit dress, dark brown belt, tan ankle boots", eve1: "deep wine velvet midi dress, gold earrings, cognac heels", eve2: "maroon silk blouse, dark charcoal skirt, brown leather pumps", mood: "compassionate, wise, universal" },
};

function reduceNumber(num: number): number {
  while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
    num = num.toString().split("").reduce((sum, digit) => sum + parseInt(digit), 0);
  }
  return num;
}

function getUniversalDayVibration(): number {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const sum = day + month + reduceNumber(year);
  return reduceNumber(sum);
}

function getPersonalDayVibration(personalYear: number): number {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  // Personal month = calendar month + personal year (reduced)
  const personalMonth = reduceNumber(month + personalYear);
  // Personal day = day + personal month (reduced)
  return reduceNumber(day + personalMonth);
}

function getCurrentSeason(): { name: string; hint: string; fabric: string } {
  const month = new Date().getMonth() + 1; // 1-12
  if (month >= 3 && month <= 5) {
    return { name: "spring", hint: "Light layers, breathable fabrics. Mild weather ~15-22°C.", fabric: "cotton, light linen, light knits, denim" };
  } else if (month >= 6 && month <= 8) {
    return { name: "summer", hint: "Hot weather ~25-35°C. Lightweight, airy clothing. Short sleeves, open shoes.", fabric: "linen, light cotton, chambray, breathable blends" };
  } else if (month >= 9 && month <= 11) {
    return { name: "autumn", hint: "Cool weather ~8-18°C. Layering is key. Warm tones.", fabric: "wool, corduroy, heavier cotton, suede, leather" };
  } else {
    return { name: "winter", hint: "Cold weather ~0-10°C. Warm, cozy clothing. Coats, scarves, boots.", fabric: "wool, cashmere, heavy knits, leather, flannel" };
  }
}

function buildNumerologyContext(map: any, personalDay: number, universalDay: number): string {
  const parts: string[] = [];
  parts.push(`Numerology profile: Life Path ${map.life_path}, Expression ${map.destiny_expression}, Soul ${map.soul}, Personality ${map.personality}.`);
  parts.push(`Personal Year: ${map.personal_year}. Personal Day vibration: ${personalDay}. Universal Day vibration: ${universalDay}.`);
  
  // Add specific guidance based on life path
  const lpReduced = map.life_path > 9 ? reduceNumber(map.life_path) : map.life_path;
  const soulReduced = map.soul > 9 ? reduceNumber(map.soul) : map.soul;
  
  parts.push(`The outfit should resonate with the energy of Personal Day ${personalDay}, while honoring the person's Life Path ${lpReduced} (their core identity) and Soul number ${soulReduced} (their inner desires).`);
  parts.push(`Use colors and styles that align with the vibration of the day (${personalDay}) but also complement the person's numerological essence.`);
  
  return parts.join(" ");
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

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Utente non trovato" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let force = false;
    try {
      const body = await req.json();
      force = body?.force === true;
    } catch { /* no body is fine */ }

    const today = new Date().toISOString().split("T")[0];

    // Fetch profile, numerology map, and photos in parallel
    const [profileResult, mapResult, photosResult] = await Promise.all([
      supabase.from("profiles").select("birth_date, sesso").eq("user_id", user.id).single(),
      supabase.from("numerology_maps").select("life_path, destiny_expression, soul, personality, personal_year, personal_year_reference").eq("user_id", user.id).order("computed_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("photos").select("type, storage_path").eq("user_id", user.id),
    ]);

    const profile = profileResult.data;
    const numMap = mapResult.data;

    // Calculate personal day vibration BEFORE cache check
    const universalDay = getUniversalDayVibration();
    let personalDay = universalDay;
    if (numMap) {
      personalDay = getPersonalDayVibration(numMap.personal_year);
    }
    const vibeKey = personalDay > 9 ? reduceNumber(personalDay) : personalDay;

    // Cache key includes vibration so different vibrations = different outfits
    const cachePrefix = `${today}_v${vibeKey}`;

    if (!force) {
      const { data: existingFiles } = await supabase.storage
        .from("user-photos")
        .list(`${user.id}/outfits`, { search: cachePrefix });

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

    // Calculate age
    let userAge: number | null = null;
    if (profile?.birth_date) {
      const birth = new Date(profile.birth_date);
      const now = new Date();
      userAge = now.getFullYear() - birth.getFullYear();
      const monthDiff = now.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
        userAge--;
      }
    }

    // Determine gender
    const gender = profile?.sesso || "M";
    const isFemale = gender === "F";
    const genderLabel = isFemale ? "woman" : "man";

    // Build numerology context
    let numerologyContext = "";
    if (numMap) {
      numerologyContext = buildNumerologyContext(numMap, personalDay, universalDay);
    }

    // Pick style based on personal day vibration
    const vibeStyles = isFemale ? femaleVibeStyles : maleVibeStyles;
    const style = vibeStyles[vibeKey] || vibeStyles[1];

    // Get user photo
    let userPhotoUrl: string | null = null;
    const photos = photosResult.data;
    if (photos && photos.length > 0) {
      const preferred = photos.find(p => p.type === "full_front") || photos.find(p => p.type === "face") || photos[0];
      const { data } = await supabase.storage
        .from("user-photos")
        .createSignedUrl(preferred.storage_path, 600);
      userPhotoUrl = data?.signedUrl || null;
    }

    // Season context
    const season = getCurrentSeason();
    const seasonHint = `SEASON: ${season.name}. ${season.hint} Preferred fabrics: ${season.fabric}. Adapt the outfit to be seasonally appropriate — if the described garments are too heavy or too light for the current season, substitute with equivalent items in suitable fabrics while keeping the same color palette and style.`;

    // Build prompts
    const ageHint = userAge ? `The person is approximately ${userAge} years old — choose clothing styles, cuts and fits appropriate for this age group.` : "";
    const baseRules = `IMPORTANT: SIMPLE, SOBER, EVERYDAY clothing for a ${genderLabel}. ${seasonHint} NO suits with ties, NO flashy accessories, NO gold jewelry, NO ceremonial clothing, NO glitter, NO sequins, NO extravagant fashion. Just clean, well-fitted, normal clothes for a regular ${genderLabel} who wants to look good. Show full body from head to feet in a realistic photo. ${ageHint} ${numerologyContext}`;

    const outfitPrompts = [
      {
        label: "day1",
        prompt: `Generate a realistic full-body photo of a ${genderLabel} wearing this SPECIFIC daytime outfit: ${style.day1}. Mood: ${style.mood}. Setting: modern urban street with natural daylight. ${baseRules}`,
      },
      {
        label: "day2",
        prompt: `Generate a realistic full-body photo of a ${genderLabel} wearing this SPECIFIC ALTERNATIVE daytime outfit (COMPLETELY DIFFERENT garments): ${style.day2}. Mood: ${style.mood}. Setting: bright office entrance or café terrace. ${baseRules}`,
      },
      {
        label: "eve1",
        prompt: `Generate a realistic full-body photo of a ${genderLabel} wearing this SPECIFIC evening outfit for dinner: ${style.eve1}. Mood: ${style.mood}. Setting: upscale restaurant entrance with warm lighting. ${baseRules}`,
      },
      {
        label: "eve2",
        prompt: `Generate a realistic full-body photo of a ${genderLabel} wearing this SPECIFIC ALTERNATIVE evening outfit (COMPLETELY DIFFERENT garments from the first evening look): ${style.eve2}. Mood: ${style.mood}. Setting: stylish lounge bar with ambient lighting. ${baseRules}`,
      },
    ];

    const generateImage = async (prompt: string, label: string) => {
      try {
        const messages: any[] = [];

        if (userPhotoUrl) {
          messages.push({
            role: "user",
            content: [
              { type: "text", text: `Based on this person's appearance (face, skin tone, body type, hair${userAge ? `, age ~${userAge}` : ''}), generate a new full-body image of them wearing the described outfit. Preserve their facial features, skin tone, hair color and body build faithfully. The clothing style must be age-appropriate. This is a ${genderLabel}. ${prompt}` },
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

        const base64 = imageData.replace(/^data:image\/\w+;base64,/, "");
        const binaryData = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

        const filePath = `${user.id}/outfits/${cachePrefix}_${label}.png`;
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
