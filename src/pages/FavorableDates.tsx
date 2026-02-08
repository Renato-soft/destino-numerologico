import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Calendar,
  Sparkles,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  calculateDayVibration,
  calculatePersonalYear,
  reduceNumber,
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
}

const FavorableDates = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [objective, setObjective] = useState("");
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
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("birth_date")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (!data) {
      navigate("/onboarding");
      return;
    }

    setProfile(data);
    setLoading(false);
  };

  const analyzeDates = async () => {
    if (!profile || !objective.trim()) {
      toast({
        title: "Inserisci un obiettivo",
        description: "Descrivi cosa vuoi fare per trovare le date migliori.",
        variant: "destructive",
      });
      return;
    }

    setAnalyzing(true);

    try {
      const [birthYear, birthMonth, birthDay] = profile.birth_date.split("-").map(Number);
      const start = parse(startDate, "yyyy-MM-dd", new Date());
      const end = parse(endDate, "yyyy-MM-dd", new Date());

      if (!isValid(start) || !isValid(end)) {
        throw new Error("Date non valide");
      }

      const dateResults: DateResult[] = [];
      let currentDate = start;

      // Keywords for favorable activities by vibration
      const vibrationAffinities: Record<number, string[]> = {
        1: ["inizio", "lancio", "decisione", "colloquio", "nuovo", "avviare"],
        2: ["collaborazione", "accordo", "partner", "diplomatico", "pace", "coppia"],
        3: ["comunicazione", "presentazione", "social", "creativo", "festa", "espressione"],
        4: ["contratto", "firma", "costruire", "organizzare", "struttura", "lavoro"],
        5: ["viaggio", "cambiamento", "avventura", "libertà", "movimento", "novità"],
        6: ["famiglia", "casa", "matrimonio", "amore", "responsabilità", "bellezza"],
        7: ["studio", "analisi", "introspezione", "spirituale", "ricerca", "meditazione"],
        8: ["finanza", "investimento", "carriera", "potere", "successo", "denaro"],
        9: ["conclusione", "chiusura", "umanitario", "lasciare", "completare", "trasformazione"],
      };

      const objectiveLower = objective.toLowerCase();

      while (currentDate <= end) {
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();

        const vibration = calculateDayVibration(day, month, year);
        const personalYear = calculatePersonalYear(birthDay, birthMonth, year);

        // Check affinity with objective
        const affinities = vibrationAffinities[vibration] || [];
        const hasAffinity = affinities.some(keyword => objectiveLower.includes(keyword));

        // Calculate compatibility with personal year
        const compatible = vibration === personalYear || 
          Math.abs(vibration - personalYear) <= 2 ||
          [1, 3, 5, 9].includes(vibration); // Generally favorable numbers

        const favorable = hasAffinity || compatible;

        let reason = "";
        if (hasAffinity) {
          reason = `Vibrazione ${vibration} allineata con il tuo obiettivo`;
        } else if (compatible) {
          reason = `Energia ${vibration} compatibile con il tuo Anno Personale ${personalYear}`;
        } else {
          reason = `Vibrazione ${vibration} meno favorevole per questo tipo di attività`;
        }

        dateResults.push({
          date: new Date(currentDate),
          vibration,
          favorable,
          reason,
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
        description: `Trovate ${dateResults.filter(d => d.favorable).length} date favorevoli.`,
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

  const favorableDates = results.filter(r => r.favorable).slice(0, 10);
  const unfavorableDates = results.filter(r => !r.favorable).slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="fixed inset-0 numerology-pattern opacity-20 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-b from-secondary/5 via-transparent to-primary/5 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-semibold">Date Favorevoli</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Form */}
          <div className="glass-cosmic rounded-2xl p-6 space-y-4">
            <div>
              <Label htmlFor="objective">Cosa vuoi fare?</Label>
              <Textarea
                id="objective"
                placeholder="Es: firmare un contratto, iniziare un nuovo progetto, colloquio di lavoro, matrimonio..."
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="mt-2"
                rows={3}
              />
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
              {/* Favorable dates */}
              <div className="space-y-4">
                <h2 className="font-display text-xl font-semibold flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Date Consigliate ({favorableDates.length})
                </h2>
                <div className="space-y-2">
                  {favorableDates.map((result, index) => (
                    <motion.div
                      key={result.date.toISOString()}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="glass-cosmic rounded-xl p-4 border border-green-500/30"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="number-circle w-10 h-10 text-sm bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/50">
                            {result.vibration}
                          </div>
                          <div>
                            <p className="font-semibold">
                              {format(result.date, "EEEE d MMMM yyyy", { locale: it })}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {result.reason}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Unfavorable dates */}
              {unfavorableDates.length > 0 && (
                <div className="space-y-4">
                  <h2 className="font-display text-xl font-semibold flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-500" />
                    Date da Evitare ({unfavorableDates.length})
                  </h2>
                  <div className="space-y-2">
                    {unfavorableDates.map((result, index) => (
                      <motion.div
                        key={result.date.toISOString()}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="glass-cosmic rounded-xl p-4 border border-red-500/30 opacity-75"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="number-circle w-10 h-10 text-sm bg-gradient-to-br from-red-500/20 to-rose-500/20 border-red-500/50">
                              {result.vibration}
                            </div>
                            <div>
                              <p className="font-semibold">
                                {format(result.date, "EEEE d MMMM yyyy", { locale: it })}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {result.reason}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default FavorableDates;
