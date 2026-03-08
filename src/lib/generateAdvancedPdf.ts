import { jsPDF } from "jspdf";

interface ReportSections {
  [key: string]: { title: string; content: string };
}

interface ProfileData {
  nome: string;
  cognome: string;
  birth_date: string;
}

interface NumerologyData {
  life_path: number;
  destiny_expression: number;
  soul: number;
  personality: number;
  personal_year: number;
}

const sectionOrder = [
  "introduzione",
  "numeri_principali",
  "dinamiche_karmiche",
  "fase_vita",
  "strategie_evolutive",
  "conclusione",
];

export function generateAdvancedReportPdf(
  profile: ProfileData,
  numerology: NumerologyData,
  sections: ReportSections
): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;
  let pageNum = 1;

  const addPageFooter = () => {
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150);
    doc.text(
      `Report Numerologico Avanzato – ${profile.nome} ${profile.cognome} – Pagina ${pageNum}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
    doc.setTextColor(0);
  };

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - 25) {
      addPageFooter();
      doc.addPage();
      pageNum++;
      y = 25;
    }
  };

  const addText = (text: string, fontSize = 11, isBold = false, color = 0) => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    doc.setTextColor(color);
    const lines = doc.splitTextToSize(text, contentWidth);
    const lineHeight = fontSize * 0.45;

    for (const line of lines) {
      ensureSpace(lineHeight + 2);
      doc.text(line, margin, y);
      y += lineHeight + 1.5;
    }
    y += 3;
    doc.setTextColor(0);
  };

  // ===== COVER PAGE =====
  y = 60;
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("REPORT NUMEROLOGICO", pageWidth / 2, y, { align: "center" });
  y += 12;
  doc.setFontSize(20);
  doc.text("AVANZATO", pageWidth / 2, y, { align: "center" });
  y += 25;

  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.text(`Preparato per`, pageWidth / 2, y, { align: "center" });
  y += 10;
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(`${profile.nome} ${profile.cognome}`, pageWidth / 2, y, { align: "center" });
  y += 20;

  // Numbers summary
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const [bY, bM, bD] = profile.birth_date.split("-").map(Number);
  const summaryLines = [
    `Data di nascita: ${bD}/${bM}/${bY}`,
    `Destino: ${numerology.life_path}  |  Io: ${numerology.destiny_expression}  |  Anima: ${numerology.soul}  |  Personalità: ${numerology.personality}`,
    `Anno Personale ${new Date().getFullYear()}: ${numerology.personal_year}`,
  ];
  for (const line of summaryLines) {
    doc.text(line, pageWidth / 2, y, { align: "center" });
    y += 7;
  }

  y += 20;
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(120);
  doc.text(
    `Generato il ${new Date().toLocaleDateString("it-IT")} – Destino Numerologico`,
    pageWidth / 2,
    y,
    { align: "center" }
  );
  doc.setTextColor(0);

  addPageFooter();

  // ===== CONTENT PAGES =====
  for (const sectionKey of sectionOrder) {
    const section = sections[sectionKey];
    if (!section) continue;

    doc.addPage();
    pageNum++;
    y = 25;

    // Section title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(section.title.toUpperCase(), margin, y);
    y += 4;

    // Divider line
    doc.setDrawColor(200);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // Content - split into paragraphs
    const paragraphs = section.content.split("\n").filter((p) => p.trim());
    for (const paragraph of paragraphs) {
      // Clean any markdown artifacts
      const clean = paragraph
        .replace(/\*\*/g, "")
        .replace(/##?\s*/g, "")
        .replace(/^[-•]\s*/, "• ")
        .trim();

      if (!clean) continue;

      // Check if it looks like a sub-heading (short, no period)
      if (clean.length < 60 && !clean.endsWith(".") && !clean.startsWith("•")) {
        ensureSpace(12);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(clean, margin, y);
        y += 8;
      } else {
        addText(clean);
      }
    }

    addPageFooter();
  }

  // ===== FINAL PAGE =====
  doc.addPage();
  pageNum++;
  y = 80;

  doc.setFontSize(14);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(100);
  doc.text(
    "\"I numeri non mentono. Sono lo specchio della tua anima.\"",
    pageWidth / 2,
    y,
    { align: "center" }
  );
  y += 20;
  doc.setFontSize(11);
  doc.text("– Pitagora", pageWidth / 2, y, { align: "center" });
  y += 30;

  doc.setTextColor(0);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Report generato da Destino Numerologico", pageWidth / 2, y, { align: "center" });
  y += 6;
  doc.text("destino-numerologico.lovable.app", pageWidth / 2, y, { align: "center" });

  addPageFooter();

  // Save
  const fileName = `Report_Avanzato_${profile.nome}_${profile.cognome}_${new Date().getFullYear()}.pdf`;
  doc.save(fileName);
}
