import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  FileText,
  Sparkles,
  Download,
  Pencil,
  Check,
  X,
  Loader2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { generateAdvancedReportPdf } from "@/lib/generateAdvancedPdf";

interface ReportSection {
  title: string;
  content: string;
}

interface Report {
  id: string;
  status: string;
  sections: Record<string, ReportSection>;
  edited_sections: Record<string, ReportSection> | null;
  generated_at: string | null;
  finalized_at: string | null;
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

const sectionIcons: Record<string, string> = {
  introduzione: "📖",
  numeri_principali: "🔢",
  dinamiche_karmiche: "🔑",
  fase_vita: "🌀",
  strategie_evolutive: "🎯",
  conclusione: "✨",
};

export default function AdvancedReport() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [profile, setProfile] = useState<{ nome: string; cognome: string; birth_date: string } | null>(null);
  const [numerology, setNumerology] = useState<NumerologyData | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(sectionOrder));

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }

      const [profileRes, mapRes, reportRes] = await Promise.all([
        supabase.from("profiles").select("nome, cognome, birth_date").eq("user_id", session.user.id).maybeSingle(),
        supabase.from("numerology_maps").select("life_path, destiny_expression, soul, personality, personal_year")
          .eq("user_id", session.user.id).order("computed_at", { ascending: false }).limit(1).maybeSingle(),
        supabase.from("advanced_reports").select("*").eq("user_id", session.user.id)
          .order("created_at", { ascending: false }).limit(1).maybeSingle(),
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (mapRes.data) setNumerology(mapRes.data as NumerologyData);
      if (reportRes.data) {
        const r = reportRes.data;
        setReport({
          id: r.id,
          status: r.status,
          sections: (r.sections as unknown as Record<string, ReportSection>) || {},
          edited_sections: r.edited_sections as unknown as Record<string, ReportSection> | null,
          generated_at: r.generated_at,
          finalized_at: r.finalized_at,
        });
      }
      setLoading(false);
    };
    load();
  }, [navigate]);

  const handleGenerate = async () => {
    if (!numerology) {
      toast({ title: "Genera prima la tua mappa numerologica", variant: "destructive" });
      return;
    }

    setGenerating(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Create report record
      const { data: newReport, error: insertErr } = await supabase
        .from("advanced_reports")
        .insert({ user_id: session.user.id, status: "generating" })
        .select()
        .single();

      if (insertErr || !newReport) throw new Error("Failed to create report");

      setReport({
        id: newReport.id,
        status: "generating",
        sections: {},
        edited_sections: null,
        generated_at: null,
        finalized_at: null,
      });

      // Call edge function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-advanced-report`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ report_id: newReport.id }),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        if (response.status === 429) {
          toast({ title: "Troppe richieste", description: "Riprova tra qualche minuto.", variant: "destructive" });
        } else if (response.status === 402) {
          toast({ title: "Crediti esauriti", description: "Contatta il supporto.", variant: "destructive" });
        } else {
          toast({ title: "Errore nella generazione", description: err.error, variant: "destructive" });
        }
        setGenerating(false);
        return;
      }

      const result = await response.json();

      setReport({
        id: newReport.id,
        status: "ready",
        sections: result.sections,
        edited_sections: null,
        generated_at: new Date().toISOString(),
        finalized_at: null,
      });

      toast({ title: "Report generato con successo! ✨", description: "Puoi ora rivederlo e modificarlo prima del download." });
    } catch (e) {
      console.error(e);
      toast({ title: "Errore", description: "Impossibile generare il report.", variant: "destructive" });
    }

    setGenerating(false);
  };

  const getEffectiveSections = (): Record<string, ReportSection> => {
    if (!report) return {};
    const base = { ...report.sections };
    if (report.edited_sections) {
      for (const [key, val] of Object.entries(report.edited_sections)) {
        base[key] = val;
      }
    }
    return base;
  };

  const handleStartEdit = (sectionKey: string) => {
    const sections = getEffectiveSections();
    setEditingSection(sectionKey);
    setEditContent(sections[sectionKey]?.content || "");
  };

  const handleSaveEdit = async () => {
    if (!editingSection || !report) return;

    const currentEdited = report.edited_sections || {};
    const sections = getEffectiveSections();
    const updatedEdited = {
      ...currentEdited,
      [editingSection]: {
        title: sections[editingSection]?.title || "",
        content: editContent,
      },
    };

    await supabase
      .from("advanced_reports")
      .update({ edited_sections: updatedEdited as unknown as Record<string, unknown> })
      .eq("id", report.id);

    setReport({ ...report, edited_sections: updatedEdited });
    setEditingSection(null);
    toast({ title: "Sezione aggiornata" });
  };

  const handleDownloadPdf = () => {
    if (!profile || !numerology || !report) return;
    const sections = getEffectiveSections();
    generateAdvancedReportPdf(profile, numerology, sections);

    // Mark as finalized
    if (!report.finalized_at) {
      supabase
        .from("advanced_reports")
        .update({ finalized_at: new Date().toISOString(), status: "finalized" })
        .eq("id", report.id);
      setReport({ ...report, finalized_at: new Date().toISOString(), status: "finalized" });
    }
  };

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const effectiveSections = getEffectiveSections();
  const hasReport = report && report.status !== "generating" && Object.keys(report.sections).length > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 numerology-pattern opacity-20 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-b from-secondary/5 via-transparent to-primary/5 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/dashboard"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-lg font-semibold">Report Avanzato</h1>
              <p className="text-xs text-muted-foreground">Analisi numerologica completa con AI</p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8 max-w-3xl space-y-6">
        {/* Status / Generate */}
        {!hasReport && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-cosmic rounded-2xl p-8 text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <FileText className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-3">
              Report Numerologico Avanzato
            </h2>
            <p className="text-muted-foreground mb-2 max-w-md mx-auto">
              Un'analisi approfondita di oltre 20 pagine generata dall'intelligenza artificiale, personalizzata sulla tua mappa numerologica.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Include: introduzione personalizzata, analisi completa dei numeri, dinamiche karmiche, fase di vita attuale, strategie evolutive e conclusione ispirazionale.
            </p>

            {!numerology ? (
              <div>
                <p className="text-sm text-destructive mb-4">⚠️ Genera prima la tua mappa numerologica.</p>
                <Button variant="cosmic-outline" asChild>
                  <Link to="/map">Genera la Mappa</Link>
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleGenerate}
                disabled={generating}
                className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-8 py-3 text-lg"
                size="lg"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generazione in corso...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Genera il Report
                  </>
                )}
              </Button>
            )}

            {generating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6"
              >
                <p className="text-sm text-muted-foreground">
                  L'AI sta analizzando la tua mappa e scrivendo 6 sezioni personalizzate.
                  <br />Questo può richiedere 1-2 minuti...
                </p>
                <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden max-w-xs mx-auto">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-accent"
                    initial={{ width: "5%" }}
                    animate={{ width: "90%" }}
                    transition={{ duration: 90, ease: "linear" }}
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Report preview */}
        {hasReport && (
          <>
            {/* Actions bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-cosmic rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3"
            >
              <div>
                <h2 className="font-display font-semibold">Il tuo Report</h2>
                <p className="text-xs text-muted-foreground">
                  {report?.edited_sections
                    ? "Contiene modifiche manuali"
                    : "Generato dall'AI — puoi modificare ogni sezione"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="cosmic-outline"
                  size="sm"
                  onClick={handleGenerate}
                  disabled={generating}
                >
                  <RefreshCw className={`w-4 h-4 mr-1 ${generating ? "animate-spin" : ""}`} />
                  Rigenera
                </Button>
                <Button
                  size="sm"
                  onClick={handleDownloadPdf}
                  className="bg-gradient-to-r from-primary to-accent text-primary-foreground"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Scarica PDF
                </Button>
              </div>
            </motion.div>

            {/* Sections */}
            {sectionOrder.map((key, i) => {
              const section = effectiveSections[key];
              if (!section) return null;
              const isExpanded = expandedSections.has(key);
              const isEditing = editingSection === key;
              const wasEdited = report?.edited_sections?.[key] !== undefined;

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-cosmic rounded-2xl overflow-hidden"
                >
                  {/* Section header */}
                  <button
                    onClick={() => toggleSection(key)}
                    className="w-full flex items-center gap-3 p-5 text-left hover:bg-muted/20 transition-colors"
                  >
                    <span className="text-xl">{sectionIcons[key] || "📄"}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-semibold">{section.title}</h3>
                        {wasEdited && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-accent/20 text-accent rounded-full">
                            Modificato
                          </span>
                        )}
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>

                  {/* Section content */}
                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-border/30">
                      {isEditing ? (
                        <div className="mt-4 space-y-3">
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full min-h-[300px] bg-input/50 rounded-xl p-4 text-sm text-foreground border border-border/50 focus:border-primary/50 focus:outline-none resize-y"
                          />
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingSection(null)}
                            >
                              <X className="w-4 h-4 mr-1" /> Annulla
                            </Button>
                            <Button
                              size="sm"
                              onClick={handleSaveEdit}
                              className="bg-gradient-to-r from-primary to-accent text-primary-foreground"
                            >
                              <Check className="w-4 h-4 mr-1" /> Salva
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4">
                          <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                            {section.content.split("\n").map((p, pi) =>
                              p.trim() ? (
                                <p key={pi} className="mb-3 text-sm">
                                  {p.replace(/\*\*/g, "").replace(/##?\s*/g, "")}
                                </p>
                              ) : null
                            )}
                          </div>
                          <div className="mt-4 flex justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStartEdit(key)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <Pencil className="w-3.5 h-3.5 mr-1" /> Modifica
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </>
        )}
      </main>
    </div>
  );
}
