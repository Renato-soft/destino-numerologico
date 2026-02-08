// Numerology Knowledge - Pitagorica
// This module contains the knowledge base for numerological calculations

// Letter to number mapping (Pythagorean)
export const letterToNumber: Record<string, number> = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9,
};

// Vowels for Soul number calculation
export const vowels = ['A', 'E', 'I', 'O', 'U'];

// Accented characters normalization
const accentMap: Record<string, string> = {
  'À': 'A', 'Á': 'A', 'Â': 'A', 'Ä': 'A', 'Ã': 'A',
  'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E',
  'Ì': 'I', 'Í': 'I', 'Î': 'I', 'Ï': 'I',
  'Ò': 'O', 'Ó': 'O', 'Ô': 'O', 'Ö': 'O', 'Õ': 'O',
  'Ù': 'U', 'Ú': 'U', 'Û': 'U', 'Ü': 'U',
};

// Normalize text: uppercase, remove accents, keep only letters
export function normalizeText(text: string): string {
  return text
    .toUpperCase()
    .split('')
    .map(char => accentMap[char] || char)
    .filter(char => /[A-Z]/.test(char))
    .join('');
}

// Master numbers (not reduced)
export const masterNumbers = [11, 22, 33];

// Reduce a number to single digit or master number
export function reduceNumber(num: number): number {
  while (num > 9 && !masterNumbers.includes(num)) {
    num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  }
  return num;
}

// Calculate sum of letters
export function sumLetters(text: string): number {
  const normalized = normalizeText(text);
  return normalized
    .split('')
    .reduce((sum, letter) => sum + (letterToNumber[letter] || 0), 0);
}

// Calculate Life Path from birth date
export function calculateLifePath(day: number, month: number, year: number): number {
  // Reduce each component separately
  const reducedDay = reduceNumber(day);
  const reducedMonth = reduceNumber(month);
  const reducedYear = reduceNumber(year);
  
  // Sum and reduce
  const sum = reducedDay + reducedMonth + reducedYear;
  return reduceNumber(sum);
}

// Calculate Destiny/Expression number from full name
export function calculateExpression(fullName: string): number {
  const sum = sumLetters(fullName);
  return reduceNumber(sum);
}

// Calculate Soul number from vowels
export function calculateSoul(fullName: string): number {
  const normalized = normalizeText(fullName);
  const sum = normalized
    .split('')
    .filter(letter => vowels.includes(letter))
    .reduce((sum, letter) => sum + (letterToNumber[letter] || 0), 0);
  return reduceNumber(sum);
}

// Calculate Personality number from consonants
export function calculatePersonality(fullName: string): number {
  const normalized = normalizeText(fullName);
  const sum = normalized
    .split('')
    .filter(letter => !vowels.includes(letter))
    .reduce((sum, letter) => sum + (letterToNumber[letter] || 0), 0);
  return reduceNumber(sum);
}

// Calculate Personal Year
// Formula: birth day + birth month + current year (each reduced, then sum reduced)
export function calculatePersonalYear(birthDay: number, birthMonth: number, currentYear: number): number {
  // Do NOT reduce day and month individually - add them as-is, then reduce
  // The correct formula is: day + month + (year digits summed until single/master)
  const yearReduced = reduceNumber(currentYear);
  const sum = birthDay + birthMonth + yearReduced;
  return reduceNumber(sum);
}

// Calculate Personal Month
export function calculatePersonalMonth(personalYear: number, month: number): number {
  const sum = personalYear + month;
  return reduceNumber(sum);
}

// Calculate Life Cycles
export function calculateLifeCycles(day: number, month: number, year: number): {
  firstCycle: { number: number; startYear: number; endYear: number };
  secondCycle: { number: number; startYear: number; endYear: number };
  thirdCycle: { number: number; startYear: number };
} {
  const firstCycleNumber = reduceNumber(month);
  const secondCycleNumber = reduceNumber(day);
  const thirdCycleNumber = reduceNumber(year);

  // Transition ages: ~28-30 for first, ~55-56 for second
  const birthYear = year;
  const firstTransitionStart = birthYear + 28;
  const firstTransitionEnd = birthYear + 30;
  const secondTransitionStart = birthYear + 55;
  const secondTransitionEnd = birthYear + 56;

  return {
    firstCycle: {
      number: firstCycleNumber,
      startYear: birthYear,
      endYear: firstTransitionEnd,
    },
    secondCycle: {
      number: secondCycleNumber,
      startYear: firstTransitionStart,
      endYear: secondTransitionEnd,
    },
    thirdCycle: {
      number: thirdCycleNumber,
      startYear: secondTransitionStart,
    },
  };
}

// Calculate day vibration (for favorable dates)
export function calculateDayVibration(day: number, month: number, year: number): number {
  const sum = day + month + reduceNumber(year);
  return reduceNumber(sum);
}

// Number meanings (base 1-9)
export const numberMeanings: Record<number, {
  keywords: string[];
  talents: string[];
  shadows: string[];
  evolution: string;
}> = {
  1: {
    keywords: ['iniziativa', 'autonomia', 'leadership'],
    talents: ['indipendenza', 'coraggio', 'spirito pionieristico'],
    shadows: ['egoismo', 'impulsività', 'difficoltà a collaborare'],
    evolution: 'imparare a guidare senza dominare',
  },
  2: {
    keywords: ['collaborazione', 'sensibilità', 'relazione'],
    talents: ['empatia', 'diplomazia', 'ascolto'],
    shadows: ['dipendenza', 'insicurezza', 'paura del conflitto'],
    evolution: 'sviluppare fiducia in sé',
  },
  3: {
    keywords: ['comunicazione', 'creatività', 'espressione'],
    talents: ['entusiasmo', 'arte', 'socialità'],
    shadows: ['dispersione', 'superficialità'],
    evolution: 'dare forma concreta alle idee',
  },
  4: {
    keywords: ['struttura', 'stabilità', 'metodo'],
    talents: ['affidabilità', 'costanza', 'concretezza'],
    shadows: ['rigidità', 'paura del cambiamento'],
    evolution: 'costruire senza irrigidirsi',
  },
  5: {
    keywords: ['cambiamento', 'libertà', 'esperienza'],
    talents: ['adattabilità', 'curiosità'],
    shadows: ['instabilità', 'eccessi'],
    evolution: 'libertà con responsabilità',
  },
  6: {
    keywords: ['responsabilità', 'amore', 'armonia'],
    talents: ['cura', 'senso estetico', 'protezione'],
    shadows: ['controllo', 'sacrificio eccessivo'],
    evolution: 'amare senza annullarsi',
  },
  7: {
    keywords: ['introspezione', 'ricerca', 'spiritualità'],
    talents: ['analisi', 'profondità', 'intuizione'],
    shadows: ['isolamento', 'diffidenza'],
    evolution: 'fidarsi e condividere',
  },
  8: {
    keywords: ['potere', 'realizzazione', 'materia'],
    talents: ['leadership', 'gestione', 'successo'],
    shadows: ['materialismo', 'durezza'],
    evolution: 'usare il potere con etica',
  },
  9: {
    keywords: ['umanità', 'chiusura', 'servizio'],
    talents: ['compassione', 'visione ampia'],
    shadows: ['vittimismo', 'dispersione emotiva'],
    evolution: 'lasciare andare il passato',
  },
};

// Master number meanings
export const masterMeanings: Record<number, {
  name: string;
  description: string;
  baseInfluence: number;
}> = {
  11: {
    name: 'Visione',
    description: 'Intuizione, ispirazione, risveglio. Richiede consapevolezza e centratura.',
    baseInfluence: 2,
  },
  22: {
    name: 'Maestro Costruttore',
    description: 'Capacità di realizzare grandi progetti concreti con impatto duraturo.',
    baseInfluence: 4,
  },
  33: {
    name: 'Amore Universale',
    description: 'Servizio, guida compassionevole. Richiede equilibrio emotivo e responsabilità.',
    baseInfluence: 6,
  },
};

// Personal Year meanings (brief)
export const personalYearMeanings: Record<number, string> = {
  1: 'Nuovi inizi, decisioni, autonomia. Anno per prendere in mano la propria vita.',
  2: 'Collaborazione, pazienza, relazioni. Anno per lavorare con gli altri.',
  3: 'Espansione, comunicazione, creatività. Anno per esprimersi e socializzare.',
  4: 'Costruzione, impegno, disciplina. Anno per lavorare sulle basi solide.',
  5: 'Cambiamento, movimento, libertà. Anno di trasformazioni e novità.',
  6: 'Responsabilità, amore, famiglia. Anno per consolidare i rapporti.',
  7: 'Introspezione, studio, rallentamento. Anno per riflettere e crescere interiormente.',
  8: 'Risultati, carriera, potere personale. Anno di raccolta e concretezza.',
  9: 'Chiusura, conclusione, trasformazione. Anno per fare bilanci e lasciar andare.',
  11: 'Visione, risveglio, ispirazione. Anno di alta vibrazione spirituale.',
  22: 'Realizzazione concreta, costruzione duratura. Anno per grandi progetti.',
  33: 'Servizio, amore, responsabilità collettiva. Anno di insegnamento e guarigione.',
};

// Destiny archetypes
export const destinyArchetypes: Record<number, {
  archetype: string;
  description: string;
}> = {
  1: {
    archetype: 'Il Pioniere',
    description: 'Sviluppo dell\'autonomia, dell\'iniziativa e del potere personale.',
  },
  2: {
    archetype: 'Il Mediatore',
    description: 'Orientamento verso le relazioni, la collaborazione e la sensibilità emotiva.',
  },
  3: {
    archetype: 'L\'Espressore',
    description: 'Espressione personale, comunicazione e creatività.',
  },
  4: {
    archetype: 'Il Costruttore',
    description: 'Costruzione di basi solide, concretezza e forma stabile.',
  },
  5: {
    archetype: 'Il Cercatore',
    description: 'Bisogno di libertà, cambiamento ed esperienza diretta.',
  },
  6: {
    archetype: 'Il Custode',
    description: 'Amore, responsabilità affettiva e cura degli altri.',
  },
  7: {
    archetype: 'Il Ricercatore di Verità',
    description: 'Conoscenza, introspezione e ricerca di significato.',
  },
  8: {
    archetype: 'Il Gestore del Potere',
    description: 'Relazione con il potere personale, la materia e le risorse.',
  },
  9: {
    archetype: 'Il Trasformatore',
    description: 'Visione ampia, idealista e orientata al bene collettivo.',
  },
};
