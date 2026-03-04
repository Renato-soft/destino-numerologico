import { jsPDF } from "jspdf";
import {
  numberMeanings,
  masterMeanings,
  destinyArchetypes,
  personalYearMeanings,
} from "./numerology";

interface NumerologyData {
  lifePath: number;
  expression: number;
  soul: number;
  personality: number;
  quintessenza: number;
  personalYear: number;
  personalMonth: number;
  cycles: {
    firstCycle: { number: number; startYear: number; endYear: number };
    secondCycle: { number: number; startYear: number; endYear: number };
    thirdCycle: { number: number; startYear: number };
  };
}

interface Profile {
  nome: string;
  cognome: string;
  birth_date: string;
}

const getNumberDescription = (num: number) => {
  const baseNum = num > 9 ? (num === 11 ? 2 : num === 22 ? 4 : num === 33 ? 6 : num) : num;
  return {
    meaning: numberMeanings[baseNum],
    master: masterMeanings[num],
    archetype: destinyArchetypes[baseNum],
  };
};

export function generateNumerologyPdf(
  profile: Profile,
  data: NumerologyData,
  currentYear: number
): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  const addText = (text: string, fontSize: number = 11, isBold: boolean = false) => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    const lines = doc.splitTextToSize(text, contentWidth);
    
    // Check if we need a new page
    const lineHeight = fontSize * 0.5;
    if (y + lines.length * lineHeight > 280) {
      doc.addPage();
      y = 20;
    }
    
    doc.text(lines, margin, y);
    y += lines.length * lineHeight + 4;
  };

  const addSection = (title: string) => {
    y += 6;
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(title, margin, y);
    y += 10;
  };

  // Header
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Mappa numerologica completa – Versione Premium", margin, y);
  y += 12;

  // Introduction (mandatory text)
  addText(
    `${profile.nome}, questa mappa numerologica è costruita secondo le regole della numerologia pitagorica classica, mantenendo coerenza numerica dall'inizio alla fine. L'analisi che segue integra i tuoi numeri principali in una lettura unitaria, chiara e approfondita.`
  );
  y += 8;

  // Destino (was Life Path)
  addSection(`Destino ${data.lifePath}`);
  const lpDesc = getNumberDescription(data.lifePath);
  addText(
    `Il tuo Destino ${data.lifePath} rivela la direzione fondamentale della tua esistenza. Le parole chiave che caratterizzano questo percorso sono: ${lpDesc.meaning?.keywords.join(", ")}. Questo numero indica che sei qui per sviluppare qualità di ${lpDesc.meaning?.talents.join(", ")}.`
  );
  addText(
    `Il tuo percorso evolutivo ti chiede di ${lpDesc.meaning?.evolution}. Nella quotidianità, questo si manifesta nella tua capacità naturale di affrontare le situazioni con ${lpDesc.meaning?.talents[0]}. Tuttavia, dovrai fare attenzione alle ombre di questo numero: ${lpDesc.meaning?.shadows.join(", ")}.`
  );
  if (lpDesc.master) {
    addText(
      `Come numero maestro, il ${data.lifePath} porta con sé un'energia particolare: ${lpDesc.master.description}`
    );
  }

  // Io (was Expression)
  addSection(`Io ${data.expression}`);
  const exprDesc = getNumberDescription(data.expression);
  if (exprDesc.archetype) {
    addText(`Archetipo: ${exprDesc.archetype.archetype}. ${exprDesc.archetype.description}`);
  }
  addText(
    `Il tuo numero dell'Io ${data.expression}, derivato dalle lettere del tuo nome completo, indica il modo in cui ti esprimi nel mondo e il tuo potenziale naturale. I tuoi talenti innati includono: ${exprDesc.meaning?.talents.join(", ")}.`
  );
  addText(
    `Nella vita quotidiana, questo si traduce nella capacità di ${exprDesc.meaning?.evolution}. Lavora consapevolmente sulle ombre (${exprDesc.meaning?.shadows.join(", ")}) per esprimere al meglio le qualità positive di questo numero.`
  );

  // Soul
  addSection(`Numero dell'Anima ${data.soul}`);
  const soulDesc = getNumberDescription(data.soul);
  addText(
    `Il Numero dell'Anima ${data.soul}, calcolato dalle vocali del tuo nome, rivela i tuoi desideri più profondi e ciò che realmente ti motiva. Le parole chiave sono: ${soulDesc.meaning?.keywords.join(", ")}.`
  );
  addText(
    `Nel profondo del tuo cuore desideri esprimere ${soulDesc.meaning?.talents.join(" e ")}. Questa è la forza che ti spinge nelle scelte più importanti della vita. Per soddisfare la tua anima, ricorda di ${soulDesc.meaning?.evolution}.`
  );

  // Personality
  addSection(`Numero della Personalità ${data.personality}`);
  const persDesc = getNumberDescription(data.personality);
  addText(
    `Il Numero della Personalità ${data.personality}, derivato dalle consonanti, rappresenta la maschera che mostri al mondo esterno e il modo in cui gli altri ti percepiscono. I tratti caratteristici sono: ${persDesc.meaning?.keywords.join(", ")}.`
  );
  addText(
    `Gli altri ti vedono come una persona dotata di ${persDesc.meaning?.talents.join(", ")}. Questa è l'immagine che proietti, anche se dentro di te potresti sentirti diversamente. Lavorare sull'equilibrio tra personalità e anima ti aiuterà a ${persDesc.meaning?.evolution}.`
  );

  // Life Cycles
  addSection("Cicli della Vita");
  
  // First Cycle
  addText(`Primo Ciclo della Vita (Numero ${data.cycles.firstCycle.number})`, 12, true);
  const c1Desc = getNumberDescription(data.cycles.firstCycle.number);
  addText(
    `Dalla nascita (${data.cycles.firstCycle.startYear}) fino al passaggio tra ${data.cycles.firstCycle.endYear - 2} e ${data.cycles.firstCycle.endYear}. Questo periodo è caratterizzato dalle energie del numero ${data.cycles.firstCycle.number}: ${c1Desc.meaning?.keywords.join(", ")}. È la fase in cui impari ${c1Desc.meaning?.evolution}.`
  );

  // Second Cycle
  addText(`Secondo Ciclo della Vita (Numero ${data.cycles.secondCycle.number})`, 12, true);
  const c2Desc = getNumberDescription(data.cycles.secondCycle.number);
  addText(
    `Dal ${data.cycles.secondCycle.startYear} fino al passaggio tra ${data.cycles.secondCycle.endYear - 1} e ${data.cycles.secondCycle.endYear}. Le energie del numero ${data.cycles.secondCycle.number} ti accompagnano: ${c2Desc.meaning?.keywords.join(", ")}. È la fase in cui sviluppi ${c2Desc.meaning?.talents.join(", ")}.`
  );

  // Third Cycle
  addText(`Terzo Ciclo della Vita (Numero ${data.cycles.thirdCycle.number})`, 12, true);
  const c3Desc = getNumberDescription(data.cycles.thirdCycle.number);
  addText(
    `Dal ${data.cycles.thirdCycle.startYear} in poi. Questo ciclo finale è governato dal numero ${data.cycles.thirdCycle.number}: ${c3Desc.meaning?.keywords.join(", ")}. È la fase della maturità dove raccogli i frutti e ${c3Desc.meaning?.evolution}.`
  );

  // Personal Year
  addSection(`Anno Personale ${currentYear}: ${data.personalYear}`);
  const yearMeaning = personalYearMeanings[data.personalYear] || "";
  addText(yearMeaning);
  const pyDesc = getNumberDescription(data.personalYear);
  addText(
    `Quest'anno ti invita a concentrarti su ${pyDesc.meaning?.keywords.join(", ")}. Le attività favorite sono quelle che richiedono ${pyDesc.meaning?.talents.join(", ")}. Fai attenzione alle tendenze verso ${pyDesc.meaning?.shadows.join(", ")}.`
  );

  // Technical calculations section
  addSection("Calcoli Tecnici");
  const [birthYear, birthMonth, birthDay] = profile.birth_date.split("-").map(Number);
  addText(`Nome completo: ${profile.nome} ${profile.cognome}`, 10);
  addText(`Data di nascita: ${birthDay}/${birthMonth}/${birthYear}`, 10);
  addText(`Destino: ${birthDay} + ${birthMonth} + ${birthYear} → ${data.lifePath}`, 10);
  addText(`Io: somma lettere nome completo → ${data.expression}`, 10);
  addText(`Anima: somma vocali → ${data.soul}`, 10);
  addText(`Personalità: somma consonanti → ${data.personality}`, 10);
  addText(`Quintessenza: Io (${data.expression}) + Destino (${data.lifePath}) → ${data.quintessenza}`, 10);
  addText(`Anno Personale ${currentYear}: ${birthDay} + ${birthMonth} + ${currentYear} → ${data.personalYear}`, 10);
  addText(`Mese Personale: ${data.personalYear} + mese corrente → ${data.personalMonth}`, 10);

  // Mandatory closing text
  y += 10;
  addSection("Approfondimenti disponibili:");
  addText("– Proiezione mese per mese basata sull'Anno Personale", 10);
  addText("– Analisi della giornata (oggi, domani o data specifica)", 10);
  addText("– Date favorevoli per obiettivi concreti (colloqui, firmare contratti, relazioni sentimentali, etc...)", 10);
  addText("– Spiegami il mio Life Path in modo pratico", 10);
  addText("– Quali sono i miei talenti nascosti", 10);
  addText("– Quale lavoro è in linea con la mia mappa", 10);
  y += 4;
  addText("Scrivimi quale approfondimento desideri e il periodo di riferimento. Oppure fammi una domanda");

  // Save with user's name
  const fileName = `Mappa_Numerologica_${profile.nome}_${profile.cognome}_${currentYear}.pdf`;
  doc.save(fileName);
}
