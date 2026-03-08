import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const sectionDefinitions = [
  {
    key: "introduzione",
    title: "Introduzione Personalizzata",
    prompt: `Scrivi un'introduzione calda e personalizzata per {nome} {cognome}, nato/a il {birth_date}. 
Presenta il report come un viaggio di scoperta interiore. Spiega brevemente cosa scoprirà nelle prossime pagine. 
Usa un tono accogliente, profondo e ispirante. Circa 300 parole.`
  },
  {
    key: "numeri_principali",
    title: "Analisi dei Numeri Principali",
    prompt: `Analizza in profondità i numeri principali di {nome}:
- Destino (Life Path): {life_path}
- Io (Espressione): {destiny_expression}  
- Anima: {soul}
- Personalità: {personality}
- Quintessenza: {quintessenza}

Per ogni numero fornisci:
1. Il significato profondo e archetipico
2. Come si manifesta nella vita quotidiana
3. I talenti nascosti che porta
4. Le sfide evolutive associate
5. Come interagisce con gli altri numeri della mappa

Scrivi in modo discorsivo e personale, rivolgendoti direttamente a {nome}. Circa 800 parole.`
  },
  {
    key: "dinamiche_karmiche",
    title: "Dinamiche Karmiche",
    prompt: `Analizza le dinamiche karmiche per {nome} basandoti sulla sua mappa numerologica.
Numeri: Destino {life_path}, Io {destiny_expression}, Anima {soul}, Personalità {personality}.

Esplora:
1. I numeri assenti o ricorrenti e il loro significato karmico
2. Le lezioni che l'anima ha scelto di affrontare in questa vita
3. I pattern ripetitivi che potrebbero presentarsi
4. Come trasformare le sfide karmiche in opportunità di crescita
5. Il rapporto tra il Destino e l'Anima: cosa desidera vs dove sta andando

Tono profondo ma accessibile. Circa 500 parole.`
  },
  {
    key: "fase_vita",
    title: "Fase di Vita Attuale",
    prompt: `Analizza la fase di vita attuale di {nome}, nato/a nel {birth_year}.
Anno Personale {current_year}: {personal_year}
Cicli di vita: Primo ciclo (numero {cycle1}), Secondo ciclo (numero {cycle2}), Terzo ciclo (numero {cycle3}).

Descrivi:
1. In quale ciclo di vita si trova attualmente e cosa significa
2. L'energia dell'Anno Personale corrente e come navigarla al meglio
3. Le opportunità specifiche di questo periodo
4. Cosa lasciar andare e cosa coltivare
5. Previsioni energetiche per i prossimi mesi

Sii concreto e pratico. Circa 500 parole.`
  },
  {
    key: "strategie_evolutive",
    title: "Strategie Evolutive",
    prompt: `Basandoti sulla mappa di {nome} (Destino {life_path}, Io {destiny_expression}, Anima {soul}, Personalità {personality}, Anno Personale {personal_year}), fornisci strategie evolutive concrete.

Includi:
1. Le 5 aree di vita su cui focalizzarsi quest'anno
2. Pratiche quotidiane allineate ai numeri personali
3. Relazioni: che tipo di persone cercare e quali dinamiche trasformare
4. Carriera: direzioni allineate al Destino e all'Io
5. Crescita spirituale: come integrare la numerologia nella vita di tutti i giorni
6. Un piano d'azione in 3 fasi per i prossimi 12 mesi

Sii specifico e orientato all'azione. Circa 600 parole.`
  },
  {
    key: "conclusione",
    title: "Conclusione Ispirazionale",
    prompt: `Scrivi una conclusione ispirazionale per il report numerologico di {nome}.
I suoi numeri: Destino {life_path}, Io {destiny_expression}, Anima {soul}.

La conclusione deve:
1. Sintetizzare il messaggio centrale della mappa in modo poetico
2. Ricordare a {nome} la sua unicità e il suo potenziale
3. Offrire una visione elevata del suo cammino
4. Chiudere con un messaggio di empowerment e fiducia
5. Includere un "mantra personale" basato sui suoi numeri

Tono elevato, emotivo, memorabile. Circa 300 parole.`
  }
];

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

    // Verify user
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { report_id } = await req.json();

    // Fetch profile and map
    const [profileRes, mapRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user.id).single(),
      supabase.from("numerology_maps").select("*").eq("user_id", user.id)
        .order("computed_at", { ascending: false }).limit(1).single(),
    ]);

    if (!profileRes.data || !mapRes.data) {
      return new Response(JSON.stringify({ error: "Profile or map not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const profile = profileRes.data;
    const map = mapRes.data;
    const birthYear = new Date(profile.birth_date).getFullYear();
    const currentYear = new Date().getFullYear();

    // Calculate quintessenza
    let q = map.destiny_expression + map.life_path;
    while (q > 9 && q !== 11 && q !== 22) {
      q = q.toString().split("").reduce((s: number, d: string) => s + parseInt(d), 0);
    }

    // Parse cycles
    const cycles = typeof map.cycles_json === "string" ? JSON.parse(map.cycles_json) : map.cycles_json;

    const replacements: Record<string, string> = {
      "{nome}": profile.nome,
      "{cognome}": profile.cognome,
      "{birth_date}": new Date(profile.birth_date).toLocaleDateString("it-IT"),
      "{birth_year}": String(birthYear),
      "{life_path}": String(map.life_path),
      "{destiny_expression}": String(map.destiny_expression),
      "{soul}": String(map.soul),
      "{personality}": String(map.personality),
      "{quintessenza}": String(q),
      "{personal_year}": String(map.personal_year),
      "{current_year}": String(currentYear),
      "{cycle1}": String(cycles?.firstCycle?.number ?? ""),
      "{cycle2}": String(cycles?.secondCycle?.number ?? ""),
      "{cycle3}": String(cycles?.thirdCycle?.number ?? ""),
    };

    const fillTemplate = (text: string) => {
      let result = text;
      for (const [key, value] of Object.entries(replacements)) {
        result = result.replaceAll(key, value);
      }
      return result;
    };

    const sections: Record<string, { title: string; content: string }> = {};
    const generatedSoFar: string[] = [];

    // Generate each section sequentially to avoid rate limits
    for (const section of sectionDefinitions) {
      const prompt = fillTemplate(section.prompt);

      const contextNote = generatedSoFar.length > 0
        ? `\n\nIMPORTANTE: Queste sezioni sono GIÀ state scritte nel report (NON ripetere saluti, presentazioni, frasi di benvenuto o concetti già espressi):\n${generatedSoFar.map((s, i) => `--- Sezione ${i + 1} ---\n${s.substring(0, 200)}...`).join("\n")}\n\nScrivi SOLO il contenuto della sezione richiesta senza ripetere frasi come "Caro/a {nome}", "che gioia", "che onore" o simili aperture già usate. Vai dritto al contenuto.`
        : "";

      const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: `Sei un esperto numerologico pitagorico che scrive report professionali e personalizzati. 
Scrivi in italiano, in modo discorsivo, profondo e accessibile. 
NON usare markdown, asterischi, hashtag o formattazione tecnica. 
Usa paragrafi naturali. Rivolgiti direttamente alla persona con il suo nome.
Non inventare numeri o calcoli: usa solo i dati forniti.

REGOLE FONDAMENTALI DI STILE:
- NON iniziare MAI con "Caro/a [nome]" o frasi di saluto/benvenuto (a meno che non sia la primissima sezione del report)
- NON ripetere frasi come "che gioia", "che onore", "è un piacere"
- Ogni sezione deve avere un'apertura UNICA e DIVERSA dalle altre
- Varia il tuo stile: a volte inizia con una domanda retorica, a volte con un'affermazione, a volte con una metafora
- Evita formule ripetitive tra le sezioni`
            },
            { role: "user", content: prompt + contextNote },
          ],
        }),
      });

      if (!aiResponse.ok) {
        const errText = await aiResponse.text();
        console.error(`AI error for ${section.key}:`, aiResponse.status, errText);

        if (aiResponse.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limit exceeded. Riprova tra qualche minuto." }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (aiResponse.status === 402) {
          return new Response(JSON.stringify({ error: "Crediti AI esauriti." }), {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        sections[section.key] = { title: section.title, content: "Sezione non disponibile." };
        continue;
      }

      const aiData = await aiResponse.json();
      const content = aiData.choices?.[0]?.message?.content || "Contenuto non generato.";
      sections[section.key] = { title: section.title, content };
      generatedSoFar.push(content);

      // Small delay between requests to avoid rate limits
      await new Promise(r => setTimeout(r, 500));
    }

    // Update the report record
    await supabase
      .from("advanced_reports")
      .update({
        sections,
        status: "ready",
        generated_at: new Date().toISOString(),
      })
      .eq("id", report_id)
      .eq("user_id", user.id);

    return new Response(JSON.stringify({ success: true, sections }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Report generation error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
