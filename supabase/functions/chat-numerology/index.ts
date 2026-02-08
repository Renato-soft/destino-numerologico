import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Knowledge base for numerology
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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, profile, numerologyContext, conversationHistory } = await req.json();

    const today = new Date();
    const dayVibration = calculateDayVibration(
      today.getDate(),
      today.getMonth() + 1,
      today.getFullYear()
    );

    // Build context for AI
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

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
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
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "Mi dispiace, non sono riuscito a elaborare la risposta.";

    return new Response(
      JSON.stringify({ response: aiResponse }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in chat-numerology:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        response: "Mi dispiace, si è verificato un errore. Riprova tra qualche istante.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
