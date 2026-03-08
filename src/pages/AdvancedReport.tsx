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
        generated_at: null,
        finalized_at: null,
      });

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
        generated_at: new Date().toISOString(),
        finalized_at: null,
      });

      toast({ title: "Report generato con successo! ✨", description: "Puoi ora scaricarlo in PDF." });
    } catch (e) {
      console.error(e);
      toast({ title: "Errore", description: "Impossibile generare il report.", variant: "destructive" });
    }

    setGenerating(false);
  };

  const handleDownloadPdf = () => {
    if (!profile || !numerology || !report) return;
    generateAdvancedReportPdf(profile, numerology, report.sections);

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

  const hasReport = report && report.status !== "generating" && Object.keys(report.sections).length > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 numerology-pattern opacity-20 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-b from-secondary/5 via-transparent to-primary/5 pointer-events-none" />

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

        {hasReport && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-cosmic rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3"
            >
              <div>
                <h2 className="font-display font-semibold">Il tuo Report</h2>
                <p className="text-xs text-muted-foreground">Generato dall'AI</p>
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

            {sectionOrder.map((key, i) => {
              const section = report?.sections[key];
              if (!section) return null;
              const isExpanded = expandedSections.has(key);

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-cosmic rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleSection(key)}
                    className="w-full flex items-center gap-3 p-5 text-left hover:bg-muted/20 transition-colors"
                  >
                    <span className="text-xl">{sectionIcons[key] || "📄"}</span>
                    <div className="flex-1">
                      <h3 className="font-display font-semibold">{section.title}</h3>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-border/30">
                      <div className="mt-4 prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                        {section.content.split("\n").map((p, pi) =>
                          p.trim() ? (
                            <p key={pi} className="mb-3 text-sm">
                              {p.replace(/\*\*/g, "").replace(/##?\s*/g, "")}
                            </p>
                          ) : null
                        )}
                      </div>
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
