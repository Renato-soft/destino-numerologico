// Riduzione numero civico a cifra singola (1-9, 11, 22, 33)
export function reduceNumber(n: number): number {
  if (n === 11 || n === 22 || n === 33) return n;
  if (n <= 9 && n >= 1) return n;
  let sum = n
    .toString()
    .split("")
    .reduce((a, d) => a + parseInt(d, 10), 0);
  return reduceNumber(sum);
}

export function calculateHouseVibration(civicNumber: string): number {
  // Estrai solo le cifre dal numero civico (es. "12A" → 12, "5/B" → 5)
  const digits = civicNumber.replace(/\D/g, "");
  if (!digits) return 0;
  return reduceNumber(parseInt(digits, 10));
}

export interface HouseVibrationMeaning {
  number: number;
  keyword: string;
  emoji: string;
  energy: string;
  ideal: string;
  notIdeal: string;
  element: string;
  color: string;
  harmonization: string;
}

export const houseVibrations: Record<number, HouseVibrationMeaning> = {
  1: {
    number: 1,
    keyword: "Indipendenza",
    emoji: "🏔️",
    energy: "Energia di leadership, autonomia e nuovi inizi. Questa casa stimola l'individualità, l'ambizione e il coraggio di seguire la propria strada. È un luogo dove nascono idee originali e progetti pionieristici.",
    ideal: "Imprenditori, leader, chi vuole ricominciare, single ambiziosi",
    notIdeal: "Chi cerca vita di coppia armoniosa o lavoro di squadra",
    element: "Fuoco",
    color: "Rosso / Oro",
    harmonization: "Aggiungi elementi di calore e personalità: un angolo studio personale, oggetti che rappresentano i tuoi traguardi. Equilibra con tocchi di verde per ammorbidire l'energia competitiva.",
  },
  2: {
    number: 2,
    keyword: "Armonia",
    emoji: "🌙",
    energy: "Vibrazione di pace, diplomazia e relazioni. Questa casa favorisce l'intimità, la cooperazione e l'ascolto reciproco. Un nido perfetto per coppie e famiglie che cercano equilibrio emotivo.",
    ideal: "Coppie, mediatori, terapisti, chi cerca pace interiore",
    notIdeal: "Chi ha bisogno di forte motivazione individuale",
    element: "Acqua",
    color: "Argento / Bianco perlato",
    harmonization: "Crea spazi morbidi con tessuti naturali, candele e specchi. L'acqua (fontanelle, acquari) amplifica l'energia armonica. Evita colori troppo aggressivi.",
  },
  3: {
    number: 3,
    keyword: "Creatività",
    emoji: "🎨",
    energy: "Vibrazione di espressione, gioia e socialità. Questa casa è un magnete per feste, conversazioni brillanti e progetti artistici. L'energia è vivace, ottimista e comunicativa.",
    ideal: "Artisti, scrittori, famiglie con bambini, chi ama intrattenere",
    notIdeal: "Chi cerca silenzio e concentrazione profonda",
    element: "Aria",
    color: "Giallo / Arancione",
    harmonization: "Riempi gli spazi di arte, musica e colore. Una parete creativa, strumenti musicali visibili e piante fiorite amplificano la vibrazione. Crea un angolo per l'espressione artistica.",
  },
  4: {
    number: 4,
    keyword: "Stabilità",
    emoji: "🏛️",
    energy: "Vibrazione di ordine, sicurezza e costruzione solida. Questa casa è una fortezza: protettiva, strutturata, ideale per mettere radici. L'energia favorisce disciplina e organizzazione.",
    ideal: "Famiglie tradizionali, professionisti, chi costruisce patrimonio",
    notIdeal: "Spiriti liberi, chi cerca avventura e cambiamento",
    element: "Terra",
    color: "Verde scuro / Marrone",
    harmonization: "Mantieni ordine e struttura. Mobili solidi in legno, piante da interno e cristalli di quarzo stabilizzano l'energia. Aggiungi un tocco di leggerezza con elementi decorativi luminosi.",
  },
  5: {
    number: 5,
    keyword: "Dinamismo",
    emoji: "🌪️",
    energy: "Energia di cambiamento, libertà e avventura. Questa casa è un vortice di attività: mai noiosa, sempre in evoluzione. Favorisce viaggi, esperienze nuove e trasformazioni rapide.",
    ideal: "Viaggiatori, freelancer, giovani, chi ama il cambiamento",
    notIdeal: "Chi cerca stabilità assoluta e routine",
    element: "Aria / Fuoco",
    color: "Turchese / Corallo",
    harmonization: "Crea un punto di ancoraggio: un angolo meditazione o uno spazio sacro che bilanci il movimento costante. Cristalli di tormalina nera aiutano a radicare l'energia.",
  },
  6: {
    number: 6,
    keyword: "Amore",
    emoji: "💝",
    energy: "Vibrazione di cura, bellezza e responsabilità familiare. Questa casa è un santuario d'amore: calda, accogliente, perfetta per nutrire relazioni e crescere in armonia.",
    ideal: "Famiglie, coppie, terapeuti, amanti della bellezza",
    notIdeal: "Chi tende al perfezionismo ossessivo (l'energia lo amplifica)",
    element: "Terra / Acqua",
    color: "Rosa / Azzurro pastello",
    harmonization: "Cura l'estetica: fiori freschi, tessuti pregiati, profumi naturali. Un giardino o un balcone fiorito sono perfetti. L'energia richiede bellezza e armonia visiva.",
  },
  7: {
    number: 7,
    keyword: "Introspezione",
    emoji: "🔮",
    energy: "Vibrazione di spiritualità, studio e mistero. Questa casa è un tempio interiore: silenziosa, profonda, ideale per la ricerca spirituale e intellettuale. L'energia favorisce meditazione e intuizione.",
    ideal: "Ricercatori, studiosi, mistici, introversi, scrittori",
    notIdeal: "Chi ama la vita sociale intensa e le feste",
    element: "Acqua / Etere",
    color: "Viola / Indaco",
    harmonization: "Crea una biblioteca o uno spazio sacro. Cristalli di ametista, incenso e illuminazione soffusa amplificano la vibrazione. Mantieni zone di silenzio.",
  },
  8: {
    number: 8,
    keyword: "Abbondanza",
    emoji: "💎",
    energy: "Vibrazione di potere, successo e manifestazione materiale. Questa casa attrae prosperità e riconoscimento. L'energia è forte, ambiziosa e orientata ai risultati concreti.",
    ideal: "Imprenditori, manager, chi vuole costruire ricchezza",
    notIdeal: "Chi ha un rapporto conflittuale con denaro e potere",
    element: "Terra / Fuoco",
    color: "Nero / Oro",
    harmonization: "Arreda con elementi di lusso accessibile: materiali pregiati, simmetria, ordine. Un acquario con pesci rossi è tradizionalmente favorevole. Evita il disordine che blocca l'abbondanza.",
  },
  9: {
    number: 9,
    keyword: "Compassione",
    emoji: "🌍",
    energy: "Vibrazione di umanità, completamento e saggezza universale. Questa casa ha un'energia altruista e inclusiva. Favorisce il servizio agli altri, la guarigione e i grandi ideali.",
    ideal: "Terapeuti, artisti umanitari, filantropi, chi chiude cicli",
    notIdeal: "Chi è focalizzato esclusivamente su interessi personali",
    element: "Fuoco / Etere",
    color: "Bordeaux / Bianco",
    harmonization: "Apri la casa al mondo: ospita, condividi, crea spazi per gli altri. Arte universale, mappe del mondo e simboli di pace amplificano l'energia. Pratica il decluttering regolare.",
  },
  11: {
    number: 11,
    keyword: "Illuminazione",
    emoji: "⚡",
    energy: "Numero Maestro: vibrazione di ispirazione spirituale e intuizione elevata. Questa casa è un portale energetico che amplifica la sensibilità psichica e la connessione con dimensioni superiori.",
    ideal: "Guide spirituali, channel, artisti visionari, coppie evolute",
    notIdeal: "Persone molto ansiose o ipersensibili (l'energia è intensa)",
    element: "Etere / Aria",
    color: "Bianco luminoso / Lilla",
    harmonization: "Crea un altare o spazio sacro. Cristalli di selenite e quarzo ialino. Meditazione quotidiana. L'energia richiede pratiche spirituali regolari per non diventare destabilizzante.",
  },
  22: {
    number: 22,
    keyword: "Costruttore Cosmico",
    emoji: "🏗️",
    energy: "Numero Maestro: vibrazione del grande costruttore che trasforma visioni in realtà. Questa casa supporta progetti ambiziosi su larga scala e legacy durature.",
    ideal: "Visionari, architetti, leader di grandi progetti, fondatori",
    notIdeal: "Chi non è pronto a gestire grande responsabilità",
    element: "Terra / Etere",
    color: "Oro antico / Grigio argento",
    harmonization: "Struttura e visione: una vision board, un ufficio organizzato, simboli dei tuoi grandi obiettivi. L'energia richiede disciplina e ambizione per essere cavalcata al meglio.",
  },
  33: {
    number: 33,
    keyword: "Maestro Guaritore",
    emoji: "🙏",
    energy: "Numero Maestro: vibrazione della guarigione universale e dell'amore incondizionato. Questa casa è un centro di luce che attrae chi ha bisogno di cura e trasformazione.",
    ideal: "Guaritori, insegnanti spirituali, comunità di crescita",
    notIdeal: "Chi non vuole essere disturbato o coinvolto emotivamente",
    element: "Acqua / Etere",
    color: "Verde smeraldo / Bianco",
    harmonization: "Trasforma la casa in un centro di guarigione: cristalli, piante medicinali, spazi per la pratica. L'energia è altissima e richiede consapevolezza e servizio.",
  },
};

export function getHouseLifePathCompatibility(
  houseVibration: number,
  lifePath: number
): { score: number; level: string; description: string } {
  // Matrice di compatibilità semplificata
  const harmonicPairs: Record<number, number[]> = {
    1: [1, 3, 5, 9],
    2: [2, 4, 6, 8],
    3: [1, 3, 5, 9],
    4: [2, 4, 6, 8, 22],
    5: [1, 3, 5, 7, 9],
    6: [2, 4, 6, 8, 9, 33],
    7: [5, 7, 9, 11],
    8: [2, 4, 6, 8, 22],
    9: [1, 3, 5, 6, 7, 9, 33],
    11: [7, 9, 11, 22],
    22: [4, 8, 11, 22, 33],
    33: [6, 9, 22, 33],
  };

  const neutralPairs: Record<number, number[]> = {
    1: [2, 4, 7, 8],
    2: [1, 3, 5, 9],
    3: [2, 4, 6, 7],
    4: [1, 3, 5, 7, 9],
    5: [2, 4, 6, 8],
    6: [1, 3, 5, 7],
    7: [1, 2, 3, 4, 6, 8],
    8: [1, 3, 5, 7, 9],
    9: [2, 4, 8],
    11: [1, 2, 3, 4, 5, 6, 8],
    22: [1, 2, 3, 5, 6, 7, 9],
    33: [1, 2, 3, 4, 5, 7, 8, 11],
  };

  const hKey = houseVibration as number;
  const isHarmonic = harmonicPairs[hKey]?.includes(lifePath);
  const isNeutral = neutralPairs[hKey]?.includes(lifePath);

  if (isHarmonic) {
    return {
      score: 80 + Math.floor(Math.random() * 16), // 80-95
      level: "Eccellente",
      description: `La vibrazione ${houseVibration} della tua casa è in risonanza armonica con il tuo Destino ${lifePath}. L'energia dello spazio amplifica naturalmente i tuoi talenti e supporta il tuo cammino evolutivo. Ti sentirai "a casa" in senso profondo.`,
    };
  }

  if (isNeutral) {
    return {
      score: 50 + Math.floor(Math.random() * 21), // 50-70
      level: "Buona",
      description: `La vibrazione ${houseVibration} è compatibile con il tuo Destino ${lifePath}, anche se non è una risonanza naturale. Con piccoli accorgimenti di armonizzazione puoi creare un ambiente perfettamente allineato alla tua energia.`,
    };
  }

  return {
    score: 25 + Math.floor(Math.random() * 21), // 25-45
    level: "Da Armonizzare",
    description: `La vibrazione ${houseVibration} presenta sfide con il tuo Destino ${lifePath}. Non significa che sia negativa: richiede consapevolezza e accorgimenti specifici per creare armonia. Segui i suggerimenti di armonizzazione per trasformare l'energia.`,
  };
}

// Calcola vibrazione del piano
export function calculateFloorVibration(floor: number): { number: number; influence: string } {
  const reduced = reduceNumber(Math.abs(floor));
  const influences: Record<number, string> = {
    1: "Il piano aggiunge un'energia di indipendenza e visione dall'alto",
    2: "Il piano porta equilibrio e una connessione più intima con lo spazio",
    3: "Il piano amplifica la creatività e la comunicazione sociale",
    4: "Il piano rafforza la stabilità e il radicamento",
    5: "Il piano porta dinamismo e prospettiva mutevole",
    6: "Il piano favorisce il comfort domestico e la cura",
    7: "Il piano intensifica l'introspezione e il distacco dal mondo",
    8: "Il piano potenzia l'ambizione e la visione strategica",
    9: "Il piano eleva verso ideali universali e visione ampia",
  };
  return { number: reduced, influence: influences[reduced] || "" };
}
