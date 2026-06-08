/**
 * NumFlame — Pythagorean Numerology Engine
 * Based on knowledge base: regole_generali, tabella_lettere, significati, anno_personale,
 * cicli_della_vita, mese_personale, date_favorevoli.
 *
 * Rules:
 * - All numbers reduced to 1–9, EXCEPT master numbers 11, 22, 33 which are preserved.
 * - Accented letters normalised to base vowel before calculation.
 */

// ─── Letter → Number (Pythagorean table) ────────────────────────────────────

const LETTER_MAP: Record<string, number> = {
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

const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);

// ─── Text normalisation ──────────────────────────────────────────────────────

export function normalizeText(text: string): string {
  return text
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics
    .replace(/[^A-Z]/g, '');         // keep letters only
}

// ─── Core reduction (preserves master numbers 11, 22, 33) ────────────────────

export function reduceNumber(n: number): number {
  if (n === 11 || n === 22 || n === 33) return n;
  if (n <= 9) return n;
  const sum = String(n)
    .split('')
    .reduce((acc, d) => acc + Number(d), 0);
  return reduceNumber(sum);
}

/**
 * Full digit sum of a number string (used during date digit-by-digit summation).
 * Keeps master numbers at each intermediate step.
 */
function sumDigits(n: number): number {
  if (n === 11 || n === 22 || n === 33) return n;
  return String(n)
    .split('')
    .reduce((acc, d) => acc + Number(d), 0);
}

// ─── Name-based numbers ───────────────────────────────────────────────────────

/** Soul number: sum of vowels */
export function calculateSoulNumber(firstName: string, lastName: string): number {
  const letters = normalizeText(`${firstName}${lastName}`);
  const sum = letters
    .split('')
    .filter(l => VOWELS.has(l))
    .reduce((acc, l) => acc + (LETTER_MAP[l] ?? 0), 0);
  return reduceNumber(sum);
}

/** Persona (personality) number: sum of consonants */
export function calculatePersonaNumber(firstName: string, lastName: string): number {
  const letters = normalizeText(`${firstName}${lastName}`);
  const sum = letters
    .split('')
    .filter(l => !VOWELS.has(l))
    .reduce((acc, l) => acc + (LETTER_MAP[l] ?? 0), 0);
  return reduceNumber(sum);
}

/** Expression (I) number: Soul + Persona (= all letters) */
export function calculateExpressionNumber(firstName: string, lastName: string): number {
  const letters = normalizeText(`${firstName}${lastName}`);
  const sum = letters
    .split('')
    .reduce((acc, l) => acc + (LETTER_MAP[l] ?? 0), 0);
  return reduceNumber(sum);
}

// ─── Date-based numbers ───────────────────────────────────────────────────────

/**
 * Destiny (Life Path): reduce day + month + year individually, then sum.
 * birthDate: 'YYYY-MM-DD'
 */
export function calculateDestinyNumber(birthDate: string): number {
  const [y, m, d] = birthDate.split('-').map(Number);
  const dayR = reduceNumber(d);
  const monthR = reduceNumber(m);
  // Year: sum all 4 digits, then reduce
  const yearSum = String(y)
    .split('')
    .reduce((acc, c) => acc + Number(c), 0);
  const yearR = reduceNumber(yearSum);
  const total = dayR + monthR + yearR;
  return reduceNumber(total);
}

/**
 * Shadow numbers:
 *   youthShadow   = reduce(day) - reduce(year)  (absolute)
 *   maturityShadow = reduce(day) - reduce(month) (absolute)
 *   mainShadow    = youthShadow - maturityShadow (absolute)
 */
export function calculateShadowNumbers(birthDate: string): {
  youth: number;
  maturity: number;
  main: number;
} {
  const [y, m, d] = birthDate.split('-').map(Number);
  const dayR = reduceNumber(d);
  const monthR = reduceNumber(m);
  const yearSum = String(y).split('').reduce((acc, c) => acc + Number(c), 0);
  const yearR = reduceNumber(yearSum);

  const youth = reduceNumber(Math.abs(dayR - yearR));
  const maturity = reduceNumber(Math.abs(dayR - monthR));
  const main = reduceNumber(Math.abs(youth - maturity));
  return { youth, maturity, main };
}

/** Quintessence: Expression + Destiny */
export function calculateQuintessence(
  firstName: string,
  lastName: string,
  birthDate: string
): number {
  const expr = calculateExpressionNumber(firstName, lastName);
  const dest = calculateDestinyNumber(birthDate);
  return reduceNumber(expr + dest);
}

// ─── Temporal numbers ────────────────────────────────────────────────────────

/**
 * Personal Year: reduce(day_birth + month_birth + year_reference)
 * birthDate: 'YYYY-MM-DD', referenceYear: e.g. 2026
 */
export function calculatePersonalYear(birthDate: string, referenceYear: number): number {
  const [, m, d] = birthDate.split('-').map(Number);
  const yearDigits = String(referenceYear)
    .split('')
    .reduce((acc, c) => acc + Number(c), 0);
  return reduceNumber(d + m + yearDigits);
}

/** Personal Month: PersonalYear + calendar month number */
export function calculatePersonalMonth(birthDate: string, referenceYear: number, calendarMonth: number): number {
  const py = calculatePersonalYear(birthDate, referenceYear);
  return reduceNumber(py + calendarMonth);
}

/** Personal Day: PersonalMonth + calendar day number */
export function calculatePersonalDay(birthDate: string, referenceYear: number, calendarMonth: number, calendarDay: number): number {
  const pm = calculatePersonalMonth(birthDate, referenceYear, calendarMonth);
  return reduceNumber(pm + calendarDay);
}

// ─── Life Cycles ─────────────────────────────────────────────────────────────

/**
 * First Cycle  → reduce(birth month)
 * Second Cycle → reduce(birth day)
 * Third Cycle  → reduce(birth year digit sum)
 */
export function calculateLifeCycles(birthDate: string): {
  first: number;
  second: number;
  third: number;
} {
  const [y, m, d] = birthDate.split('-').map(Number);
  const yearSum = String(y).split('').reduce((acc, c) => acc + Number(c), 0);
  return {
    first: reduceNumber(m),
    second: reduceNumber(d),
    third: reduceNumber(yearSum),
  };
}

// ─── Full Profile ─────────────────────────────────────────────────────────────

export interface NumerologyProfile {
  // Name numbers
  soul: number;
  persona: number;
  expression: number;
  // Date numbers
  destiny: number;
  shadow: { youth: number; maturity: number; main: number };
  quintessence: number;
  // Temporal
  personalYear: number;
  personalMonth: number;
  personalDay: number;
  // Cycles
  lifeCycles: { first: number; second: number; third: number };
}

export function calculateFullProfile(
  firstName: string,
  lastName: string,
  birthDate: string,
  today: Date = new Date()
): NumerologyProfile {
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // 1-indexed
  const day = today.getDate();

  return {
    soul: calculateSoulNumber(firstName, lastName),
    persona: calculatePersonaNumber(firstName, lastName),
    expression: calculateExpressionNumber(firstName, lastName),
    destiny: calculateDestinyNumber(birthDate),
    shadow: calculateShadowNumbers(birthDate),
    quintessence: calculateQuintessence(firstName, lastName, birthDate),
    personalYear: calculatePersonalYear(birthDate, year),
    personalMonth: calculatePersonalMonth(birthDate, year, month),
    personalDay: calculatePersonalDay(birthDate, year, month, day),
    lifeCycles: calculateLifeCycles(birthDate),
  };
}

// ─── Number meanings ──────────────────────────────────────────────────────────

export interface NumberMeaning {
  keywords: string[];
  talents: string;
  shadow: string;
  evolution: string;
}

export const NUMBER_MEANINGS: Record<number, NumberMeaning> = {
  1: {
    keywords: ['initiative', 'autonomy', 'leadership'],
    talents: 'Independence, courage, pioneering spirit.',
    shadow: 'Selfishness, impulsivity, difficulty collaborating.',
    evolution: 'Learn to lead without dominating.',
  },
  2: {
    keywords: ['collaboration', 'sensitivity', 'relationship'],
    talents: 'Empathy, diplomacy, listening.',
    shadow: 'Dependency, insecurity, fear of conflict.',
    evolution: 'Develop self-confidence.',
  },
  3: {
    keywords: ['communication', 'creativity', 'expression'],
    talents: 'Enthusiasm, art, sociability.',
    shadow: 'Scatteredness, superficiality.',
    evolution: 'Give concrete form to ideas.',
  },
  4: {
    keywords: ['structure', 'stability', 'method'],
    talents: 'Reliability, consistency, practicality.',
    shadow: 'Rigidity, fear of change.',
    evolution: 'Build without becoming rigid.',
  },
  5: {
    keywords: ['change', 'freedom', 'experience'],
    talents: 'Adaptability, curiosity.',
    shadow: 'Instability, excess.',
    evolution: 'Freedom with responsibility.',
  },
  6: {
    keywords: ['responsibility', 'love', 'harmony'],
    talents: 'Care, aesthetic sense, protection.',
    shadow: 'Control, excessive self-sacrifice.',
    evolution: 'Love without erasing yourself.',
  },
  7: {
    keywords: ['introspection', 'research', 'spirituality'],
    talents: 'Analysis, depth, intuition.',
    shadow: 'Isolation, distrust.',
    evolution: 'Trust and share.',
  },
  8: {
    keywords: ['power', 'achievement', 'matter'],
    talents: 'Leadership, management, success.',
    shadow: 'Materialism, harshness.',
    evolution: 'Use power ethically.',
  },
  9: {
    keywords: ['humanity', 'closure', 'service'],
    talents: 'Compassion, broad vision.',
    shadow: 'Victimhood, emotional scatteredness.',
    evolution: 'Let go of the past.',
  },
  11: {
    keywords: ['vision', 'intuition', 'inspiration'],
    talents: 'Heightened perception, spiritual insight, inspiration.',
    shadow: 'Hypersensitivity, nervous tension.',
    evolution: 'Channel high vibration with groundedness.',
  },
  22: {
    keywords: ['master builder', 'large-scale creation', 'vision'],
    talents: 'Ability to manifest great concrete projects.',
    shadow: 'Overwhelm, perfectionism.',
    evolution: 'Build with patience and humility.',
  },
  33: {
    keywords: ['universal love', 'service', 'compassionate guidance'],
    talents: 'Spiritual teaching, unconditional love.',
    shadow: 'Martyrdom, emotional exhaustion.',
    evolution: 'Serve from fullness, not depletion.',
  },
};

export const PERSONAL_YEAR_MEANINGS: Record<number, string> = {
  1: 'New beginnings, decisions, autonomy. Plant seeds for the next 9-year cycle.',
  2: 'Collaboration, patience, relationships. A year for partnerships and inner calm.',
  3: 'Expansion, communication, creativity. Express yourself and enjoy connections.',
  4: 'Construction, commitment, discipline. Lay solid foundations through hard work.',
  5: 'Change, movement, freedom. Embrace transformation and new experiences.',
  6: 'Responsibility, love, family. Focus on home, care, and emotional harmony.',
  7: 'Introspection, study, slowdown. A year for inner truth and spiritual growth.',
  8: "Results, career, personal power. Harvest what you've built — act with clarity.",
  9: 'Closure, conclusion, transformation. Release the old and prepare for renewal.',
  11: 'Vision, awakening, inspiration. Heightened intuition — trust what you receive.',
  22: 'Concrete realisation, lasting construction. A master year for ambitious action.',
  33: 'Service, love, collective responsibility. Lead with compassion and wisdom.',
};

export const PERSONAL_MONTH_ADVICE: Record<number, { theme: string; favor: string; avoid: string }> = {
  1: { theme: 'Initiative & new starts', favor: 'Decisions, bold actions, self-assertion.', avoid: 'Indecision and dependency.' },
  2: { theme: 'Relations & collaboration', favor: 'Agreements, mediation, teamwork.', avoid: 'Forcing outcomes, emotional reactions.' },
  3: { theme: 'Expression & communication', favor: 'Creativity, visibility, sharing.', avoid: 'Scattering energy.' },
  4: { theme: 'Organisation & structure', favor: 'Concrete work, planning, discipline.', avoid: 'Rigidity and overload.' },
  5: { theme: 'Change & movement', favor: 'Novelty, adaptability, flexibility.', avoid: 'Impulsivity and instability.' },
  6: { theme: 'Affective responsibility', favor: 'Family, stable relations, care.', avoid: 'Excessive sacrifice or control.' },
  7: { theme: 'Introspection & clarity', favor: 'Study, reflection, inner listening.', avoid: 'Isolation and withdrawal.' },
  8: { theme: 'Results & concrete management', favor: 'Material goals, career, recognition.', avoid: 'Power struggles and stress.' },
  9: { theme: 'Closure & completion', favor: 'Balancing, completing, letting go.', avoid: 'Clinging to the past.' },
  11: { theme: 'Deep intuition & vision', favor: 'Inspiration, profound communication.', avoid: 'Confusion and hypersensitivity.' },
  22: { theme: 'Large-scale construction', favor: 'Important decisions, lasting projects.', avoid: 'Overload and perfectionism.' },
  33: { theme: 'Service & meaningful relations', favor: 'Collaboration, support, teaching.', avoid: 'Self-erasure.' },
};

// ─── Compatibility ─────────────────────────────────────────────────────────────

/**
 * Compatibility score between two profiles (0–100).
 * Factors and weights:
 *   Destiny       20%
 *   Expression    20%
 *   Soul          20%
 *   Persona       10%
 *   Quintessence  15%
 *   PersonalYear  15%
 */

const COMPATIBLE_PAIRS: Record<number, number[]> = {
  1: [1, 5, 7],
  2: [2, 4, 8],
  3: [3, 6, 9],
  4: [2, 4, 8],
  5: [1, 5, 7],
  6: [3, 6, 9],
  7: [1, 5, 7],
  8: [2, 4, 8],
  9: [3, 6, 9],
  11: [2, 11, 22],
  22: [4, 11, 22, 33],
  33: [6, 22, 33],
};

function pairScore(a: number, b: number): number {
  if (a === b) return 100;
  // master number harmonics
  if (a === 11 && b === 2) return 85;
  if (a === 22 && b === 4) return 85;
  if (a === 33 && b === 6) return 85;
  if (b === 11 && a === 2) return 85;
  if (b === 22 && a === 4) return 85;
  if (b === 33 && a === 6) return 85;

  const compat = COMPATIBLE_PAIRS[a] ?? [];
  if (compat.includes(b)) return 80;
  // same triad (1/5/7, 2/4/8, 3/6/9)
  const triads = [[1, 5, 7], [2, 4, 8], [3, 6, 9]];
  for (const triad of triads) {
    if (triad.includes(a) && triad.includes(b)) return 65;
  }
  return 35;
}

export interface CompatibilityResult {
  score: number;          // 0–100
  breakdown: {
    destiny: number;
    expression: number;
    soul: number;
    persona: number;
    quintessence: number;
    personalYear: number;
  };
  label: 'soulmate' | 'high' | 'good' | 'moderate' | 'low';
}

export function calculateCompatibility(
  a: NumerologyProfile,
  b: NumerologyProfile
): CompatibilityResult {
  const destinyScore    = pairScore(a.destiny, b.destiny);
  const expressionScore = pairScore(a.expression, b.expression);
  const soulScore       = pairScore(a.soul, b.soul);
  const personaScore    = pairScore(a.persona, b.persona);
  const quintScore      = pairScore(a.quintessence, b.quintessence);
  const pyScore         = pairScore(a.personalYear, b.personalYear);

  const score = Math.round(
    destinyScore    * 0.20 +
    expressionScore * 0.20 +
    soulScore       * 0.20 +
    personaScore    * 0.10 +
    quintScore      * 0.15 +
    pyScore         * 0.15
  );

  const label =
    score >= 88 ? 'soulmate' :
    score >= 75 ? 'high' :
    score >= 60 ? 'good' :
    score >= 45 ? 'moderate' : 'low';

  return {
    score,
    breakdown: {
      destiny: destinyScore,
      expression: expressionScore,
      soul: soulScore,
      persona: personaScore,
      quintessence: quintScore,
      personalYear: pyScore,
    },
    label,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Display master number with secondary vibration, e.g. 11 → "11/2" */
export function displayNumber(n: number): string {
  if (n === 11) return '11/2';
  if (n === 22) return '22/4';
  if (n === 33) return '33/6';
  return String(n);
}

/** Check if a number is a master number */
export function isMasterNumber(n: number): boolean {
  return n === 11 || n === 22 || n === 33;
}
