import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// API key available via Deno.env.get("LOVABLE_API_KEY")

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Male outfit styles by vibration number
const maleVibeStyles: Record<number, { day1: string; day2: string; eve1: string; eve2: string; swim: string; mood: string }> = {
  1: {
    day1: "dark burgundy polo shirt, charcoal chinos, brown leather belt and shoes",
    day2: "white crew-neck t-shirt under a dark navy zip-up jacket, dark grey jeans, white sneakers",
    eve1: "deep wine button-down shirt, dark grey fitted blazer, black trousers, dark leather shoes",
    eve2: "black turtleneck sweater, dark burgundy trousers, suede ankle boots",
    swim: "solid dark burgundy swim trunks, minimal design, clean cut",
    mood: "authoritative, confident, decisive",
  },
  2: {
    day1: "light blue oxford shirt, beige chinos, white sneakers",
    day2: "soft grey V-neck sweater over white t-shirt, navy chinos, grey suede shoes",
    eve1: "pale blue linen shirt, light grey unstructured blazer, dark navy trousers, loafers",
    eve2: "navy blue knit polo, stone-grey trousers, brown leather loafers",
    swim: "light blue and white patterned board shorts, relaxed fit",
    mood: "harmonious, diplomatic, approachable",
  },
  3: {
    day1: "mustard yellow polo, beige chinos, brown leather belt, tan shoes",
    day2: "warm terracotta henley, dark olive cargo pants, brown boots",
    eve1: "warm ochre button-down shirt, tan cotton blazer, dark brown trousers, cognac shoes",
    eve2: "burnt orange knit sweater, dark indigo jeans, brown suede desert boots",
    swim: "warm terracotta swim trunks with subtle geometric pattern",
    mood: "creative, joyful, expressive",
  },
  4: {
    day1: "olive green polo, khaki trousers, brown leather shoes",
    day2: "camel crew-neck sweater, dark green corduroy trousers, brown boots",
    eve1: "forest green button-down, charcoal wool blazer, dark trousers, black shoes",
    eve2: "dark brown turtleneck, olive green trousers, dark leather ankle boots",
    swim: "olive green solid swim trunks, classic mid-length cut",
    mood: "stable, grounded, reliable",
  },
  5: {
    day1: "bright blue crew-neck t-shirt, grey casual jacket, dark jeans, white sneakers",
    day2: "teal henley shirt, dark grey jogger-chinos, navy blue slip-on sneakers",
    eve1: "cobalt blue fitted shirt, dark grey modern blazer, black trousers, black leather shoes",
    eve2: "steel blue knit polo, dark navy trousers, charcoal suede loafers",
    swim: "cobalt blue and teal color-block swim trunks, sporty cut",
    mood: "adventurous, dynamic, free",
  },
  6: {
    day1: "sage green linen shirt, cream chinos, tan leather shoes",
    day2: "soft mint polo, light beige trousers, white canvas sneakers",
    eve1: "muted green button-down, ivory cotton blazer, beige trousers, cognac loafers",
    eve2: "emerald green V-neck sweater, cream chinos, tan suede shoes",
    swim: "sage green swim trunks with subtle leaf pattern, relaxed fit",
    mood: "caring, elegant, refined",
  },
  7: {
    day1: "navy blue crew-neck sweater, dark grey trousers, minimalist black watch",
    day2: "dark grey henley, black slim jeans, navy blue canvas sneakers",
    eve1: "dark navy fitted shirt, anthracite blazer, black trousers, black leather shoes",
    eve2: "charcoal turtleneck, dark navy trousers, black suede chelsea boots",
    swim: "dark navy solid swim trunks, minimalist design, slim fit",
    mood: "intellectual, mysterious, minimal",
  },
  8: {
    day1: "black polo shirt, charcoal trousers, dark leather belt and shoes",
    day2: "dark grey crew-neck sweater, black jeans, black leather sneakers",
    eve1: "dark charcoal button-down shirt, black fitted blazer, dark trousers, polished black shoes",
    eve2: "black V-neck cashmere sweater, dark grey wool trousers, black leather ankle boots",
    swim: "black swim trunks with subtle charcoal side stripe, tailored fit",
    mood: "powerful, sophisticated, commanding",
  },
  9: {
    day1: "burgundy henley, off-white chinos, brown leather shoes",
    day2: "wine-red crew-neck t-shirt, dark khaki trousers, tan suede boots",
    eve1: "deep wine button-down, cream unstructured blazer, dark burgundy trousers, cognac shoes",
    eve2: "maroon knit polo, dark charcoal trousers, brown leather loafers",
    swim: "burgundy swim trunks with subtle tonal pattern, classic cut",
    mood: "compassionate, wise, universal",
  },
};

// Female outfit styles by vibration number
const femaleVibeStyles: Record<number, { day1: string; day2: string; eve1: string; eve2: string; swim: string; mood: string }> = {
  1: {
    day1: "tailored dark burgundy blazer over white silk blouse, black slim trousers, pointed-toe heels",
    day2: "fitted black turtleneck, charcoal high-waisted pants, burgundy leather bag, ankle boots",
    eve1: "deep wine wrap dress, delicate gold necklace, black stiletto heels",
    eve2: "black fitted jumpsuit, dark red clutch, strappy heels",
    swim: "dark burgundy one-piece swimsuit with elegant cut-out detail, flattering silhouette",
    mood: "authoritative, confident, decisive",
  },
  2: {
    day1: "soft blue cashmere sweater, white midi skirt, nude flats",
    day2: "light grey knit top, powder blue wide-leg pants, white sneakers",
    eve1: "pale blue silk midi dress, silver bracelet, nude heels",
    eve2: "lavender blouse, navy tailored trousers, grey suede pumps",
    swim: "light blue bikini with delicate floral pattern, soft feminine design",
    mood: "harmonious, diplomatic, approachable",
  },
  3: {
    day1: "mustard yellow blouse, camel wide-leg trousers, tan leather sandals",
    day2: "terracotta wrap top, dark olive midi skirt, brown ankle boots",
    eve1: "warm gold satin blouse, dark brown fitted pants, cognac heels",
    eve2: "burnt orange knit dress, tan leather belt, brown suede boots",
    swim: "warm terracotta wrap bikini with golden accents, boho-chic style",
    mood: "creative, joyful, expressive",
  },
  4: {
    day1: "olive green linen shirt dress, brown leather belt, tan sandals",
    day2: "camel turtleneck, dark green corduroy pants, brown boots",
    eve1: "forest green fitted dress, gold stud earrings, dark leather heels",
    eve2: "brown knit sweater, olive tailored trousers, dark ankle boots",
    swim: "olive green one-piece swimsuit, classic sporty design with clean lines",
    mood: "stable, grounded, reliable",
  },
  5: {
    day1: "bright blue silk blouse, white jeans, colorful sneakers",
    day2: "teal wrap top, dark grey tailored pants, navy loafers",
    eve1: "cobalt blue one-shoulder dress, silver earrings, black strappy heels",
    eve2: "steel blue satin blouse, dark navy skirt, charcoal pumps",
    swim: "cobalt blue and teal color-block bikini, sporty-chic cut",
    mood: "adventurous, dynamic, free",
  },
  6: {
    day1: "sage green linen blouse, cream wide-leg pants, woven sandals",
    day2: "soft pink knit top, beige midi skirt, white ballet flats",
    eve1: "emerald green wrap dress, gold pendant, nude heels",
    eve2: "mint green silk blouse, ivory tailored pants, tan leather pumps",
    swim: "sage green bikini with romantic ruffle details, soft elegant design",
    mood: "caring, elegant, refined",
  },
  7: {
    day1: "navy blue cashmere sweater, dark grey slim pants, minimal silver jewelry",
    day2: "charcoal silk blouse, black tailored trousers, dark loafers",
    eve1: "midnight blue midi dress, subtle silver cuff, black heels",
    eve2: "dark grey wrap dress, navy clutch, black suede ankle boots",
    swim: "dark navy one-piece swimsuit, minimalist elegant design, clean silhouette",
    mood: "intellectual, mysterious, minimal",
  },
  8: {
    day1: "black blazer over charcoal top, dark trousers, pointed black heels",
    day2: "dark grey fitted dress, black leather belt, black ankle boots",
    eve1: "black fitted dress, statement silver earrings, black stilettos",
    eve2: "charcoal tailored jumpsuit, dark clutch, polished black heels",
    swim: "black one-piece swimsuit with subtle mesh panel, sophisticated power look",
    mood: "powerful, sophisticated, commanding",
  },
  9: {
    day1: "burgundy wrap blouse, off-white wide-leg pants, brown leather sandals",
    day2: "wine-red knit dress, dark brown belt, tan ankle boots",
    eve1: "deep wine velvet midi dress, gold earrings, cognac heels",
    eve2: "maroon silk blouse, dark charcoal skirt, brown leather pumps",
    swim: "burgundy high-waisted bikini with elegant draping detail, refined style",
    mood: "compassionate, wise, universal",
  },
};

function reduceNumber(num: number): number {
  while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
    num = num
      .toString()
      .split("")
      .reduce((sum, digit) => sum + parseInt(digit), 0);
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
    return {
      name: "spring",
      hint: "Light layers, breathable fabrics. Mild weather ~15-22°C.",
      fabric: "cotton, light linen, light knits, denim",
    };
  } else if (month >= 6 && month <= 8) {
    return {
      name: "summer",
      hint: "Hot weather ~25-35°C. Lightweight, airy clothing. Short sleeves, open shoes.",
      fabric: "linen, light cotton, chambray, breathable blends",
    };
  } else if (month >= 9 && month <= 11) {
    return {
      name: "autumn",
      hint: "Cool weather ~8-18°C. Layering is key. Warm tones.",
      fabric: "wool, corduroy, heavier cotton, suede, leather",
    };
  } else {
    return {
      name: "winter",
      hint: "Cold weather ~0-10°C. Warm, cozy clothing. Coats, scarves, boots.",
      fabric: "wool, cashmere, heavy knits, leather, flannel",
    };
  }
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
  const cold = tempC <= 8;
  const cool = tempC > 8 && tempC <= 17;
  const mild = tempC > 17 && tempC <= 25;

  let season = "summer-like";
  let fabrics = "linen, breathable cotton, light blends";
  let thermalHint = "Use lightweight breathable garments, airy layers and open footwear where appropriate.";

  if (cold) {
    season = "winter-like";
    fabrics = "wool, cashmere, heavy knits, thermal layers";
    thermalHint = "Use warm layers, coat-friendly looks, closed shoes/boots and weather-resistant outerwear.";
  } else if (cool) {
    season = "autumn/spring-like";
    fabrics = "medium-weight cotton, denim, merino, soft wool blends";
    thermalHint = "Use layered outfits: light jacket/cardigan with closed shoes and transitional fabrics.";
  } else if (mild) {
    season = "spring-like";
    fabrics = "cotton, light denim, thin knits, breathable blends";
    thermalHint = "Use light layers and comfortable fabrics suitable for mild temperatures.";
  }

  if (weather === "rainy") {
    thermalHint += " Add rain-friendly details (closed shoes, practical outer layer, avoid delicate fabrics).";
  }
  if (weather === "snowy") {
    thermalHint += " Prioritize insulation and winter-safe footwear (no exposed feet).";
  }
  if (weather === "stormy") {
    thermalHint += " Keep styling practical and protective, with stable footwear and secure layers.";
  }

  return { season, fabrics, hint: thermalHint };
}

async function getLocalWeatherContext(
  residenceState: string,
): Promise<{ location: string; hint: string; fabrics: string; season: string } | null> {
  const normalized = residenceState.trim();
  if (!normalized) return null;

  try {
    const geocodeRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(normalized)}&count=1&language=en&format=json`,
    );
    if (!geocodeRes.ok) return null;

    const geocode = await geocodeRes.json();
    const place = geocode?.results?.[0];
    if (!place?.latitude || !place?.longitude) return null;

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,weather_code&timezone=auto`,
    );
    if (!weatherRes.ok) return null;

    const weatherData = await weatherRes.json();
    const temp = Number(weatherData?.current?.temperature_2m);
    const code = Number(weatherData?.current?.weather_code);
    if (Number.isNaN(temp) || Number.isNaN(code)) return null;

    const styleHints = getWeatherStyleHints(temp, code);
    const weatherLabel = getWeatherLabel(code);
    const location = [place?.name, place?.admin1, place?.country].filter(Boolean).join(", ");

    return {
      location,
      hint: `Current weather is ${weatherLabel} at about ${Math.round(temp)}°C. ${styleHints.hint}`,
      fabrics: styleHints.fabrics,
      season: styleHints.season,
    };
  } catch {
    return null;
  }
}

function extractJsonObject(text: string): any | null {
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

function buildNumerologyContext(map: any, personalDay: number, universalDay: number): string {
  const parts: string[] = [];
  parts.push(
    `Numerology profile: Life Path ${map.life_path}, Expression ${map.destiny_expression}, Soul ${map.soul}, Personality ${map.personality}.`,
  );
  parts.push(
    `Personal Year: ${map.personal_year}. Personal Day vibration: ${personalDay}. Universal Day vibration: ${universalDay}.`,
  );

  // Add specific guidance based on life path
  const lpReduced = map.life_path > 9 ? reduceNumber(map.life_path) : map.life_path;
  const soulReduced = map.soul > 9 ? reduceNumber(map.soul) : map.soul;

  parts.push(
    `The outfit should resonate with the energy of Personal Day ${personalDay}, while honoring the person's Life Path ${lpReduced} (their core identity) and Soul number ${soulReduced} (their inner desires).`,
  );
  parts.push(
    `Use colors and styles that align with the vibration of the day (${personalDay}) but also complement the person's numerological essence.`,
  );

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
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);
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
    } catch {
      /* no body is fine */
    }

    const today = new Date().toISOString().split("T")[0];

    // Fetch profile, numerology map, and photos in parallel
    const [profileResult, mapResult, photosResult] = await Promise.all([
      supabase.from("profiles").select("birth_date, sesso, residence_state, language").eq("user_id", user.id).single(),
      supabase
        .from("numerology_maps")
        .select("life_path, destiny_expression, soul, personality, personal_year, personal_year_reference")
        .eq("user_id", user.id)
        .order("computed_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase.from("photos").select("type, storage_path").eq("user_id", user.id),
    ]);

    const profile = profileResult.data;
    const numMap = mapResult.data;
    const profileLanguage = profile?.language === "en" ? "en" : "it";

    if (!profile?.residence_state?.trim()) {
      return new Response(
        JSON.stringify({
          error:
            profileLanguage === "en"
              ? "Please add your state of residence in your profile to generate weather-adapted outfits."
              : "Aggiungi lo stato in cui vivi nel profilo per generare outfit adattati al meteo locale.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Calculate personal day vibration BEFORE cache check
    const universalDay = getUniversalDayVibration();
    let personalDay = universalDay;
    if (numMap) {
      personalDay = getPersonalDayVibration(numMap.personal_year);
    }
    const vibeKey = personalDay > 9 ? reduceNumber(personalDay) : personalDay;

    // Cache key includes vibration (season changes within a day won't happen, but the season
    // is baked into the prompt so regeneration after season change happens naturally via date change)
    const locationKey = profile.residence_state
      .toLowerCase()
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40);
    const cachePrefix = `${today}_v${vibeKey}_${locationKey || "na"}`;

    if (!force) {
      const { data: existingFiles } = await supabase.storage
        .from("user-photos")
        .list(`${user.id}/outfits`, { search: cachePrefix });

      if (existingFiles && existingFiles.length >= 1) {
        // Return cached outfits, mapping to the 4 expected slots
        const slotLabels = ["day1", "day2", "eve1", "eve2"];
        const urls = await Promise.all(
          slotLabels.map(async (label) => {
            const file = existingFiles.find((f) => f.name.includes(`_${label}.png`));
            if (!file) return null;
            const { data } = await supabase.storage
              .from("user-photos")
              .createSignedUrl(`${user.id}/outfits/${file.name}`, 3600);
            return data?.signedUrl || null;
          }),
        );
        return new Response(JSON.stringify({ outfits: urls }), {
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

    // Get ALL user photos for comprehensive appearance analysis
    const userPhotoUrls: string[] = [];
    const photos = photosResult.data;
    if (photos && photos.length > 0) {
      // Prioritize: face first, then full_front, full_side, then extras
      const sortOrder: Record<string, number> = { face: 0, full_front: 1, full_side: 2 };
      const sorted = [...photos].sort((a, b) => {
        const oa = sortOrder[a.type] ?? 3;
        const ob = sortOrder[b.type] ?? 3;
        return oa - ob;
      });
      // Get signed URLs for all photos (max 6 to avoid token limits)
      const photosToUse = sorted.slice(0, 6);
      const signedResults = await Promise.all(
        photosToUse.map((p) => supabase.storage.from("user-photos").createSignedUrl(p.storage_path, 600))
      );
      for (const result of signedResults) {
        if (result.data?.signedUrl) userPhotoUrls.push(result.data.signedUrl);
      }
    }

    // Weather + season context from user residence (fallback to calendar season)
    const localWeather = await getLocalWeatherContext(profile.residence_state);
    const fallbackSeason = getCurrentSeason();
    const seasonHint = localWeather
      ? `LOCATION: ${localWeather.location}. LOCAL CLIMATE: ${localWeather.season}. ${localWeather.hint} Preferred fabrics: ${localWeather.fabrics}. Keep style and numerological colors, but adapt garments to this real local weather.`
      : `SEASON (fallback): ${fallbackSeason.name}. ${fallbackSeason.hint} Preferred fabrics: ${fallbackSeason.fabric}. Adapt outfit choices to realistic weather comfort.`;

    // Build prompts
    const ageHint = userAge
      ? `The person is approximately ${userAge} years old — choose clothing styles, cuts and fits appropriate for this age group.`
      : "";
    const vibrationEmphasis = `CRITICAL: The outfit MUST align with Personal Day Vibration ${personalDay} (energy: ${style.mood}). The colors, textures and overall feel should channel this specific frequency. This is NOT optional — the numerological alignment is the core purpose of the outfit suggestion.`;
    const baseRules = `IMPORTANT: SIMPLE, SOBER, EVERYDAY clothing for a ${genderLabel}. ${seasonHint} NO suits with ties, NO flashy accessories, NO gold jewelry, NO ceremonial clothing, NO glitter, NO sequins, NO extravagant fashion. Just clean, well-fitted, normal clothes for a regular ${genderLabel} who wants to look good. Show full body from head to feet in a realistic photo. ${ageHint} ${vibrationEmphasis} ${numerologyContext}`;

    const validateGeneratedIdentity = async (candidateImageData: string, label: string) => {
      if (userPhotoUrls.length === 0) {
        return { pass: true, score: 100, mismatches: [] as string[] };
      }

      try {
        const reviewContent: any[] = [
          {
            type: "text",
            text: `Compare the REFERENCE photos with the GENERATED outfit image and return ONLY JSON. Be extremely strict.
Required checks: face identity, hair length/style/color, eyes, expression family, skin tone, body build/proportions (including chest/hip silhouette consistency).
If any critical mismatch exists, pass must be false.
JSON schema:
{
  "pass": boolean,
  "score": number,
  "checks": {
    "face_identity": "match|partial|mismatch",
    "hair": "match|partial|mismatch",
    "eyes": "match|partial|mismatch",
    "expression": "match|partial|mismatch",
    "skin_tone": "match|partial|mismatch",
    "body_build": "match|partial|mismatch"
  },
  "critical_mismatches": string[],
  "reason": string
}`,
          },
        ];

        for (const url of userPhotoUrls) {
          reviewContent.push({ type: "image_url", image_url: { url } });
        }
        reviewContent.push({ type: "image_url", image_url: { url: candidateImageData } });

        const reviewRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${lovableApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [{ role: "user", content: reviewContent }],
          }),
        });

        if (!reviewRes.ok) {
          console.error(`Validation request failed for ${label}`);
          return { pass: false, score: 0, mismatches: ["validation_failed"] };
        }

        const reviewData = await reviewRes.json();
        const rawContent = reviewData?.choices?.[0]?.message?.content;
        const reviewText = Array.isArray(rawContent)
          ? rawContent.map((part: any) => (typeof part === "string" ? part : part?.text || "")).join("\n")
          : String(rawContent || "");

        const parsed = extractJsonObject(reviewText);
        if (!parsed) {
          return { pass: false, score: 0, mismatches: ["invalid_validation_json"] };
        }

        const criticalMismatches = Array.isArray(parsed.critical_mismatches)
          ? parsed.critical_mismatches.map((x: any) => String(x))
          : [];
        const checks = parsed.checks || {};
        const strictMismatchInChecks = ["face_identity", "hair", "eyes", "expression", "skin_tone", "body_build"].some(
          (key) => String(checks[key] || "").toLowerCase() === "mismatch",
        );

        const score = Number(parsed.score || 0);
        const pass = Boolean(parsed.pass) && score >= 90 && criticalMismatches.length === 0 && !strictMismatchInChecks;

        const mismatches = criticalMismatches.length
          ? criticalMismatches
          : strictMismatchInChecks
            ? ["trait_mismatch"]
            : [];

        return { pass, score, mismatches };
      } catch (e) {
        console.error(`Validation error for ${label}:`, e);
        return { pass: false, score: 0, mismatches: ["validation_exception"] };
      }
    };

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

    const generateImage = async (prompt: string, label: string, maxRetries = 3): Promise<string | null> => {
      let correctionNote = "";
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          if (attempt > 0) {
            console.log(`Retry ${attempt}/${maxRetries} for ${label}`);
            await new Promise(r => setTimeout(r, 1000 * attempt));
          }

          const messages: any[] = [];

          if (userPhotoUrls.length > 0) {
            const contentParts: any[] = [
              {
                type: "text",
                text: `I'm providing ${userPhotoUrls.length} reference photo(s) of this person. Carefully analyze ALL photos to understand their exact: face identity, hair length/style/color, eye characteristics, natural expression family, skin tone/complexion, body build and proportions. Then generate a new full-body image of THIS SAME person wearing the described outfit.
IDENTITY LOCK (MANDATORY):
- Do NOT change person identity.
- Do NOT alter hair length/style/color.
- Do NOT alter skin tone.
- Do NOT alter body build/proportions.
- Keep facial identity consistent with reference photos.
- Keep expression coherent with reference identity (not a different person).
If identity is not preserved, the image is invalid and must be regenerated.
${correctionNote ? `Fix previous mismatch: ${correctionNote}` : ""}
The clothing style must be age-appropriate${userAge ? ` (age ~${userAge})` : ""}. This is a ${genderLabel}. ${prompt}`,
              },
            ];
            for (const url of userPhotoUrls) {
              contentParts.push({ type: "image_url", image_url: { url } });
            }
            messages.push({ role: "user", content: contentParts });
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
              model: "google/gemini-3.1-flash-image-preview",
              messages,
              modalities: ["image", "text"],
            }),
          });

          if (!response.ok) {
            const errText = await response.text();
            console.error(`AI error for ${label} (attempt ${attempt}):`, response.status, errText);
            if (attempt === maxRetries) return null;
            continue;
          }

          const data = await response.json();
          const imageData = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

          if (!imageData) {
            console.error(`No image returned for ${label} (attempt ${attempt})`);
            if (attempt === maxRetries) return null;
            continue;
          }

          const validation = await validateGeneratedIdentity(imageData, label);
          if (!validation.pass) {
            console.warn(`Identity mismatch for ${label} on attempt ${attempt}. score=${validation.score}`);
            correctionNote =
              validation.mismatches.length > 0
                ? `Critical mismatches detected: ${validation.mismatches.join(", ")}. Preserve identity traits exactly.`
                : "Preserve identity traits exactly (face, hair, eyes, expression, skin tone, body build).";
            if (attempt === maxRetries) return null;
            continue;
          }

          const base64 = imageData.replace(/^data:image\/\w+;base64,/, "");
          const binaryData = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

          const filePath = `${user.id}/outfits/${cachePrefix}_${label}.png`;
          const { error: uploadError } = await supabase.storage.from("user-photos").upload(filePath, binaryData, {
            contentType: "image/png",
            upsert: true,
          });

          if (uploadError) {
            console.error(`Upload error for ${label}:`, uploadError);
            return null;
          }

          const { data: signedData } = await supabase.storage.from("user-photos").createSignedUrl(filePath, 3600);
          return signedData?.signedUrl || null;
        } catch (e) {
          console.error(`Error generating ${label} (attempt ${attempt}):`, e);
          if (attempt === maxRetries) return null;
        }
      }
      return null;
    };

    // Generate outfits in pairs to reduce concurrent load
    const [day1, day2] = await Promise.all([
      generateImage(outfitPrompts[0].prompt, outfitPrompts[0].label),
      generateImage(outfitPrompts[1].prompt, outfitPrompts[1].label),
    ]);
    const [eve1, eve2] = await Promise.all([
      generateImage(outfitPrompts[2].prompt, outfitPrompts[2].label),
      generateImage(outfitPrompts[3].prompt, outfitPrompts[3].label),
    ]);
    const results = [day1, day2, eve1, eve2];

    if (results.some((item) => !item)) {
      return new Response(
        JSON.stringify({
          error:
            profileLanguage === "en"
              ? "Unable to guarantee a fully consistent identity in all outfits. Please try regenerate."
              : "Non sono riuscito a garantire una coerenza visiva totale in tutti gli outfit. Riprova con rigenera.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Cleanup outfits older than 3 days
    try {
      const { data: allFiles } = await supabase.storage
        .from("user-photos")
        .list(`${user.id}/outfits`);

      if (allFiles && allFiles.length > 0) {
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        const cutoffDate = threeDaysAgo.toISOString().split("T")[0];

        const oldFiles = allFiles.filter((f) => {
          // File names are like 2026-03-24_v7_day1.png
          const dateMatch = f.name.match(/^(\d{4}-\d{2}-\d{2})_/);
          return dateMatch && dateMatch[1] < cutoffDate;
        });

        if (oldFiles.length > 0) {
          const pathsToDelete = oldFiles.map((f) => `${user.id}/outfits/${f.name}`);
          await supabase.storage.from("user-photos").remove(pathsToDelete);
          console.log(`Cleaned up ${oldFiles.length} old outfit files for user ${user.id}`);
        }
      }
    } catch (cleanupErr) {
      console.error("Cleanup error (non-fatal):", cleanupErr);
    }

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
