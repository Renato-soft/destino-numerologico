import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Male outfit styles by vibration number
const maleVibeStyles: Record<number, { day1: string; day2: string; eve1: string; eve2: string; swim: string; intimate: string; bold: string; mood: string }> = {
  1: { day1: "dark burgundy polo shirt, charcoal chinos, brown leather belt and shoes", day2: "white crew-neck t-shirt under a dark navy zip-up jacket, dark grey jeans, white sneakers", eve1: "deep wine button-down shirt, dark grey fitted blazer, black trousers, dark leather shoes", eve2: "black turtleneck sweater, dark burgundy trousers, suede ankle boots", swim: "dark burgundy fitted swim trunks, mid-thigh length", intimate: "dark burgundy boxer briefs, fitted, minimal branding", bold: "dark burgundy fitted boxer briefs, confident athletic pose, editorial fitness style", mood: "authoritative, confident, decisive" },
  2: { day1: "light blue oxford shirt, beige chinos, white sneakers", day2: "soft grey V-neck sweater over white t-shirt, navy chinos, grey suede shoes", eve1: "pale blue linen shirt, light grey unstructured blazer, dark navy trousers, loafers", eve2: "navy blue knit polo, stone-grey trousers, brown leather loafers", swim: "light blue swim trunks with subtle pattern, mid-thigh length", intimate: "soft blue boxer briefs, comfortable cotton blend", bold: "light blue fitted boxer briefs, relaxed confident pose, modern editorial style", mood: "harmonious, diplomatic, approachable" },
  3: { day1: "mustard yellow polo, beige chinos, brown leather belt, tan shoes", day2: "warm terracotta henley, dark olive cargo pants, brown boots", eve1: "warm ochre button-down shirt, tan cotton blazer, dark brown trousers, cognac shoes", eve2: "burnt orange knit sweater, dark indigo jeans, brown suede desert boots", swim: "warm terracotta swim trunks, relaxed fit, mid-thigh", intimate: "mustard yellow boxer briefs, modern cut", bold: "terracotta fitted boxer briefs, expressive confident pose, editorial style", mood: "creative, joyful, expressive" },
  4: { day1: "olive green polo, khaki trousers, brown leather shoes", day2: "camel crew-neck sweater, dark green corduroy trousers, brown boots", eve1: "forest green button-down, charcoal wool blazer, dark trousers, black shoes", eve2: "dark brown turtleneck, olive green trousers, dark leather ankle boots", swim: "olive green swim trunks, classic cut, mid-thigh length", intimate: "dark green boxer briefs, fitted cotton", bold: "olive green fitted boxer briefs, grounded natural pose, editorial fitness style", mood: "stable, grounded, reliable" },
  5: { day1: "bright blue crew-neck t-shirt, grey casual jacket, dark jeans, white sneakers", day2: "teal henley shirt, dark grey jogger-chinos, navy blue slip-on sneakers", eve1: "cobalt blue fitted shirt, dark grey modern blazer, black trousers, black leather shoes", eve2: "steel blue knit polo, dark navy trousers, charcoal suede loafers", swim: "cobalt blue swim trunks with dynamic side stripe, mid-thigh", intimate: "bright blue boxer briefs, athletic fit", bold: "cobalt blue fitted boxer briefs, dynamic athletic pose, sporty editorial style", mood: "adventurous, dynamic, free" },
  6: { day1: "sage green linen shirt, cream chinos, tan leather shoes", day2: "soft mint polo, light beige trousers, white canvas sneakers", eve1: "muted green button-down, ivory cotton blazer, beige trousers, cognac loafers", eve2: "emerald green V-neck sweater, cream chinos, tan suede shoes", swim: "sage green swim trunks, tailored fit, mid-thigh", intimate: "mint green boxer briefs, soft cotton blend", bold: "sage green fitted boxer briefs, natural relaxed pose, editorial style", mood: "caring, elegant, refined" },
  7: { day1: "navy blue crew-neck sweater, dark grey trousers, minimalist black watch", day2: "dark grey henley, black slim jeans, navy blue canvas sneakers", eve1: "dark navy fitted shirt, anthracite blazer, black trousers, black leather shoes", eve2: "charcoal turtleneck, dark navy trousers, black suede chelsea boots", swim: "dark navy swim trunks, minimalist design, mid-thigh", intimate: "charcoal grey boxer briefs, sleek minimal design", bold: "dark navy fitted boxer briefs, minimal confident pose, editorial style", mood: "intellectual, mysterious, minimal" },
  8: { day1: "black polo shirt, charcoal trousers, dark leather belt and shoes", day2: "dark grey crew-neck sweater, black jeans, black leather sneakers", eve1: "dark charcoal button-down shirt, black fitted blazer, dark trousers, polished black shoes", eve2: "black V-neck cashmere sweater, dark grey wool trousers, black leather ankle boots", swim: "black swim trunks, sleek fitted cut, mid-thigh", intimate: "black boxer briefs, premium fitted design", bold: "black fitted boxer briefs, powerful confident pose, premium editorial style", mood: "powerful, sophisticated, commanding" },
  9: { day1: "burgundy henley, off-white chinos, brown leather shoes", day2: "wine-red crew-neck t-shirt, dark khaki trousers, tan suede boots", eve1: "deep wine button-down, cream unstructured blazer, dark burgundy trousers, cognac shoes", eve2: "maroon knit polo, dark charcoal trousers, brown leather loafers", swim: "burgundy swim trunks, classic fit, mid-thigh", intimate: "wine-red boxer briefs, comfortable fitted cut", bold: "burgundy fitted boxer briefs, warm confident pose, editorial style", mood: "compassionate, wise, universal" },
};

const femaleVibeStyles: Record<number, { day1: string; day2: string; eve1: string; eve2: string; swim: string; intimate: string; bold: string; mood: string }> = {
  1: { day1: "tailored dark burgundy blazer over white silk blouse, black slim trousers, pointed-toe heels", day2: "fitted black turtleneck, charcoal high-waisted pants, burgundy leather bag, ankle boots", eve1: "deep wine wrap dress, delicate gold necklace, black stiletto heels", eve2: "black fitted jumpsuit, dark red clutch, strappy heels", swim: "dark burgundy elegant one-piece swimsuit, classic cut", intimate: "deep wine lace bralette and matching briefs, refined and elegant", bold: "deep wine sheer lace bodysuit with plunging neckline, confident empowered pose, sensual but classy editorial boudoir style", mood: "authoritative, confident, decisive" },
  2: { day1: "soft blue cashmere sweater, white midi skirt, nude flats", day2: "light grey knit top, powder blue wide-leg pants, white sneakers", eve1: "pale blue silk midi dress, silver bracelet, nude heels", eve2: "lavender blouse, navy tailored trousers, grey suede pumps", swim: "soft blue elegant one-piece swimsuit with subtle ruching", intimate: "powder blue satin bralette and matching briefs, delicate lace trim", bold: "powder blue sheer lace lingerie set with delicate straps, soft sensual pose, dreamy boudoir editorial", mood: "harmonious, diplomatic, approachable" },
  3: { day1: "mustard yellow blouse, camel wide-leg trousers, tan leather sandals", day2: "terracotta wrap top, dark olive midi skirt, brown ankle boots", eve1: "warm gold satin blouse, dark brown fitted pants, cognac heels", eve2: "burnt orange knit dress, tan leather belt, brown suede boots", swim: "warm terracotta one-piece swimsuit, wrap-style front", intimate: "warm gold satin bralette and matching briefs, refined details", bold: "warm gold sheer bodysuit with lace detailing, joyful confident pose, artistic boudoir editorial", mood: "creative, joyful, expressive" },
  4: { day1: "olive green linen shirt dress, brown leather belt, tan sandals", day2: "camel turtleneck, dark green corduroy pants, brown boots", eve1: "forest green fitted dress, gold stud earrings, dark leather heels", eve2: "brown knit sweater, olive tailored trousers, dark ankle boots", swim: "olive green elegant one-piece swimsuit, classic silhouette", intimate: "forest green satin bralette with lace details and matching briefs", bold: "forest green lace lingerie set with garter belt details, grounded confident pose, luxury boudoir editorial", mood: "stable, grounded, reliable" },
  5: { day1: "bright blue silk blouse, white jeans, colorful sneakers", day2: "teal wrap top, dark grey tailored pants, navy loafers", eve1: "cobalt blue one-shoulder dress, silver earrings, black strappy heels", eve2: "steel blue satin blouse, dark navy skirt, charcoal pumps", swim: "cobalt blue one-piece swimsuit, modern sporty-elegant cut", intimate: "bright blue lace bralette and matching briefs, modern and refined", bold: "electric blue strappy lingerie set with cutout details, dynamic empowered pose, bold boudoir editorial", mood: "adventurous, dynamic, free" },
  6: { day1: "sage green linen blouse, cream wide-leg pants, woven sandals", day2: "soft pink knit top, beige midi skirt, white ballet flats", eve1: "emerald green wrap dress, gold pendant, nude heels", eve2: "mint green silk blouse, ivory tailored pants, tan leather pumps", swim: "sage green elegant one-piece swimsuit with floral detail", intimate: "mint green satin bralette and matching briefs, delicate embroidery", bold: "emerald green silk and lace lingerie set with ribbon details, graceful sensual pose, romantic boudoir editorial", mood: "caring, elegant, refined" },
  7: { day1: "navy blue cashmere sweater, dark grey slim pants, minimal silver jewelry", day2: "charcoal silk blouse, black tailored trousers, dark loafers", eve1: "midnight blue midi dress, subtle silver cuff, black heels", eve2: "dark grey wrap dress, navy clutch, black suede ankle boots", swim: "dark navy elegant one-piece swimsuit, minimalist design", intimate: "charcoal grey satin bralette and matching briefs, sleek minimal design", bold: "midnight blue sheer mesh lingerie set with minimal lace, mysterious alluring pose, dark boudoir editorial", mood: "intellectual, mysterious, minimal" },
  8: { day1: "black blazer over charcoal top, dark trousers, pointed black heels", day2: "dark grey fitted dress, black leather belt, black ankle boots", eve1: "black fitted dress, statement silver earrings, black stilettos", eve2: "charcoal tailored jumpsuit, dark clutch, polished black heels", swim: "black elegant one-piece swimsuit, sculpted design", intimate: "black lace bralette and matching briefs, premium design", bold: "black sheer lace bodysuit with deep V-neckline and subtle straps, powerful commanding pose, luxury boudoir editorial", mood: "powerful, sophisticated, commanding" },
  9: { day1: "burgundy wrap blouse, off-white wide-leg pants, brown leather sandals", day2: "wine-red knit dress, dark brown belt, tan ankle boots", eve1: "deep wine velvet midi dress, gold earrings, cognac heels", eve2: "maroon silk blouse, dark charcoal skirt, brown leather pumps", swim: "burgundy elegant one-piece swimsuit, wrap detail", intimate: "wine-red lace bralette and matching briefs, elegant satin details", bold: "deep wine velvet and lace lingerie set with delicate embroidery, warm empowered pose, intimate boudoir editorial", mood: "compassionate, wise, universal" },
};

function reduceNumber(num: number): number {
  while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
    num = num.toString().split("").reduce((sum, digit) => sum + parseInt(digit), 0);
  }
  return num;
}

function getUniversalDayVibration(): number {
  const today = new Date();
  return reduceNumber(today.getDate() + today.getMonth() + 1 + reduceNumber(today.getFullYear()));
}

function getPersonalDayVibration(personalYear: number): number {
  const today = new Date();
  const personalMonth = reduceNumber(today.getMonth() + 1 + personalYear);
  return reduceNumber(today.getDate() + personalMonth);
}

function getWeatherLabel(code: number): string {
  if ([0].includes(code)) return "clear sky";
  if ([1, 2, 3].includes(code)) return "partly cloudy";
  if ([45, 48].includes(code)) return "foggy";
  if ([51, 53, 55, 56, 57].includes(code)) return "drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "rainy";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "snowy";
  if ([95, 96, 99].includes(code)) return "stormy";
  return "variable";
}

function getWeatherStyleHints(tempC: number, weatherCode: number): { season: string; fabrics: string; hint: string } {
  const weather = getWeatherLabel(weatherCode);
  let season = "summer-like";
  let fabrics = "linen, breathable cotton, light blends";
  let thermalHint = "Use lightweight breathable garments, airy layers and open footwear where appropriate.";

  if (tempC <= 8) {
    season = "winter-like";
    fabrics = "wool, cashmere, heavy knits, thermal layers";
    thermalHint = "Use warm layers, coat-friendly looks, closed shoes/boots and weather-resistant outerwear.";
  } else if (tempC <= 17) {
    season = "autumn/spring-like";
    fabrics = "medium-weight cotton, denim, merino, soft wool blends";
    thermalHint = "Use layered outfits: light jacket/cardigan with closed shoes and transitional fabrics.";
  } else if (tempC <= 25) {
    season = "spring-like";
    fabrics = "cotton, light denim, thin knits, breathable blends";
    thermalHint = "Use light layers and comfortable fabrics suitable for mild temperatures.";
  }

  if (weather === "rainy") thermalHint += " Add rain-friendly details.";
  if (weather === "snowy") thermalHint += " Prioritize insulation and winter-safe footwear.";
  if (weather === "stormy") thermalHint += " Keep styling practical and protective.";

  return { season, fabrics, hint: thermalHint };
}

async function getLocalWeatherContext(residenceState: string): Promise<{ location: string; hint: string; fabrics: string; season: string } | null> {
  const normalized = residenceState.trim();
  if (!normalized) return null;
  try {
    const geocodeRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(normalized)}&count=1&language=en&format=json`);
    if (!geocodeRes.ok) return null;
    const geocode = await geocodeRes.json();
    const place = geocode?.results?.[0];
    if (!place?.latitude || !place?.longitude) return null;

    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,weather_code&timezone=auto`);
    if (!weatherRes.ok) return null;
    const weatherData = await weatherRes.json();
    const temp = Number(weatherData?.current?.temperature_2m);
    const code = Number(weatherData?.current?.weather_code);
    if (Number.isNaN(temp) || Number.isNaN(code)) return null;

    const styleHints = getWeatherStyleHints(temp, code);
    const location = [place?.name, place?.admin1, place?.country].filter(Boolean).join(", ");
    return {
      location,
      hint: `Current weather is ${getWeatherLabel(code)} at about ${Math.round(temp)}°C. ${styleHints.hint}`,
      fabrics: styleHints.fabrics,
      season: styleHints.season,
    };
  } catch {
    return null;
  }
}

function getCurrentSeasonFallback(): { name: string; hint: string; fabric: string } {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return { name: "spring", hint: "Mild weather ~15-22°C.", fabric: "cotton, light linen, light knits" };
  if (month >= 6 && month <= 8) return { name: "summer", hint: "Hot weather ~25-35°C.", fabric: "linen, light cotton, breathable blends" };
  if (month >= 9 && month <= 11) return { name: "autumn", hint: "Cool weather ~8-18°C.", fabric: "wool, corduroy, heavier cotton, suede" };
  return { name: "winter", hint: "Cold weather ~0-10°C.", fabric: "wool, cashmere, heavy knits, leather" };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Non autorizzato" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY non configurata" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const token = authHeader.replace("Bearer ", "");

    let force = false;
    let targetUserId: string | null = null;
    try { const body = await req.json(); force = body?.force === true; targetUserId = body?.target_user_id || null; } catch { /* no body */ }

    // Admin mode: if service role key is used directly and target_user_id is provided
    let userId: string;
    if (token === supabaseKey && targetUserId) {
      userId = targetUserId;
      console.log(`Admin mode: generating for user ${userId}`);
    } else {
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);
      if (userError || !user) {
        return new Response(JSON.stringify({ error: "Utente non trovato" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      userId = user.id;
    }

    const today = new Date().toISOString().split("T")[0];

    // Fetch profile, map, photos in parallel
    const [profileResult, mapResult, photosResult] = await Promise.all([
      supabase.from("profiles").select("birth_date, sesso, residence_state, language").eq("user_id", user.id).single(),
      supabase.from("numerology_maps").select("life_path, destiny_expression, soul, personality, personal_year, personal_year_reference").eq("user_id", user.id).order("computed_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("photos").select("type, storage_path").eq("user_id", user.id),
    ]);

    const profile = profileResult.data;
    const numMap = mapResult.data;
    const profileLanguage = profile?.language === "en" ? "en" : "it";

    if (!profile?.residence_state?.trim()) {
      const msg = profileLanguage === "en"
        ? "Please add your region or city of residence in your profile to generate weather-adapted outfits."
        : "Aggiungi la regione o città in cui vivi nel profilo per generare outfit adattati al meteo locale.";
      return new Response(JSON.stringify({ error: msg }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Vibration
    const universalDay = getUniversalDayVibration();
    let personalDay = universalDay;
    if (numMap) personalDay = getPersonalDayVibration(numMap.personal_year);
    const vibeKey = personalDay > 9 ? reduceNumber(personalDay) : personalDay;

    // Cache prefix
    const locationKey = profile.residence_state.toLowerCase().replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").slice(0, 40);
    const cachePrefix = `${today}_v${vibeKey}_${locationKey || "na"}`;

    // Check cache
    let cachedOutfits: (string | null)[] | null = null;
    if (!force) {
      const { data: existingFiles } = await supabase.storage.from("user-photos").list(`${user.id}/outfits`, { search: cachePrefix });
      if (existingFiles && existingFiles.length >= 1) {
        const slotLabels = ["day1", "day2", "eve1", "eve2"];
        const urls = await Promise.all(
          slotLabels.map(async (label) => {
            const file = existingFiles.find((f) => f.name.includes(`_${label}.png`));
            if (!file) return null;
            const { data } = await supabase.storage.from("user-photos").createSignedUrl(`${user.id}/outfits/${file.name}`, 3600);
            return data?.signedUrl || null;
          }),
        );
        if (urls.every(Boolean)) cachedOutfits = urls;
      }
    }

    // Age
    let userAge: number | null = null;
    if (profile?.birth_date) {
      const birth = new Date(profile.birth_date);
      const now = new Date();
      userAge = now.getFullYear() - birth.getFullYear();
      if (now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) userAge--;
    }

    const gender = profile?.sesso || "M";
    const isFemale = gender === "F";
    const genderLabel = isFemale ? "woman" : "man";

    // Numerology context
    let numerologyContext = "";
    if (numMap) {
      numerologyContext = `Numerology: Life Path ${numMap.life_path}, Expression ${numMap.destiny_expression}, Soul ${numMap.soul}, Personality ${numMap.personality}. Personal Year: ${numMap.personal_year}. Personal Day: ${personalDay}. Universal Day: ${universalDay}. Outfit must resonate with vibration ${personalDay}.`;
    }

    const vibeStyles = isFemale ? femaleVibeStyles : maleVibeStyles;
    const style = vibeStyles[vibeKey] || vibeStyles[1];

    // Get user photo URLs for appearance reference
    const userPhotoUrls: string[] = [];
    const photos = photosResult.data;
    if (photos && photos.length > 0) {
      const sortOrder: Record<string, number> = { face: 0, full_front: 1, full_side: 2 };
      const sorted = [...photos].sort((a, b) => (sortOrder[a.type] ?? 3) - (sortOrder[b.type] ?? 3));
      const photosToUse = sorted.slice(0, 6);
      const signedResults = await Promise.all(
        photosToUse.map((p) => supabase.storage.from("user-photos").createSignedUrl(p.storage_path, 600)),
      );
      for (const result of signedResults) {
        if (result.data?.signedUrl) userPhotoUrls.push(result.data.signedUrl);
      }
    }

    // Weather context
    const localWeather = await getLocalWeatherContext(profile.residence_state);
    const fallbackSeason = getCurrentSeasonFallback();
    const seasonHint = localWeather
      ? `LOCATION: ${localWeather.location}. CLIMATE: ${localWeather.season}. ${localWeather.hint} Fabrics: ${localWeather.fabrics}.`
      : `SEASON: ${fallbackSeason.name}. ${fallbackSeason.hint} Fabrics: ${fallbackSeason.fabric}.`;

    const ageHint = userAge ? `The person is approximately ${userAge} years old — choose age-appropriate styles.` : "";
    const vibrationEmphasis = `CRITICAL: Outfit MUST align with Personal Day Vibration ${personalDay} (energy: ${style.mood}). Colors, textures and feel should channel this frequency.`;
    const baseRules = `SIMPLE, SOBER, EVERYDAY clothing for a ${genderLabel}. ${seasonHint} NO suits with ties, NO flashy accessories, NO gold jewelry, NO ceremonial clothing, NO glitter, NO sequins. Clean, well-fitted, normal clothes. Show full body head to feet in a realistic photo. ${ageHint} ${vibrationEmphasis} ${numerologyContext}`;

    const outfitPrompts = [
      { label: "day1", prompt: `Generate a realistic full-body photo of a ${genderLabel} wearing: ${style.day1}. Mood: ${style.mood}. Setting: modern urban street, natural daylight. ${baseRules}` },
      { label: "day2", prompt: `Generate a realistic full-body photo of a ${genderLabel} wearing: ${style.day2}. Mood: ${style.mood}. Setting: bright café terrace. ${baseRules}` },
      { label: "eve1", prompt: `Generate a realistic full-body photo of a ${genderLabel} wearing: ${style.eve1}. Mood: ${style.mood}. Setting: upscale restaurant, warm lighting. ${baseRules}` },
      { label: "eve2", prompt: `Generate a realistic full-body photo of a ${genderLabel} wearing: ${style.eve2}. Mood: ${style.mood}. Setting: stylish lounge bar, ambient lighting. ${baseRules}` },
    ];

    const swimLingerieRules = isFemale
      ? `ELEGANT, REFINED, TASTEFUL. NO provocative poses, NO explicit content. Classy, sophisticated like a luxury fashion catalog. Show full body. ${ageHint} ${vibrationEmphasis} ${numerologyContext}`
      : `CLEAN, REFINED, TASTEFUL. Show full body. ${ageHint} ${vibrationEmphasis} ${numerologyContext}`;

    const boldRules = isFemale
      ? `BOUDOIR-STYLE empowerment image. SENSUAL, CONFIDENT, EMPOWERING — luxury fashion/boudoir editorial. NOT vulgar, NOT pornographic. Show full body. ${ageHint} ${vibrationEmphasis} ${numerologyContext}`
      : `CONFIDENT editorial-style image. Strong, self-assured. Premium underwear campaign aesthetic. NOT provocative. Show full body. ${ageHint} ${vibrationEmphasis} ${numerologyContext}`;

    const bonusPrompts = [
      { label: "swim", prompt: `Generate a realistic full-body photo of a ${genderLabel} wearing: ${style.swim}. Mood: ${style.mood}. Setting: elegant beach or luxury pool. ${swimLingerieRules}` },
      { label: "intimate", prompt: `Generate a realistic full-body photo of a ${genderLabel} wearing: ${style.intimate}. Mood: ${style.mood}. Setting: clean bright bedroom, editorial style. ${swimLingerieRules}` },
      { label: "bold", prompt: `Generate a realistic full-body photo of a ${genderLabel} wearing: ${style.bold}. Mood: ${style.mood}, empowered, fearless. Setting: ${isFemale ? "luxury boudoir with warm dramatic lighting" : "modern minimalist studio with dramatic side lighting"}. ${boldRules}` },
    ];

    // Simple single-pass image generation — NO validation loop
    const generateImage = async (prompt: string, label: string): Promise<string | null> => {
      try {
        const messages: any[] = [];

        if (userPhotoUrls.length > 0) {
          const contentParts: any[] = [
            {
              type: "text",
              text: `I'm providing reference photos of this person. Study them carefully.

=== IDENTITY LOCK (MANDATORY — DO NOT DEVIATE) ===
You MUST preserve the EXACT identity of this person:
- FACE: Reproduce the EXACT same facial features — eyes shape, nose, lips, jawline, cheekbones. The face must be immediately recognizable as the same person.
- HAIR: Keep the EXACT same hair color, length, texture, and style. Do NOT change hair color or add highlights.
- SKIN: Match the exact skin tone and complexion.
- BODY: Maintain the SAME body proportions or make the person look SLIGHTLY slimmer/more toned. NEVER make the person look heavier, larger, or bigger than in the reference photos. The goal is to make the person feel confident and attractive.
- HEIGHT & BUILD: Keep the same height and overall frame.
- AGE: The person must look the same age as in the photos.

This is about SELF-CONFIDENCE: the person must look at the generated image and immediately recognize themselves, feeling beautiful and empowered. If in doubt, err on the side of a slightly more flattering/slim version rather than adding any weight or changing features.
=== END IDENTITY LOCK ===

The clothing style must be age-appropriate${userAge ? ` (age ~${userAge})` : ""}. This is a ${genderLabel}. ${prompt}`,
            },
          ];
          for (const url of userPhotoUrls) {
            contentParts.push({ type: "image_url", image_url: { url } });
          }
          messages.push({ role: "user", content: contentParts });
        } else {
          messages.push({ role: "user", content: prompt });
        }

        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: { Authorization: `Bearer ${lovableApiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image",
            messages,
            modalities: ["image", "text"],
          }),
        });

        if (!response.ok) {
          console.error(`AI error for ${label}:`, response.status);
          return null;
        }

        const data = await response.json();
        const imageData = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
        if (!imageData) {
          console.error(`No image returned for ${label}`);
          return null;
        }

        // Upload to storage
        const base64 = imageData.replace(/^data:image\/\w+;base64,/, "");
        const binaryData = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
        const filePath = `${user.id}/outfits/${cachePrefix}_${label}.png`;
        const { error: uploadError } = await supabase.storage.from("user-photos").upload(filePath, binaryData, { contentType: "image/png", upsert: true });
        if (uploadError) {
          console.error(`Upload error for ${label}:`, uploadError);
          return null;
        }

        const { data: signedData } = await supabase.storage.from("user-photos").createSignedUrl(filePath, 3600);
        return signedData?.signedUrl || null;
      } catch (e) {
        console.error(`Error generating ${label}:`, e);
        return null;
      }
    };

    let results: (string | null)[] = [];

    if (cachedOutfits) {
      results = cachedOutfits;
    } else {
      // Generate sequentially with longer delay to avoid 429 rate limits
      for (const op of outfitPrompts) {
        const url = await generateImage(op.prompt, op.label);
        results.push(url);
        if (results.length < outfitPrompts.length) {
          await new Promise((r) => setTimeout(r, 8000));
        }
      }
    }

    // Schedule bonus generation in background with shorter delay
    const bonusGenerationPromise = (async () => {
      await new Promise((r) => setTimeout(r, 30_000));
      console.log(`Starting bonus outfit generation for user ${user.id}`);
      const { data: existingBonus } = await supabase.storage.from("user-photos").list(`${user.id}/outfits`, { search: cachePrefix });
      for (let i = 0; i < bonusPrompts.length; i++) {
        const bp = bonusPrompts[i];
        const exists = existingBonus?.some((f) => f.name.includes(`_${bp.label}.png`));
        if (!exists) {
          console.log(`Generating bonus: ${bp.label}`);
          await generateImage(bp.prompt, bp.label);
          console.log(`Completed bonus: ${bp.label}`);
          if (i < bonusPrompts.length - 1) {
            await new Promise((r) => setTimeout(r, 10000));
          }
        }
      }
      console.log(`All bonus outfits completed for user ${user.id}`);
    })();

    try {
      if (typeof (globalThis as any).EdgeRuntime?.waitUntil === "function") {
        (globalThis as any).EdgeRuntime.waitUntil(bonusGenerationPromise);
      }
    } catch { /* fire-and-forget */ }

    // Cleanup old files (>3 days)
    try {
      const { data: allFiles } = await supabase.storage.from("user-photos").list(`${user.id}/outfits`);
      if (allFiles && allFiles.length > 0) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 3);
        const cutoffDate = cutoff.toISOString().split("T")[0];
        const oldFiles = allFiles.filter((f) => { const m = f.name.match(/^(\d{4}-\d{2}-\d{2})_/); return m && m[1] < cutoffDate; });
        if (oldFiles.length > 0) {
          await supabase.storage.from("user-photos").remove(oldFiles.map((f) => `${user.id}/outfits/${f.name}`));
        }
      }
    } catch { /* non-fatal */ }

    // Build outfit description based on vibration and weather
    const colorDescriptions: Record<number, { it: string; en: string }> = {
      1: { it: "rosso borgogna, nero e bianco", en: "burgundy, black and white" },
      2: { it: "azzurro, grigio chiaro e beige", en: "light blue, soft grey and beige" },
      3: { it: "giallo senape, terracotta e marrone", en: "mustard yellow, terracotta and brown" },
      4: { it: "verde oliva, marrone e cammello", en: "olive green, brown and camel" },
      5: { it: "blu cobalto, grigio e teal", en: "cobalt blue, grey and teal" },
      6: { it: "verde salvia, crema e menta", en: "sage green, cream and mint" },
      7: { it: "blu navy, grigio antracite e nero", en: "navy blue, anthracite grey and black" },
      8: { it: "nero, grigio scuro e carbone", en: "black, dark grey and charcoal" },
      9: { it: "borgogna, vino e cognac", en: "burgundy, wine and cognac" },
    };

    const moodTranslations: Record<string, string> = {
      "authoritative, confident, decisive": "autorevolezza, sicurezza e determinazione",
      "harmonious, diplomatic, approachable": "armonia, diplomazia e apertura",
      "creative, joyful, expressive": "creatività, gioia e espressività",
      "stable, grounded, reliable": "stabilità, radicamento e affidabilità",
      "adventurous, dynamic, free": "avventura, dinamismo e libertà",
      "caring, elegant, refined": "cura, eleganza e raffinatezza",
      "intellectual, mysterious, minimal": "introspezione, mistero e minimalismo",
      "powerful, sophisticated, commanding": "potere, sofisticatezza e autorità",
      "compassionate, wise, universal": "compassione, saggezza e universalità",
    };

    const colors = colorDescriptions[vibeKey] || colorDescriptions[1];
    const moodIt = moodTranslations[style.mood] || style.mood;
    const seasonDesc = localWeather ? `${localWeather.season} (${localWeather.location})` : fallbackSeason.name;

    const description = profileLanguage === "en"
      ? `Today's vibration is ${personalDay} — energy of ${style.mood}. The recommended colors are ${colors.en}, chosen to align with your personal frequency and the current ${seasonDesc} weather. These tones strengthen your energetic field and help you express the best of today's vibration.`
      : `La vibrazione di oggi è ${personalDay} — energia di ${moodIt}. I colori consigliati sono ${colors.it}, scelti per allinearsi alla tua frequenza personale e al clima ${seasonDesc} attuale. Queste tonalità rafforzano il tuo campo energetico e ti aiutano a esprimere il meglio della vibrazione odierna.`;

    return new Response(JSON.stringify({ outfits: results, description }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("generate-outfits error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Errore sconosciuto" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
