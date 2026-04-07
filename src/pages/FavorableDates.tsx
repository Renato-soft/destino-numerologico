import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Sparkles,
  Loader2,
  CheckCircle,
  XCircle,
  Briefcase,
  Heart,
  Palette,
  Plane,
  GraduationCap,
  Home,
  Users,
  Zap,
  Info,
} from "lucide-react";
import {
  calculateDayVibration,
  calculatePersonalYear,
} from "@/lib/numerology";
import { format, addDays, parse, isValid } from "date-fns";
import { it } from "date-fns/locale";

interface Profile {
  birth_date: string;
}

interface DateResult {
  date: Date;
  vibration: number;
  favorable: boolean;
  reason: string;
  vibrationMeaning: string;
  activityTip: string;
}

const ACTIVITY_FILTERS = [
  { id: "all", label: "Tutti", icon: Zap, keywords: [] },
  { id: "lavoro", label: "Lavoro", icon: Briefcase, keywords: ["inizio", "lancio", "decisione", "colloquio", "nuovo", "avviare", "contratto", "firma", "costruire", "organizzare", "struttura", "lavoro", "carriera", "investimento", "potere", "successo", "denaro", "finanza"] },
  { id: "amore", label: "Amore", icon: Heart, keywords: ["collaborazione", "accordo", "partner", "coppia", "famiglia", "casa", "matrimonio", "amore", "responsabilità", "bellezza", "pace"] },
  { id: "creativita", label: "Creatività", icon: Palette, keywords: ["comunicazione", "presentazione", "social", "creativo", "festa", "espressione", "arte", "ispirazione"] },
  { id: "viaggio", label: "Viaggi", icon: Plane, keywords: ["viaggio", "cambiamento", "avventura", "libertà", "movimento", "novità", "esplorazione"] },
  { id: "studio", label: "Studio", icon: GraduationCap, keywords: ["studio", "analisi", "introspezione", "spirituale", "ricerca", "meditazione", "apprendimento"] },
  { id: "casa", label: "Casa", icon: Home, keywords: ["famiglia", "casa", "costruire", "organizzare", "struttura", "responsabilità", "bellezza", "arredamento"] },
  { id: "relazioni", label: "Relazioni", icon: Users, keywords: ["collaborazione", "accordo", "partner", "diplomatico", "pace", "coppia", "comunicazione", "sociale", "incontro"] },
];

const VIBRATION_MEANINGS: Record<number, { title: string; energy: string; bestFor: string; avoid: string }> = {
  1: {
    title: "Nuovi Inizi",
    energy: "Energia di leadership, indipendenza e azione decisiva. Giornata perfetta per prendere l'iniziativa.",
    bestFor: "Avviare progetti, colloqui, decisioni importanti, inaugurazioni",
    avoid: "Attività di gruppo, compromessi, attese passive",
  },
  2: {
    title: "Cooperazione",
    energy: "Energia diplomatica e armoniosa. Favorisce i legami e la collaborazione.",
    bestFor: "Incontri di coppia, negoziazioni, accordi, mediazioni",
    avoid: "Azioni individuali aggressive, decisioni impulsive",
  },
  3: {
    title: "Espressione Creativa",
    energy: "Energia di comunicazione, gioia e creatività. Ottima per esprimersi.",
    bestFor: "Presentazioni, eventi sociali, scrittura, arte, networking",
    avoid: "Compiti monotoni, analisi dettagliate, isolamento",
  },
  4: {
    title: "Costruzione Solida",
    energy: "Energia di stabilità, disciplina e organizzazione. Ideale per strutturare.",
    bestFor: "Firmare contratti, pianificare, organizzare, lavori pratici",
    avoid: "Cambiamenti improvvisi, avventure rischiose, improvvisazione",
  },
  5: {
    title: "Libertà e Cambiamento",
    energy: "Energia dinamica e avventurosa. Favorisce il movimento e il rinnovamento.",
    bestFor: "Viaggi, cambiamenti di vita, nuove esperienze, promozioni",
    avoid: "Routine, impegni a lungo termine, decisioni vincolanti",
  },
  6: {
    title: "Armonia Familiare",
    energy: "Energia di amore, responsabilità e bellezza. Perfetta per i legami affettivi.",
    bestFor: "Matrimoni, questioni familiari, decorazione casa, cure estetiche",
    avoid: "Conflitti, separazioni, decisioni egoistiche",
  },
  7: {
    title: "Introspezione",
    energy: "Energia di riflessione, studio e crescita interiore. Favorisce la comprensione profonda.",
    bestFor: "Studio, meditazione, analisi, ricerche, consulti medici",
    avoid: "Feste rumorose, decisioni affrettate, attività sociali intense",
  },
  8: {
    title: "Potere e Abbondanza",
    energy: "Energia di successo materiale e autorità. Ottima per questioni finanziarie.",
    bestFor: "Investimenti, trattative, promozioni, acquisti importanti",
    avoid: "Spese impulsive, rischi non calcolati, donazioni eccessive",
  },
  9: {
    title: "Completamento",
    energy: "Energia di conclusione, generosità e trasformazione. Ideale per chiudere cicli.",
    bestFor: "Chiusure, donazioni, volontariato, lasciare andare, bilanci",
    avoid: "Nuovi inizi, investimenti a lungo termine, attaccamenti",
  },
};

const VIBRATION_ACTIVITY_AFFINITY: Record<number, string[]> = {
  1: ["lavoro", "all"],
  2: ["amore", "relazioni", "all"],
  3: ["creativita", "relazioni", "all"],
  4: ["lavoro", "casa", "all"],
  5: ["viaggio", "creativita", "all"],
  6: ["amore", "casa", "relazioni", "all"],
  7: ["studio", "all"],
  8: ["lavoro", "all"],
  9: ["relazioni", "studio", "all"],
};

const FavorableDates = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [activityFilter, setActivityFilter] = useState("all");
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(addDays(new Date(), 30), "yyyy-MM-dd"));
  const [results, setResults] = useState<DateResult[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate("/auth"); return; }

    const { data } = await supabase
      .from("profiles")
      .select("birth_date")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (!data) { navigate("/onboarding"); return; }
    setProfile(data);
    setLoading(false);
  };

  const analyzeDates = async () => {
    if (!profile) return;

    setAnalyzing(true);
    try {
      const [, birthMonth, birthDay] = profile.birth_date.split("-").map(Number);
      const start = parse(startDate, "yyyy-MM-dd", new Date());
      const end = parse(endDate, "yyyy-MM-dd", new Date());

      if (!isValid(start) || !isValid(end)) throw new Error("Date non valide");

      const dateResults: DateResult[] = [];
      let currentDate = start;

      const selectedFilter = ACTIVITY_FILTERS.find(f => f.id === activityFilter);

      while (currentDate <= end) {
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();

        const vibration = calculateDayVibration(day, month, year);
        const personalYear = calculatePersonalYear(birthDay, birthMonth, year);
        const meaning = VIBRATION_MEANINGS[vibration];
        const affinities = VIBRATION_ACTIVITY_AFFINITY[vibration] || [];

        // Determine favorability based on selected activity filter
        let favorable = false;
        let reason = "";
        let activityTip = "";

        if (activityFilter === "all") {
          // General mode: compatible with personal year
          const compatible = vibration === personalYear ||
            Math.abs(vibration - personalYear) <= 2 ||
            [1, 3, 5, 9].includes(vibration);
          favorable = compatible;
          reason = compatible
            ? `Energia ${vibration} in armonia con il tuo Anno Personale ${personalYear}`
            : `Vibrazione ${vibration} meno allineata con il tuo Anno Personale ${personalYear}`;
          activityTip = meaning?.bestFor || "";
        } else {
          // Activity-specific mode
          favorable = affinities.includes(activityFilter);
          const filterLabel = selectedFilter?.label || activityFilter;
          
          if (favorable) {
            reason = `Vibrazione ${vibration} (${meaning?.title}) ideale per ${filterLabel}`;
            activityTip = meaning?.bestFor || "";
          } else {
            reason = `Vibrazione ${vibration} (${meaning?.title}) meno indicata per ${filterLabel}`;
            activityTip = meaning?.avoid || "";
          }

          // Boost if also aligned with personal year
          if (favorable && (vibration === personalYear || Math.abs(vibration - personalYear) <= 1)) {
            reason += ` — doppio allineamento con il tuo Anno Personale ${personalYear}!`;
          }
        }

        dateResults.push({
          date: new Date(currentDate),
          vibration,
          favorable,
          reason,
          vibrationMeaning: meaning?.energy || "",
          activityTip,
        });

        currentDate = addDays(currentDate, 1);
      }

      // Sort: favorable first, then by date
      dateResults.sort((a, b) => {
        if (a.favorable !== b.favorable) return b.favorable ? 1 : -1;
        return a.date.getTime() - b.date.getTime();
      });

      setResults(dateResults);

      toast({
        title: "Analisi completata",
        description: `Trovate ${dateResults.filter(d => d.favorable).length} date favorevoli su ${dateResults.length} analizzate.`,
      });
    } catch (error) {
      console.error("Error analyzing dates:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'analisi.",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground">Caricamento...</p>
        </div>
      </div>
    );
  }

  const favorableDates = results.filter(r => r.favorable).slice(0, 15);
  const unfavorableDates = results.filter(r => !r.favorable).slice(0, 5);

  return (
    <DashboardLayout title="Date Favorevoli">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Activity Filter */}
          <div className="glass-cosmic rounded-2xl p-6 space-y-4">
            <div>
              <Label className="text-sm font-medium mb-3 block">Tipo di attività</Label>
              <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
                {ACTIVITY_FILTERS.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActivityFilter(filter.id)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all text-xs ${
                      activityFilter === filter.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/50 text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    <filter.icon className="w-4 h-4" />
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Data inizio</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="endDate">Data fine</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>

            <Button
              variant="cosmic"
              className="w-full"
              onClick={analyzeDates}
              disabled={analyzing}
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analisi in corso...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Trova le Date Migliori
                </>
              )}
            </Button>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <>
              {/* Summary */}
              <div className="glass-cosmic rounded-2xl p-5 text-center">
                <p className="text-sm text-muted-foreground">
                  Analizzati <span className="font-bold text-foreground">{results.length}</span> giorni
                  {activityFilter !== "all" && (
                    <> per <span className="font-bold text-primary">{ACTIVITY_FILTERS.find(f => f.id === activityFilter)?.label}</span></>
                  )}
                </p>
                <p className="text-2xl font-display font-bold text-primary mt-1">
                  {favorableDates.length} date favorevoli
                </p>
              </div>

              {/* Favorable dates */}
              <div className="space-y-4">
                <h2 className="font-display text-xl font-semibold flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Date Consigliate ({favorableDates.length})
                </h2>
                <div className="space-y-3">
                  {favorableDates.map((result, index) => {
                    const meaning = VIBRATION_MEANINGS[result.vibration];
                    return (
                      <motion.div
                        key={result.date.toISOString()}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="glass-cosmic rounded-xl p-4 border border-green-500/30 space-y-2"
                      >
                        <div className="flex items-center gap-3">
                          <div className="number-circle w-12 h-12 text-base bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/50 flex-shrink-0">
                            {result.vibration}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold">
                              {format(result.date, "EEEE d MMMM yyyy", { locale: it })}
                            </p>
                            <p className="text-xs font-medium text-primary">
                              {meaning?.title}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{result.reason}</p>
                        <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 space-y-1">
                          <p className="text-xs text-muted-foreground">{result.vibrationMeaning}</p>
                          <p className="text-xs">
                            <span className="font-medium text-foreground">Ideale per:</span>{" "}
                            <span className="text-muted-foreground">{result.activityTip}</span>
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Unfavorable dates */}
              {unfavorableDates.length > 0 && (
                <div className="space-y-4">
                  <h2 className="font-display text-xl font-semibold flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-500" />
                    Date da Evitare ({unfavorableDates.length})
                  </h2>
                  <div className="space-y-3">
                    {unfavorableDates.map((result, index) => {
                      const meaning = VIBRATION_MEANINGS[result.vibration];
                      return (
                        <motion.div
                          key={result.date.toISOString()}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="glass-cosmic rounded-xl p-4 border border-red-500/30 opacity-80 space-y-2"
                        >
                          <div className="flex items-center gap-3">
                            <div className="number-circle w-12 h-12 text-base bg-gradient-to-br from-red-500/20 to-rose-500/20 border-red-500/50 flex-shrink-0">
                              {result.vibration}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold">
                                {format(result.date, "EEEE d MMMM yyyy", { locale: it })}
                              </p>
                              <p className="text-xs font-medium text-rose-400">
                                {meaning?.title}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{result.reason}</p>
                          <div className="bg-rose-500/5 border border-rose-500/10 rounded-lg p-3">
                            <p className="text-xs">
                              <span className="font-medium text-foreground">Da evitare:</span>{" "}
                              <span className="text-muted-foreground">{meaning?.avoid}</span>
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Legend */}
              <div className="glass-cosmic rounded-2xl p-5">
                <h3 className="font-display font-semibold flex items-center gap-2 mb-3 text-sm">
                  <Info className="w-4 h-4 text-primary" />
                  Come leggere i risultati
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Ogni giorno possiede una vibrazione numerologica (1-9) calcolata dalla somma della data. 
                  Questa vibrazione viene confrontata con il tuo Anno Personale e con il tipo di attività selezionato 
                  per determinare le giornate più favorevoli. Pianifica i tuoi impegni importanti nelle date consigliate 
                  per massimizzare l'allineamento energetico.
                </p>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default FavorableDates;
