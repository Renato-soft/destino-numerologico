import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Persona pool with language
const personas = [
  // Italian
  { name: "Gianluca M.", lang: "it" },
  { name: "Valentina R.", lang: "it" },
  { name: "Federica N.", lang: "it" },
  { name: "Marco B.", lang: "it" },
  { name: "Chiara L.", lang: "it" },
  { name: "Alessandra P.", lang: "it" },
  // English
  { name: "Emily W.", lang: "en" },
  { name: "James K.", lang: "en" },
  { name: "Sarah T.", lang: "en" },
  { name: "Michael R.", lang: "en" },
  { name: "Olivia H.", lang: "en" },
  // French
  { name: "Marie-Claire D.", lang: "fr" },
  { name: "Antoine L.", lang: "fr" },
  { name: "Sophie B.", lang: "fr" },
  { name: "Pierre M.", lang: "fr" },
  // Hungarian
  { name: "Kovács Anna", lang: "hu" },
  { name: "Nagy Péter", lang: "hu" },
  { name: "Szabó Katalin", lang: "hu" },
  // Spanish
  { name: "María José G.", lang: "es" },
  { name: "Carlos R.", lang: "es" },
  { name: "Lucía F.", lang: "es" },
  // Brazilian Portuguese
  { name: "Rafael S.", lang: "pt" },
  { name: "Camila O.", lang: "pt" },
  { name: "Bruno L.", lang: "pt" },
];

const postTemplates: Record<string, string[]> = {
  it: [
    "Oggi il mio numero personale del giorno è il {n}! Sento un'energia incredibile, qualcun altro lo percepisce?",
    "Ho appena scoperto che il mio Anno Personale {n} sta influenzando ogni scelta che faccio. È tutto più chiaro adesso!",
    "La Mappa Numerologica mi ha rivelato cose che non avrei mai immaginato. Il mio Destino {n} spiega tanti schemi nella mia vita.",
    "Qualcuno ha provato la compatibilità numerologica? Io e il mio partner abbiamo un {n}% e devo dire che ci azzecca!",
    "L'analisi giornaliera di stamattina era perfetta: settore lavoro al top con vibrazione {n}. E infatti è stata una giornata pazzesca!",
    "I Pilastri della Crescita sono fantastici. Ho completato il pilastro {n} e mi sento davvero trasformata.",
    "Sto attraversando un Anno Personale {n} e tutto sembra allinearsi. Le date favorevoli sono state utilissime.",
    "La vibrazione del mio nome è {n}. Ho cambiato il modo di firmarmi e sento già la differenza!",
    "Il numero dell'Anima {n} mi ha fatto capire perché cerco sempre certe cose nella vita. Incredibile.",
    "Buongiorno community! Chi altro è in Anno Personale {n}? Confrontiamoci! 🌟",
    "Ho fatto l'analisi del Brand per la mia attività: vibrazione {n}. Ha spiegato perfettamente perché attiravamo certi clienti.",
    "La numerologia della casa mi ha dato vibrazione {n}. Ora capisco l'energia di questo posto!",
  ],
  en: [
    "Just found out my Life Path is {n}! It explains SO much about my career choices 🤯",
    "Personal Year {n} energy is hitting different. Anyone else feeling the shift?",
    "The daily analysis nailed it today — sector love at vibration {n}. Had an amazing conversation with someone special!",
    "Completed Pillar {n} of the Growth Path! The meditation exercise was deeply moving.",
    "My Soul number is {n} and reading the description felt like looking in a mirror. This app is incredible.",
    "Who else is in Personal Year {n}? Let's share our experiences and support each other! ✨",
    "The compatibility feature showed {n}% with my best friend. We always knew we were soul-connected!",
    "Destiny number {n} — the archetype description is spot on. I finally understand my life patterns.",
    "Brand analysis gave my startup a vibration of {n}. Changed the tagline and already seeing results!",
    "Morning reflection: today's number is {n}. Setting my intentions accordingly 🙏",
  ],
  fr: [
    "Mon Chemin de Vie est le {n} ! Ça explique tellement de choses sur ma personnalité 💫",
    "Année Personnelle {n} : je sens une transformation profonde en cours. Quelqu'un d'autre le ressent ?",
    "L'analyse quotidienne était parfaite aujourd'hui. Vibration {n} dans le secteur finances !",
    "J'ai terminé le Pilier {n} du parcours de croissance. La méditation était magnifique 🧘‍♀️",
    "Mon nombre d'Âme est {n}. La description m'a donné des frissons tellement c'était précis.",
    "Qui d'autre est en Année Personnelle {n} ? Partageons nos expériences ! 🌙",
    "La compatibilité avec mon partenaire : {n}%. Ça confirme ce que je ressentais !",
    "L'analyse de marque a donné la vibration {n} à mon entreprise. Très révélateur.",
    "Bonjour la communauté ! Vibration du jour : {n}. Qu'est-ce que ça vous inspire ?",
    "Le nombre de Destinée {n} m'a ouvert les yeux sur mes schémas répétitifs. Merci la numérologie !",
  ],
  hu: [
    "Az Életút számom {n}! Most már értem, miért vonzódom bizonyos dolgokhoz 🔮",
    "Személyes Év {n}: hatalmas változásokat érzek. Ki van még ebben az évben?",
    "A napi elemzés ma tökéletes volt! {n}-es vibráció a munka szektorban, és tényleg fantasztikus napom volt.",
    "Befejeztem a {n}. Pillért a Növekedés Útján. A meditáció csodálatos élmény volt!",
    "A Lélek számom {n}. A leírás annyira pontos volt, hogy szinte megríkatott.",
    "Ki más van Személyes Év {n}-ben? Osszuk meg a tapasztalatainkat! ✨",
    "A kompatibilitás elemzés {n}%-ot mutatott a párommal. Teljesen egyezik az érzéseimmel!",
    "A Sors szám {n} mindent megmagyaráz az eddigi életemben. Lenyűgöző!",
    "Jó reggelt mindenkinek! A mai nap vibrációja: {n}. Mit éreztek ti?",
    "A márka elemzés {n}-es vibrációt adott. Most már értem a vállalkozásom energiáját!",
  ],
  es: [
    "¡Mi Camino de Vida es el {n}! Ahora entiendo tantas cosas sobre mi personalidad 🌟",
    "Año Personal {n}: siento una transformación increíble. ¿Alguien más lo siente?",
    "El análisis diario acertó de pleno hoy. ¡Vibración {n} en el sector amor! 💕",
    "Completé el Pilar {n} del Camino de Crecimiento. La meditación fue hermosa.",
    "Mi número del Alma es {n}. La descripción fue como leer mi diario personal.",
    "¿Quién más está en Año Personal {n}? ¡Compartamos experiencias! ✨",
    "La compatibilidad con mi pareja dio {n}%. ¡Confirma todo lo que sentía!",
    "Número de Destino {n}: el arquetipo me describe perfectamente. Es impresionante.",
    "Buenos días comunidad! Vibración del día: {n}. ¿Qué les inspira?",
    "El análisis de marca dio vibración {n} a mi negocio. ¡Muy revelador!",
  ],
  pt: [
    "Meu Caminho de Vida é o {n}! Agora entendo tanta coisa sobre minha jornada 🌟",
    "Ano Pessoal {n}: sinto uma energia de transformação incrível. Alguém mais sente isso?",
    "A análise diária acertou em cheio hoje! Vibração {n} no setor trabalho 💪",
    "Completei o Pilar {n} do Caminho de Crescimento. A meditação foi muito profunda.",
    "Meu número da Alma é {n}. A descrição parecia que estava falando diretamente comigo.",
    "Quem mais está no Ano Pessoal {n}? Vamos trocar experiências! ✨",
    "A compatibilidade com meu parceiro deu {n}%. Faz total sentido!",
    "Número de Destino {n}: o arquétipo explica padrões que eu nunca tinha percebido.",
    "Bom dia comunidade! Vibração do dia: {n}. O que vocês sentem?",
    "A análise de marca deu vibração {n} pro meu negócio. Muito revelador!",
  ],
};

const commentTemplates: Record<string, string[]> = {
  it: [
    "Bellissimo post! Anche io sono un {n}, mi ritrovo tantissimo! 🙌",
    "Che bello leggere queste esperienze! La numerologia sta cambiando la mia vita.",
    "Concordo al 100%! L'Anno Personale {n} è davvero trasformativo.",
    "Grazie per aver condiviso! Mi hai ispirato a esplorare di più la mia mappa.",
    "Anche il mio partner ha il {n}! Quante coincidenze 😍",
    "Ho provato anch'io e i risultati sono sorprendenti. Vibrazione {n} fortissima!",
    "Che esperienza meravigliosa! Continua a condividere con noi 💫",
  ],
  en: [
    "Love this! I'm a {n} too and can totally relate! 🙌",
    "So inspiring to read! Numerology has changed my perspective completely.",
    "Agree 100%! Personal Year {n} is truly transformative.",
    "Thanks for sharing! You've inspired me to dive deeper into my map.",
    "Same vibration here! Number {n} energy is powerful ✨",
    "This resonates so much. The daily analysis is always spot on!",
    "Beautiful experience! Keep sharing with us 💫",
  ],
  fr: [
    "J'adore ! Je suis aussi un {n}, je me retrouve tellement ! 🙌",
    "Quel beau témoignage ! La numérologie change vraiment ma vision.",
    "Totalement d'accord ! L'Année Personnelle {n} est transformatrice.",
    "Merci pour ce partage ! Tu m'inspires à explorer ma carte 💫",
    "Même vibration ici ! Le {n} est puissant ✨",
    "Ça résonne tellement. L'analyse quotidienne est toujours juste !",
    "Quelle belle expérience ! Continue à partager avec nous 🌙",
  ],
  hu: [
    "Csodálatos! Nekem is {n}-es, teljesen átérzem! 🙌",
    "Nagyon inspiráló! A numerológia teljesen megváltoztatta a szemléletemet.",
    "100%-ban egyetértek! A Személyes Év {n} valóban átalakító erejű.",
    "Köszönöm a megosztást! Inspiráltál, hogy mélyebben megismerjem a térképemet 💫",
    "Ugyanez a vibráció itt is! A {n}-es energia nagyon erős ✨",
    "Ez annyira rezonál. A napi elemzés mindig pontos!",
    "Gyönyörű élmény! Folytasd a megosztást velünk 🌟",
  ],
  es: [
    "¡Me encanta! Yo también soy un {n}, me identifico totalmente! 🙌",
    "¡Qué inspirador! La numerología ha cambiado mi perspectiva completamente.",
    "¡Totalmente de acuerdo! El Año Personal {n} es verdaderamente transformador.",
    "¡Gracias por compartir! Me inspiras a explorar más mi mapa 💫",
    "¡Misma vibración aquí! La energía del {n} es poderosa ✨",
    "Esto resuena muchísimo. ¡El análisis diario siempre acierta!",
    "¡Hermosa experiencia! Sigue compartiendo con nosotros 🌟",
  ],
  pt: [
    "Amei! Eu também sou {n}, me identifico demais! 🙌",
    "Que inspirador! A numerologia mudou completamente minha visão.",
    "Concordo 100%! O Ano Pessoal {n} é realmente transformador.",
    "Obrigado por compartilhar! Você me inspirou a explorar mais meu mapa 💫",
    "Mesma vibração aqui! A energia do {n} é poderosa ✨",
    "Isso ressoa demais. A análise diária sempre acerta!",
    "Experiência linda! Continue compartilhando conosco 🌟",
  ],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateUUID() {
  return crypto.randomUUID();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const langs = ["it", "en", "fr", "hu", "es", "pt"];
    const newPosts: any[] = [];
    const newComments: any[] = [];
    const newReactions: any[] = [];

    // Generate 10 new posts
    for (let i = 0; i < 10; i++) {
      const lang = pick(langs);
      const persona = pick(personas.filter((p) => p.lang === lang));
      const templates = postTemplates[lang];
      const template = pick(templates);
      const n = randInt(1, 9);
      const content = template.replace(/\{n\}/g, String(n));
      const userId = generateUUID();
      const postId = generateUUID();

      // Offset the created_at randomly within the last 24 hours
      const hoursAgo = randInt(0, 23);
      const minutesAgo = randInt(0, 59);
      const createdAt = new Date(Date.now() - hoursAgo * 3600000 - minutesAgo * 60000).toISOString();

      newPosts.push({
        id: postId,
        user_id: userId,
        author_name: persona.name,
        content,
        personal_year: randInt(1, 9),
        created_at: createdAt,
        updated_at: createdAt,
      });

      // Add 1-3 comments to each new post
      const numComments = randInt(1, 3);
      for (let j = 0; j < numComments; j++) {
        const cLang = pick(langs);
        const cPersona = pick(personas.filter((p) => p.lang === cLang));
        const cTemplate = pick(commentTemplates[cLang]);
        const cN = randInt(1, 9);
        const cContent = cTemplate.replace(/\{n\}/g, String(cN));
        const commentCreatedAt = new Date(
          new Date(createdAt).getTime() + randInt(5, 300) * 60000
        ).toISOString();

        newComments.push({
          id: generateUUID(),
          post_id: postId,
          user_id: generateUUID(),
          author_name: cPersona.name,
          content: cContent,
          created_at: commentCreatedAt,
        });
      }

      // Add 1-2 reactions to each new post
      const numReactions = randInt(1, 2);
      for (let k = 0; k < numReactions; k++) {
        newReactions.push({
          id: generateUUID(),
          post_id: postId,
          user_id: generateUUID(),
          vibration: randInt(1, 9),
          created_at: createdAt,
        });
      }
    }

    // Insert new posts
    const { error: postErr } = await supabase.from("community_posts").insert(newPosts);
    if (postErr) throw postErr;

    // Insert comments on new posts
    const { error: commentErr } = await supabase.from("community_comments").insert(newComments);
    if (commentErr) throw commentErr;

    // Insert reactions
    const { error: reactErr } = await supabase.from("community_reactions").insert(newReactions);
    if (reactErr) throw reactErr;

    // Now add ~10 comments to existing past posts
    const { data: existingPosts } = await supabase
      .from("community_posts")
      .select("id")
      .order("created_at", { ascending: false })
      .limit(50);

    if (existingPosts && existingPosts.length > 0) {
      const pastComments: any[] = [];
      for (let i = 0; i < 10; i++) {
        const post = pick(existingPosts);
        const cLang = pick(langs);
        const cPersona = pick(personas.filter((p) => p.lang === cLang));
        const cTemplate = pick(commentTemplates[cLang]);
        const cN = randInt(1, 9);
        const cContent = cTemplate.replace(/\{n\}/g, String(cN));

        pastComments.push({
          id: generateUUID(),
          post_id: post.id,
          user_id: generateUUID(),
          author_name: cPersona.name,
          content: cContent,
          created_at: new Date().toISOString(),
        });
      }

      const { error: pastErr } = await supabase.from("community_comments").insert(pastComments);
      if (pastErr) throw pastErr;
    }

    return new Response(
      JSON.stringify({
        success: true,
        posts_created: newPosts.length,
        comments_on_new: newComments.length,
        comments_on_past: 10,
        reactions_created: newReactions.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
