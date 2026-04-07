import {
  calculateLifePath,
  calculateExpression,
  calculateSoul,
  calculatePersonality,
  numberMeanings,
  masterMeanings,
} from "./numerology";

export interface PersonNumbers {
  lifePath: number;
  expression: number;
  soul: number;
  personality: number;
}

export interface CompatibilityResult {
  overall: number;
  emotional: number;
  communicative: number;
  professional: number;
  challenges: number;
  growth: number;
  details: {
    lifePath: NumberComparison;
    soul: NumberComparison;
    expression: NumberComparison;
    personality: NumberComparison;
  };
  frictionPoints: string[];
  suggestions: string[];
  dynamicDescription: string;
  challengeDescription: string;
  growthDescription: string;
}

export interface NumberComparison {
  a: number;
  b: number;
  score: number;
  note: string;
}

// Compatibility matrix: how well two numbers work together (1-10)
const compatibilityMatrix: Record<string, number> = {
  "1-1": 6, "1-2": 7, "1-3": 8, "1-4": 5, "1-5": 9, "1-6": 6, "1-7": 5, "1-8": 7, "1-9": 8,
  "2-2": 7, "2-3": 8, "2-4": 7, "2-5": 5, "2-6": 9, "2-7": 6, "2-8": 5, "2-9": 7,
  "3-3": 7, "3-4": 4, "3-5": 9, "3-6": 8, "3-7": 5, "3-8": 6, "3-9": 8,
  "4-4": 6, "4-5": 4, "4-6": 7, "4-7": 8, "4-8": 9, "4-9": 5,
  "5-5": 7, "5-6": 5, "5-7": 7, "5-8": 6, "5-9": 8,
  "6-6": 8, "6-7": 5, "6-8": 6, "6-9": 9,
  "7-7": 7, "7-8": 5, "7-9": 7,
  "8-8": 6, "8-9": 6,
  "9-9": 7,
};

function getBaseNumber(n: number): number {
  if (n === 11) return 2;
  if (n === 22) return 4;
  if (n === 33) return 6;
  return n;
}

function getPairScore(a: number, b: number): number {
  const baseA = getBaseNumber(a);
  const baseB = getBaseNumber(b);
  const min = Math.min(baseA, baseB);
  const max = Math.max(baseA, baseB);
  const key = `${min}-${max}`;
  return compatibilityMatrix[key] ?? 5;
}

function getComparisonNote(a: number, b: number, type: string): string {
  const score = getPairScore(a, b);
  const mA = numberMeanings[getBaseNumber(a)];
  const mB = numberMeanings[getBaseNumber(b)];
  
  if (score >= 8) {
    return `Il ${a} e il ${b} creano una sinergia naturale. ${mA?.keywords[0]} e ${mB?.keywords[0]} si completano a vicenda.`;
  } else if (score >= 6) {
    return `Il ${a} e il ${b} possono collaborare bene con qualche aggiustamento. ${mA?.keywords[0]} incontra ${mB?.keywords[0]}.`;
  } else {
    return `Il ${a} e il ${b} richiedono comprensione reciproca. ${mA?.keywords[0]} e ${mB?.keywords[0]} possono generare attrito.`;
  }
}

function generateFrictionPoints(a: PersonNumbers, b: PersonNumbers): string[] {
  const points: string[] = [];
  const mA = numberMeanings[getBaseNumber(a.lifePath)];
  const mB = numberMeanings[getBaseNumber(b.lifePath)];

  if (getPairScore(a.lifePath, b.lifePath) < 6) {
    points.push(`Il tuo Destino ${a.lifePath} (${mA?.keywords[0]}) e il suo ${b.lifePath} (${mB?.keywords[0]}) hanno direzioni diverse. Serve rispetto reciproco per i percorsi individuali.`);
  }

  if (getPairScore(a.soul, b.soul) < 6) {
    const sA = numberMeanings[getBaseNumber(a.soul)];
    const sB = numberMeanings[getBaseNumber(b.soul)];
    points.push(`A livello emotivo, i vostri desideri profondi divergono: tu cerchi ${sA?.keywords[0]}, l'altro cerca ${sB?.keywords[0]}.`);
  }

  if (getPairScore(a.expression, b.expression) < 6) {
    const eA = numberMeanings[getBaseNumber(a.expression)];
    const eB = numberMeanings[getBaseNumber(b.expression)];
    points.push(`Nella comunicazione, il tuo stile (${eA?.keywords[0]}) e il suo (${eB?.keywords[0]}) possono creare incomprensioni.`);
  }

  if (getPairScore(a.personality, b.personality) < 6) {
    const pA = numberMeanings[getBaseNumber(a.personality)];
    const pB = numberMeanings[getBaseNumber(b.personality)];
    points.push(`Le vostre maschere sociali sono molto diverse: ${pA?.keywords[0]} vs ${pB?.keywords[0]}.`);
  }

  if (points.length === 0) {
    points.push("Non emergono particolari punti di attrito significativi. Un buon equilibrio complessivo.");
  }

  return points;
}

function generateSuggestions(a: PersonNumbers, b: PersonNumbers): string[] {
  const suggestions: string[] = [];
  const mA = numberMeanings[getBaseNumber(a.lifePath)];
  const mB = numberMeanings[getBaseNumber(b.lifePath)];

  if (getBaseNumber(b.lifePath) === 1) {
    suggestions.push(`Il suo ${b.lifePath} vibra con leadership. Evita scontri diretti, meglio un approccio collaborativo.`);
  }
  if (getBaseNumber(a.soul) !== getBaseNumber(b.soul)) {
    const sB = numberMeanings[getBaseNumber(b.soul)];
    suggestions.push(`L'altro ha bisogno di ${sB?.keywords[0]} a livello profondo. Rispetta questo bisogno per creare armonia.`);
  }
  if (getBaseNumber(b.expression) === 7) {
    suggestions.push(`Il suo ${b.expression} cerca introspezione. Rispetta i suoi spazi di solitudine e riflessione.`);
  }
  if (getBaseNumber(a.personality) !== getBaseNumber(b.personality)) {
    suggestions.push(`Ricorda che la prima impressione può ingannare: il modo in cui vi mostrate al mondo è diverso da ciò che siete dentro.`);
  }

  suggestions.push(`Comunicate apertamente le vostre esigenze: il tuo Destino ${a.lifePath} e il suo ${b.lifePath} hanno bisogni diversi che vanno riconosciuti.`);

  return suggestions.slice(0, 4);
}

function generateDynamic(a: PersonNumbers, b: PersonNumbers, overall: number): string {
  const mA = numberMeanings[getBaseNumber(a.lifePath)];
  const mB = numberMeanings[getBaseNumber(b.lifePath)];

  if (overall >= 80) {
    return `La vostra relazione ha un forte potenziale. Il tuo ${a.lifePath} (${mA?.keywords[0]}) e il suo ${b.lifePath} (${mB?.keywords[0]}) creano un'armonia naturale. Questa è una connessione che può portare crescita reciproca e una comprensione profonda. La chiave è mantenere autenticità e rispetto per le differenze sottili.`;
  } else if (overall >= 60) {
    return `La vostra relazione offre opportunità di crescita. Il tuo ${a.lifePath} (${mA?.keywords[0]}) e il suo ${b.lifePath} (${mB?.keywords[0]}) portano prospettive complementari. Alcune differenze richiedono lavoro consapevole, ma questa tensione creativa può rendere la relazione stimolante e evolutiva.`;
  } else {
    return `La vostra relazione richiede impegno e comprensione reciproca. Il tuo ${a.lifePath} (${mA?.keywords[0]}) e il suo ${b.lifePath} (${mB?.keywords[0]}) hanno direzioni diverse. Non è impossibile, ma servono dialogo costante, pazienza e accettazione delle differenze fondamentali.`;
  }
}

function generateChallengeDescription(a: PersonNumbers, b: PersonNumbers, challengeScore: number): string {
  const mA = numberMeanings[getBaseNumber(a.lifePath)];
  const mB = numberMeanings[getBaseNumber(b.lifePath)];

  if (challengeScore >= 70) {
    return `Le sfide tra voi sono gestibili e costruttive. Le differenze tra il ${a.lifePath} (${mA?.keywords[0]}) e il ${b.lifePath} (${mB?.keywords[0]}) si trasformano facilmente in opportunità di crescita. Pochi ostacoli importanti si frappongono tra voi.`;
  } else if (challengeScore >= 45) {
    return `Ci sono sfide moderate da affrontare. Le differenze nella visione del mondo (${mA?.keywords[0]} vs ${mB?.keywords[0]}) possono creare tensioni, ma con dialogo e comprensione reciproca potete superarle e rafforzare il legame.`;
  } else {
    return `Le sfide sono significative e richiedono impegno consapevole. Le energie del ${a.lifePath} e del ${b.lifePath} tendono a scontrarsi. Servono pazienza, compromesso e una comunicazione molto aperta per navigare le differenze.`;
  }
}

function generateGrowthDescription(a: PersonNumbers, b: PersonNumbers, growthScore: number): string {
  const mA = numberMeanings[getBaseNumber(a.lifePath)];
  const mB = numberMeanings[getBaseNumber(b.lifePath)];

  if (growthScore >= 70) {
    return `Questa relazione offre un enorme potenziale di crescita reciproca. Il ${a.lifePath} impara ${mB?.keywords[1] || mB?.keywords[0]} dall'altro, mentre il ${b.lifePath} sviluppa ${mA?.keywords[1] || mA?.keywords[0]} grazie a te. Insieme evolverete più velocemente che da soli.`;
  } else if (growthScore >= 45) {
    return `C'è un buon potenziale di crescita, soprattutto nelle aree in cui siete diversi. Il contrasto tra ${mA?.keywords[0]} e ${mB?.keywords[0]} vi spinge fuori dalla zona di comfort, stimolando l'evoluzione personale di entrambi.`;
  } else {
    return `La crescita reciproca richiede uno sforzo intenzionale. Le vostre energie sono molto simili o molto distanti, il che può limitare lo stimolo alla crescita. Cercate attività e interessi nuovi da esplorare insieme per sbloccare il potenziale evolutivo.`;
  }
}

export function calculateCompatibility(a: PersonNumbers, b: PersonNumbers): CompatibilityResult {
  const lifePathScore = getPairScore(a.lifePath, b.lifePath);
  const soulScore = getPairScore(a.soul, b.soul);
  const expressionScore = getPairScore(a.expression, b.expression);
  const personalityScore = getPairScore(a.personality, b.personality);

  // 5 dimensions
  const emotional = Math.round(((soulScore * 5 + lifePathScore * 3 + personalityScore * 2) / 10) * 10);
  const communicative = Math.round(((expressionScore * 5 + personalityScore * 3 + soulScore * 2) / 10) * 10);
  const professional = Math.round(((expressionScore * 4 + lifePathScore * 3 + personalityScore * 2 + soulScore * 1) / 10) * 10);
  
  // Challenges: inverse of friction — lower friction scores = higher challenge score means easier
  const avgDiff = (lifePathScore + soulScore + expressionScore + personalityScore) / 4;
  const challenges = Math.round(avgDiff * 10);
  
  // Growth: based on diversity (different numbers = more growth potential)
  const diversityBonus = (getBaseNumber(a.lifePath) !== getBaseNumber(b.lifePath) ? 2 : 0)
    + (getBaseNumber(a.soul) !== getBaseNumber(b.soul) ? 2 : 0)
    + (getBaseNumber(a.expression) !== getBaseNumber(b.expression) ? 1 : 0)
    + (getBaseNumber(a.personality) !== getBaseNumber(b.personality) ? 1 : 0);
  const growth = Math.min(100, Math.round((avgDiff * 8) + (diversityBonus * 5)));

  const overall = Math.round(emotional * 0.25 + communicative * 0.20 + professional * 0.20 + challenges * 0.15 + growth * 0.20);

  const challengeDescription = generateChallengeDescription(a, b, challenges);
  const growthDescription = generateGrowthDescription(a, b, growth);

  return {
    overall,
    emotional,
    communicative,
    professional,
    challenges,
    growth,
    details: {
      lifePath: { a: a.lifePath, b: b.lifePath, score: lifePathScore * 10, note: getComparisonNote(a.lifePath, b.lifePath, "Life Path") },
      soul: { a: a.soul, b: b.soul, score: soulScore * 10, note: getComparisonNote(a.soul, b.soul, "Anima") },
      expression: { a: a.expression, b: b.expression, score: expressionScore * 10, note: getComparisonNote(a.expression, b.expression, "Espressione") },
      personality: { a: a.personality, b: b.personality, score: personalityScore * 10, note: getComparisonNote(a.personality, b.personality, "Personalità") },
    },
    frictionPoints: generateFrictionPoints(a, b),
    suggestions: generateSuggestions(a, b),
    dynamicDescription: generateDynamic(a, b, overall),
    challengeDescription,
    growthDescription,
  };
}

export function calculatePersonBNumbers(
  nome: string,
  cognome: string,
  birthDate: string
): PersonNumbers {
  const [year, month, day] = birthDate.split("-").map(Number);
  const fullName = `${nome} ${cognome}`;

  return {
    lifePath: calculateLifePath(day, month, year),
    expression: calculateExpression(fullName),
    soul: calculateSoul(fullName),
    personality: calculatePersonality(fullName),
  };
}
