// I 7 Pilastri del Destino – Contenuti per ogni modulo

export interface PillarContent {
  index: number;
  id: string;
  title: string;
  subtitle: string;
  icon: string; // emoji
  color: string; // tailwind gradient
  mapKey: "soul" | "destiny_expression" | "personality" | "life_path" | null;
  description: string;
  lightQualities: string[];
  shadowQualities: string[];
  exercise: {
    title: string;
    instructions: string[];
    reflection: string;
  };
  meditation: {
    title: string;
    duration: string;
    steps: string[];
  };
  badgeId: string;
  badgeName: string;
  badgeEmoji: string;
}

export const pillarsContent: PillarContent[] = [
  {
    index: 0,
    id: "anima",
    title: "L'Anima",
    subtitle: "Il tuo desiderio più profondo",
    icon: "💎",
    color: "from-violet-500 to-purple-600",
    mapKey: "soul",
    description:
      "Il Numero dell'Anima rivela ciò che ti motiva nel profondo, i tuoi desideri nascosti e la tua vera natura interiore. È il sussurro silenzioso che guida le tue scelte più autentiche.",
    lightQualities: [
      "Connessione con i desideri autentici",
      "Guida interiore chiara",
      "Allineamento tra azione e motivazione",
      "Senso di pienezza e appagamento",
    ],
    shadowQualities: [
      "Repressione dei bisogni profondi",
      "Vivere per le aspettative altrui",
      "Disconnessione dal proprio centro",
      "Insoddisfazione cronica inspiegabile",
    ],
    exercise: {
      title: "Il Diario dell'Anima",
      instructions: [
        "Trova un momento di silenzio, siediti con carta e penna.",
        "Scrivi la domanda: \"Se non avessi paura di nulla, cosa farei della mia vita?\"",
        "Scrivi senza fermarti per 10 minuti, lasciando fluire qualsiasi pensiero.",
        "Rileggi ciò che hai scritto e cerchia le 3 parole che ti colpiscono di più.",
        "Rifletti: queste parole sono presenti nella tua vita quotidiana?",
      ],
      reflection:
        "Le parole che hai cerchiato sono la voce della tua Anima. Ogni volta che le onori nelle tue scelte, stai vivendo in allineamento.",
    },
    meditation: {
      title: "Meditazione del Cuore Profondo",
      duration: "10 minuti",
      steps: [
        "Chiudi gli occhi e porta l'attenzione al centro del petto.",
        "Immagina una luce calda che pulsa nel tuo cuore.",
        "Ad ogni respiro, la luce si espande lentamente.",
        "Chiedi silenziosamente: \"Cosa desidera veramente la mia Anima?\"",
        "Resta in ascolto per 3-5 minuti senza giudicare le risposte.",
        "Ringrazia e apri dolcemente gli occhi.",
      ],
    },
    badgeId: "pillar_anima",
    badgeName: "Guardiano dell'Anima",
    badgeEmoji: "💎",
  },
  {
    index: 1,
    id: "espressione",
    title: "L'Io (Espressione)",
    subtitle: "Come ti manifesti nel mondo",
    icon: "🌟",
    color: "from-amber-500 to-orange-500",
    mapKey: "destiny_expression",
    description:
      "Il Numero dell'Io rivela come ti esprimi, i tuoi talenti naturali e il modo in cui impatti sul mondo. È l'energia che gli altri percepiscono quando interagisci con loro.",
    lightQualities: [
      "Espressione autentica dei talenti",
      "Capacità di comunicare la propria essenza",
      "Impatto positivo sugli altri",
      "Creatività al servizio del mondo",
    ],
    shadowQualities: [
      "Maschere sociali che nascondono il vero sé",
      "Talenti inespressi o soffocati",
      "Perfezionismo paralizzante",
      "Vivere una vita \"di facciata\"",
    ],
    exercise: {
      title: "Lo Specchio dei Talenti",
      instructions: [
        "Chiedi a 3 persone che ti conoscono bene: \"Quali sono le 3 qualità che noti di più in me?\"",
        "Scrivi le risposte senza commentare.",
        "Confronta le risposte: quali qualità si ripetono?",
        "Chiediti: \"Sto usando attivamente questi talenti nella mia vita?\"",
        "Identifica un'azione concreta per esprimere il talento più citato questa settimana.",
      ],
      reflection:
        "I talenti che gli altri vedono in te sono la tua espressione naturale. Coltivarli non è vanità, è allineamento con il tuo scopo.",
    },
    meditation: {
      title: "Meditazione della Luce Creativa",
      duration: "8 minuti",
      steps: [
        "Seduto comodamente, immagina una luce dorata sopra la tua testa.",
        "La luce scende lentamente e avvolge ogni parte del tuo corpo.",
        "Senti ogni cellula vibrare con la tua energia unica.",
        "Visualizza te stesso mentre esprimi il tuo talento più grande.",
        "Senti la gioia e la libertà di quell'espressione.",
        "Porta questa sensazione con te nella giornata.",
      ],
    },
    badgeId: "pillar_espressione",
    badgeName: "Maestro dell'Espressione",
    badgeEmoji: "🌟",
  },
  {
    index: 2,
    id: "personalita",
    title: "La Personalità",
    subtitle: "La maschera e lo scudo",
    icon: "🎭",
    color: "from-emerald-500 to-teal-500",
    mapKey: "personality",
    description:
      "Il Numero della Personalità mostra come il mondo ti percepisce dall'esterno. È la prima impressione, il filtro attraverso cui gli altri interpretano le tue azioni.",
    lightQualities: [
      "Prima impressione autentica e coerente",
      "Capacità di adattamento sociale sano",
      "Presentazione consapevole di sé",
      "Coerenza tra interno ed esterno",
    ],
    shadowQualities: [
      "Maschera rigida che nasconde la vulnerabilità",
      "Bisogno compulsivo di approvazione",
      "Gap tra come appari e chi sei veramente",
      "Ansia sociale e ipercontrollo dell'immagine",
    ],
    exercise: {
      title: "L'Inventario della Maschera",
      instructions: [
        "Dividi un foglio in due colonne: 'Come mi mostro' e 'Come mi sento dentro'.",
        "Per ogni ambito (lavoro, amicizie, famiglia, amore) compila entrambe le colonne.",
        "Osserva le differenze tra le due colonne.",
        "Identifica dove il gap è più grande.",
        "Scegli un ambito dove puoi mostrarti più autenticamente questa settimana.",
      ],
      reflection:
        "La personalità non è un nemico: è il ponte tra il tuo mondo interiore e quello esterno. L'obiettivo non è eliminarla, ma renderla trasparente.",
    },
    meditation: {
      title: "Meditazione dello Specchio Interiore",
      duration: "10 minuti",
      steps: [
        "Chiudi gli occhi e immagina di stare davanti a uno specchio.",
        "Osserva l'immagine riflessa: questa è la tua Personalità.",
        "Ora guarda oltre lo specchio e vedi il tuo vero sé.",
        "Nota le differenze senza giudizio.",
        "Immagina che lo specchio diventi trasparente, unificando le due immagini.",
        "Respira profondamente e accogli l'integrazione.",
      ],
    },
    badgeId: "pillar_personalita",
    badgeName: "Alchimista della Personalità",
    badgeEmoji: "🎭",
  },
  {
    index: 3,
    id: "destino",
    title: "Il Destino",
    subtitle: "Il sentiero della tua vita",
    icon: "🧭",
    color: "from-blue-500 to-indigo-600",
    mapKey: "life_path",
    description:
      "Il Numero del Destino è il più potente della tua mappa. Rappresenta il percorso principale della tua vita, le lezioni che sei qui per imparare e il contributo che sei destinato a dare.",
    lightQualities: [
      "Chiarezza sullo scopo di vita",
      "Senso di direzione e significato",
      "Resilienza nelle sfide (le vedi come lezioni)",
      "Capacità di ispirare gli altri col proprio cammino",
    ],
    shadowQualities: [
      "Resistenza al proprio percorso naturale",
      "Sensazione di essere \"fuori strada\"",
      "Rifiuto delle lezioni karmiche",
      "Confronto distruttivo con il cammino altrui",
    ],
    exercise: {
      title: "La Timeline del Destino",
      instructions: [
        "Disegna una linea orizzontale su un foglio grande.",
        "Segna i momenti chiave della tua vita: scelte, crisi, vittorie, perdite.",
        "Per ogni momento scrivi: \"Cosa ho imparato?\"",
        "Cerca il filo rosso: c'è un tema ricorrente?",
        "Collegalo al significato del tuo Numero del Destino.",
      ],
      reflection:
        "Il tuo Destino non è una prigione: è un invito. Ogni sfida che hai attraversato ti ha preparato per il prossimo passo del cammino.",
    },
    meditation: {
      title: "Meditazione del Sentiero",
      duration: "12 minuti",
      steps: [
        "Chiudi gli occhi e immagina di camminare su un sentiero in un paesaggio naturale.",
        "Il sentiero rappresenta il tuo Destino. Osserva il paesaggio attorno.",
        "Guarda indietro e vedi da dove sei venuto. Onora il cammino fatto.",
        "Guarda avanti: cosa vedi? Lascia che l'intuizione ti mostri il prossimo passo.",
        "Senti la terra sotto i piedi e la fiducia nel tuo percorso.",
        "Apri gli occhi portando con te questa certezza interiore.",
      ],
    },
    badgeId: "pillar_destino",
    badgeName: "Navigatore del Destino",
    badgeEmoji: "🧭",
  },
  {
    index: 4,
    id: "lezioni_karmiche",
    title: "Lezioni Karmiche",
    subtitle: "I numeri assenti nella tua mappa",
    icon: "🔑",
    color: "from-red-500 to-rose-600",
    mapKey: null,
    description:
      "Le Lezioni Karmiche sono i numeri assenti nel tuo nome completo. Rappresentano le energie che devi sviluppare in questa vita, le aree di crescita che richiedono attenzione consapevole.",
    lightQualities: [
      "Consapevolezza delle aree di crescita",
      "Trasformazione delle debolezze in forza",
      "Comprensione dei pattern ripetitivi",
      "Motivazione per l'evoluzione personale",
    ],
    shadowQualities: [
      "Evitamento delle lezioni necessarie",
      "Pattern ripetitivi non riconosciuti",
      "Frustrazione per le stesse sfide che si ripresentano",
      "Senso di inadeguatezza nelle aree karmiche",
    ],
    exercise: {
      title: "Mappa delle Lezioni",
      instructions: [
        "Identifica i numeri assenti dal tuo nome (le tue lezioni karmiche).",
        "Per ogni numero assente, scrivi: \"In quale area della mia vita sento questa mancanza?\"",
        "Ricorda 3 situazioni in cui questa energia ti è mancata.",
        "Per ogni lezione, identifica una piccola azione quotidiana per coltivarla.",
        "Scegli una lezione e praticala consapevolmente per 7 giorni.",
      ],
      reflection:
        "Le lezioni karmiche non sono punizioni: sono opportunità di crescita. Ogni volta che lavori su di esse, espandi la tua coscienza.",
    },
    meditation: {
      title: "Meditazione dell'Integrazione Karmica",
      duration: "10 minuti",
      steps: [
        "Siediti in silenzio e pensa a una sfida ricorrente nella tua vita.",
        "Immagina questa sfida come una porta chiusa davanti a te.",
        "Nella tua mano appare una chiave dorata: è la consapevolezza.",
        "Inserisci la chiave e apri la porta. Cosa c'è dall'altra parte?",
        "Attraversa la porta e senti la nuova energia integrarsi in te.",
        "Ringrazia la lezione per ciò che ti ha insegnato.",
      ],
    },
    badgeId: "pillar_karma",
    badgeName: "Alchimista Karmico",
    badgeEmoji: "🔑",
  },
  {
    index: 5,
    id: "anno_personale",
    title: "Anno Personale",
    subtitle: "L'energia del tuo ciclo attuale",
    icon: "🌀",
    color: "from-cyan-500 to-blue-500",
    mapKey: null,
    description:
      "L'Anno Personale rivela il tema energetico dominante del tuo anno corrente. Comprendere questo ciclo ti permette di navigare le sfide e le opportunità con maggiore consapevolezza.",
    lightQualities: [
      "Sincronizzazione con i cicli naturali",
      "Sfruttamento ottimale delle opportunità",
      "Pazienza nei periodi di attesa",
      "Azione tempestiva nei periodi di espansione",
    ],
    shadowQualities: [
      "Forzare risultati nel periodo sbagliato",
      "Ignorare i segnali di rallentamento",
      "Frustrazione per il ritmo del ciclo",
      "Perdere opportunità per mancanza di consapevolezza",
    ],
    exercise: {
      title: "Il Calendario Consapevole",
      instructions: [
        "Scrivi il numero del tuo Anno Personale attuale.",
        "Leggi il significato del tuo anno e riassumilo in una frase.",
        "Rivedi gli ultimi 3-4 mesi: gli eventi riflettono questo tema?",
        "Identifica 3 azioni che puoi fare per allinearti all'energia dell'anno.",
        "Programma queste azioni nel tuo calendario dei prossimi 30 giorni.",
      ],
      reflection:
        "Vivere in armonia con il tuo Anno Personale è come navigare con il vento a favore. Non si tratta di controllare, ma di fluire.",
    },
    meditation: {
      title: "Meditazione del Ciclo",
      duration: "8 minuti",
      steps: [
        "Chiudi gli occhi e immagina un grande orologio cosmico.",
        "La lancetta indica il tuo Anno Personale attuale.",
        "Senti l'energia di questo numero avvolgerti.",
        "Chiedi: \"Come posso onorare al meglio questo ciclo?\"",
        "Ascolta le risposte che emergono spontaneamente.",
        "Concludi con un respiro profondo di accettazione.",
      ],
    },
    badgeId: "pillar_anno",
    badgeName: "Guardiano del Ciclo",
    badgeEmoji: "🌀",
  },
  {
    index: 6,
    id: "visione_evolutiva",
    title: "Visione Evolutiva",
    subtitle: "La sintesi del tuo cammino",
    icon: "🦅",
    color: "from-fuchsia-500 to-purple-600",
    mapKey: null,
    description:
      "La Visione Evolutiva è la sintesi finale: il punto in cui tutti i numeri convergono in un messaggio unico. È la tua missione più alta, il contributo che solo tu puoi dare al mondo.",
    lightQualities: [
      "Visione chiara del proprio contributo unico",
      "Integrazione di tutti gli aspetti della mappa",
      "Senso di completezza e direzione",
      "Capacità di ispirare attraverso l'esempio",
    ],
    shadowQualities: [
      "Frammentazione: vivere i numeri separatamente",
      "Perdere la visione d'insieme",
      "Sentirsi sopraffatti dalla complessità",
      "Procrastinare la propria missione",
    ],
    exercise: {
      title: "La Lettera dal Futuro",
      instructions: [
        "Immagina di avere 80 anni e di scrivere una lettera al te di oggi.",
        "Scrivi cosa ti diresti: cosa ha contato davvero? Cosa avresti voluto fare prima?",
        "Rileggi la lettera e identifica il messaggio centrale.",
        "Confrontalo con la tua Visione Evolutiva numerologica.",
        "Crea un 'mantra personale' che sintetizzi la tua missione in una frase.",
      ],
      reflection:
        "La tua Visione Evolutiva non è un traguardo futuro: è una qualità che puoi incarnare ogni giorno, in ogni scelta, in ogni respiro.",
    },
    meditation: {
      title: "Meditazione della Visione Suprema",
      duration: "15 minuti",
      steps: [
        "Chiudi gli occhi e immagina di salire in alto, sempre più in alto.",
        "Dall'alto puoi vedere l'intero panorama della tua vita.",
        "Osserva i 6 pilastri precedenti come luci che brillano sotto di te.",
        "Vedi come si connettono formando un disegno unico: il tuo disegno.",
        "Senti la gratitudine per il tuo viaggio e la certezza del tuo cammino.",
        "Scendi dolcemente, portando con te la visione d'insieme.",
      ],
    },
    badgeId: "pillar_visione",
    badgeName: "Visionario Cosmico",
    badgeEmoji: "🦅",
  },
];

// Karmic lessons: numbers missing from full name
export function calculateKarmicLessons(fullName: string): number[] {
  const { normalizeText, letterToNumber } = require("@/lib/numerology");
  const normalized = normalizeText(fullName);
  const presentNumbers = new Set<number>();
  for (const letter of normalized) {
    const num = letterToNumber[letter];
    if (num) presentNumbers.add(num);
  }
  const missing: number[] = [];
  for (let i = 1; i <= 9; i++) {
    if (!presentNumbers.has(i)) missing.push(i);
  }
  return missing;
}
