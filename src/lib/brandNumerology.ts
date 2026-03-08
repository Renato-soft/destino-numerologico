import { normalizeText, letterToNumber, reduceNumber } from "./numerology";

// Calculate brand name vibration
export function calculateBrandVibration(brandName: string): {
  vibration: number;
  totalSum: number;
  letterBreakdown: { letter: string; value: number }[];
} {
  const normalized = normalizeText(brandName);
  const letterBreakdown = normalized.split("").map((letter) => ({
    letter,
    value: letterToNumber[letter] || 0,
  }));
  const totalSum = letterBreakdown.reduce((sum, l) => sum + l.value, 0);
  const vibration = reduceNumber(totalSum);
  return { vibration, totalSum, letterBreakdown };
}

// Brand vibration interpretations
export const brandVibrationMeanings: Record<
  number,
  {
    title: string;
    energy: string;
    strengths: string[];
    idealFor: string[];
    lessIdealFor: string[];
    color: string;
  }
> = {
  1: {
    title: "Il Leader",
    energy: "Innovazione, indipendenza, autorità",
    strengths: ["Unicità", "Spirito pionieristico", "Identità forte"],
    idealFor: ["Startup innovative", "Personal brand", "Consulenza"],
    lessIdealFor: ["Attività collaborative", "Community-based"],
    color: "from-red-500 to-orange-500",
  },
  2: {
    title: "Il Diplomatico",
    energy: "Collaborazione, sensibilità, equilibrio",
    strengths: ["Fiducia", "Partnership", "Servizio clienti"],
    idealFor: ["Agenzie di mediazione", "Servizi alla persona", "B2B"],
    lessIdealFor: ["Brand aggressivi", "Settori ultra-competitivi"],
    color: "from-blue-400 to-indigo-400",
  },
  3: {
    title: "Il Creativo",
    energy: "Espressione, comunicazione, gioia",
    strengths: ["Creatività", "Comunicazione", "Ispirazione"],
    idealFor: ["Marketing", "Arte e design", "Intrattenimento", "Social media"],
    lessIdealFor: ["Settori rigidi e burocratici"],
    color: "from-yellow-400 to-amber-500",
  },
  4: {
    title: "Il Costruttore",
    energy: "Stabilità, struttura, affidabilità",
    strengths: ["Solidità", "Metodo", "Longevità"],
    idealFor: ["Edilizia", "Finanza", "Logistica", "Manifattura"],
    lessIdealFor: ["Settori che richiedono flessibilità estrema"],
    color: "from-green-600 to-emerald-600",
  },
  5: {
    title: "Il Trasformatore",
    energy: "Cambiamento, libertà, dinamismo",
    strengths: ["Adattabilità", "Freschezza", "Appeal magnetico"],
    idealFor: ["Viaggi", "E-commerce", "Tech", "Moda"],
    lessIdealFor: ["Servizi che richiedono estrema stabilità"],
    color: "from-cyan-500 to-blue-500",
  },
  6: {
    title: "L'Armonizzatore",
    energy: "Cura, bellezza, responsabilità",
    strengths: ["Fiducia", "Estetica", "Senso di appartenenza"],
    idealFor: ["Wellness", "Food", "Design d'interni", "Famiglia"],
    lessIdealFor: ["Settori troppo aggressivi commercialmente"],
    color: "from-pink-400 to-rose-500",
  },
  7: {
    title: "Il Ricercatore",
    energy: "Analisi, profondità, innovazione spirituale",
    strengths: ["Competenza", "Esclusività", "Nicchia"],
    idealFor: ["Ricerca", "Tecnologia avanzata", "Formazione", "Spiritualità"],
    lessIdealFor: ["Mercati di massa", "Fast-moving consumer goods"],
    color: "from-purple-500 to-violet-600",
  },
  8: {
    title: "Il Magnate",
    energy: "Potere, successo finanziario, autorevolezza",
    strengths: ["Ambizione", "Risultati concreti", "Prestigio"],
    idealFor: ["Business ambiziosi", "Luxury", "Real estate", "Investimenti"],
    lessIdealFor: ["Attività no-profit", "Progetti artistici puri"],
    color: "from-amber-600 to-yellow-700",
  },
  9: {
    title: "Il Visionario",
    energy: "Umanità, visione globale, trasformazione",
    strengths: ["Impatto sociale", "Ispirazione", "Portata globale"],
    idealFor: ["No-profit", "Impresa sociale", "Educazione", "Progetti globali"],
    lessIdealFor: ["Business ultra-materialisti"],
    color: "from-indigo-500 to-purple-600",
  },
  11: {
    title: "L'Illuminatore",
    energy: "Visione, ispirazione, leadership spirituale",
    strengths: ["Carisma", "Innovazione visionaria", "Impatto profondo"],
    idealFor: ["Coaching", "Media", "Tecnologia rivoluzionaria", "Spiritualità"],
    lessIdealFor: ["Business tradizionali e conservativi"],
    color: "from-violet-500 to-fuchsia-500",
  },
  22: {
    title: "Il Maestro Costruttore",
    energy: "Realizzazione grandiosa, impatto duraturo",
    strengths: ["Visione + concretezza", "Progetti colossali", "Legacy"],
    idealFor: ["Grandi imprese", "Infrastrutture", "Progetti internazionali"],
    lessIdealFor: ["Micro-business", "Attività temporanee"],
    color: "from-emerald-500 to-teal-600",
  },
  33: {
    title: "Il Maestro Guaritore",
    energy: "Amore universale, servizio, trasformazione collettiva",
    strengths: ["Impatto umanitario", "Guarigione", "Comunità"],
    idealFor: ["Organizzazioni umanitarie", "Salute", "Educazione globale"],
    lessIdealFor: ["Business puramente profit-driven"],
    color: "from-rose-400 to-pink-600",
  },
};

// Objectives for compatibility
export const brandObjectives = [
  { id: "financial", label: "Successo economico", alignedNumbers: [8, 1, 22, 4] },
  { id: "creative", label: "Creatività ed espressione", alignedNumbers: [3, 5, 9, 11] },
  { id: "stability", label: "Stabilità e longevità", alignedNumbers: [4, 6, 8, 22] },
  { id: "innovation", label: "Innovazione e disruption", alignedNumbers: [1, 5, 7, 11] },
  { id: "community", label: "Comunità e impatto sociale", alignedNumbers: [9, 6, 33, 2] },
  { id: "luxury", label: "Lusso e prestigio", alignedNumbers: [8, 1, 7, 22] },
  { id: "wellness", label: "Benessere e crescita personale", alignedNumbers: [6, 7, 9, 33] },
] as const;

// Calculate compatibility score with Life Path
export function getLifePathCompatibility(vibration: number, lifePath: number): {
  score: number;
  description: string;
} {
  // Harmonious pairs
  const harmonyMap: Record<number, number[]> = {
    1: [1, 3, 5, 9],
    2: [2, 4, 6, 8],
    3: [1, 3, 5, 9],
    4: [2, 4, 6, 8, 22],
    5: [1, 3, 5, 7],
    6: [2, 4, 6, 9, 33],
    7: [5, 7, 11],
    8: [2, 4, 8, 22],
    9: [1, 3, 6, 9],
    11: [7, 11, 22],
    22: [4, 8, 11, 22],
    33: [6, 9, 33],
  };

  const base = vibration > 9 ? vibration : vibration;
  const harmonious = harmonyMap[base] || [];

  if (harmonious.includes(lifePath)) {
    return { score: 90, description: "Eccellente allineamento tra il tuo percorso di vita e l'energia del nome." };
  }

  // Check base number compatibility for master numbers
  const baseVib = vibration > 9 ? Math.floor(vibration / 10) + (vibration % 10) : vibration;
  const baseLP = lifePath > 9 ? Math.floor(lifePath / 10) + (lifePath % 10) : lifePath;
  
  if (baseVib === baseLP) {
    return { score: 85, description: "Forte risonanza energetica tra te e questo nome." };
  }

  const diff = Math.abs(baseVib - baseLP);
  if (diff <= 2) {
    return { score: 70, description: "Buona compatibilità. Le energie si completano." };
  }
  if (diff <= 4) {
    return { score: 55, description: "Compatibilità moderata. Potrebbe richiedere adattamento." };
  }
  return { score: 40, description: "Energie diverse. Valuta nomi alternativi per maggiore allineamento." };
}

// Calculate objective compatibility
export function getObjectiveCompatibility(
  vibration: number,
  objectiveId: string
): { score: number; description: string } {
  const objective = brandObjectives.find((o) => o.id === objectiveId);
  if (!objective) return { score: 50, description: "Obiettivo non riconosciuto." };

  const idx = objective.alignedNumbers.indexOf(vibration);
  if (idx === 0) return { score: 95, description: `Perfettamente allineato con l'obiettivo "${objective.label}".` };
  if (idx === 1) return { score: 85, description: `Ottimo allineamento con "${objective.label}".` };
  if (idx >= 2) return { score: 70, description: `Buon supporto per "${objective.label}".` };

  // Check base number
  const baseVib = vibration > 9 ? reduceNumber(vibration) : vibration;
  if (objective.alignedNumbers.includes(baseVib)) {
    return { score: 65, description: `Allineamento indiretto con "${objective.label}".` };
  }

  return { score: 35, description: `Vibrazione non naturalmente allineata con "${objective.label}". Considera un nome alternativo.` };
}

// Suggest alternative names by adjusting letters
export function suggestAlternatives(brandName: string, targetVibration: number): string[] {
  const suggestions: string[] = [];
  const current = calculateBrandVibration(brandName);
  
  if (current.vibration === targetVibration) return [];

  // Suggest adding/removing letters to shift vibration
  const suffixes = ["a", "o", "i", "x", "s", "e", "y"];
  for (const suffix of suffixes) {
    const candidate = brandName + suffix;
    const result = calculateBrandVibration(candidate);
    if (result.vibration === targetVibration && !suggestions.includes(candidate)) {
      suggestions.push(candidate);
    }
    if (suggestions.length >= 3) break;
  }

  return suggestions;
}
