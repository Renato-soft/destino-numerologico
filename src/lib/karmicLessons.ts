import { normalizeText, letterToNumber } from "./numerology";

// Karmic lessons: numbers (1-9) missing from full name
export function calculateKarmicLessons(fullName: string): number[] {
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

export const karmicLessonMeanings: Record<number, { title: string; lesson: string }> = {
  1: { title: "Autonomia", lesson: "Devi imparare a prendere iniziativa e a stare in piedi da solo." },
  2: { title: "Cooperazione", lesson: "Devi sviluppare sensibilità, pazienza e capacità di collaborare." },
  3: { title: "Espressione", lesson: "Devi imparare a comunicare i tuoi pensieri e la tua creatività." },
  4: { title: "Disciplina", lesson: "Devi sviluppare ordine, metodo e perseveranza nel lavoro." },
  5: { title: "Libertà", lesson: "Devi imparare ad accogliere il cambiamento e l'avventura." },
  6: { title: "Responsabilità", lesson: "Devi sviluppare la capacità di prenderti cura degli altri senza perderti." },
  7: { title: "Introspezione", lesson: "Devi coltivare la riflessione interiore e la ricerca di significato." },
  8: { title: "Potere", lesson: "Devi imparare a gestire risorse, denaro e autorità con equilibrio." },
  9: { title: "Compassione", lesson: "Devi sviluppare generosità, visione ampia e distacco dal materiale." },
};
