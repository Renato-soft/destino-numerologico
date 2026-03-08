import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  ArrowLeft,
  Building2,
  Lightbulb,
  Globe,
  Package,
  Target,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import {
  calculateBrandVibration,
  brandVibrationMeanings,
  brandObjectives,
  getLifePathCompatibility,
  getObjectiveCompatibility,
  suggestAlternatives,
} from "@/lib/brandNumerology";

const brandTypes = [
  { id: "azienda", label: "Azienda", icon: Building2 },
  { id: "progetto", label: "Progetto", icon: Lightbulb },
  { id: "dominio", label: "Dominio", icon: Globe },
  { id: "prodotto", label: "Prodotto", icon: Package },
];

function AlignmentGauge({ score }: { score: number }) {
  const getColor = () => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-red-400";
  };
  const getIcon = () => {
    if (score >= 80) return CheckCircle2;
    if (score >= 60) return AlertTriangle;
    return XCircle;
  };
  const Icon = getIcon();
  const getLabel = () => {
    if (score >= 80) return "Eccellente";
    if (score >= 60) return "Moderato";
    return "Basso";
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" fill="none" stroke="hsl(var(--muted))" strokeWidth="5" />
          <circle
            cx="32" cy="32" r="28" fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeDasharray={`${(score / 100) * 175.9} 175.9`}
            strokeLinecap="round"
            className={getColor()}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-sm font-bold ${getColor()}`}>{score}</span>
        </div>
      </div>
      <div>
        <div className={`flex items-center gap-1.5 font-semibold ${getColor()}`}>
          <Icon className="w-4 h-4" />
          {getLabel()}
        </div>
      </div>
    </div>
  );
}

export default function BrandAnalyzer() {
  const navigate = useNavigate();
  const [lifePath, setLifePath] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const [brandName, setBrandName] = useState("");
  const [brandType, setBrandType] = useState("azienda");
  const [objective, setObjective] = useState("financial");
  const [result, setResult] = useState<ReturnType<typeof calculateBrandVibration> | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }

      const { data: map } = await supabase
        .from("numerology_maps")
        .select("life_path")
        .eq("user_id", session.user.id)
        .order("computed_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (map) setLifePath(map.life_path);
      setLoading(false);
    };
    load();
  }, [navigate]);

  const analyze = () => {
    if (!brandName.trim()) return;
    setResult(calculateBrandVibration(brandName.trim()));
  };

  const meaning = result ? brandVibrationMeanings[result.vibration] : null;
  const lpCompat = result && lifePath ? getLifePathCompatibility(result.vibration, lifePath) : null;
  const objCompat = result ? getObjectiveCompatibility(result.vibration, objective) : null;

  // Find the best-aligned objective for suggestion
  const bestObjective = result
    ? brandObjectives.reduce((best, obj) => {
        const s = getObjectiveCompatibility(result.vibration, obj.id);
        return s.score > best.score ? { ...obj, score: s.score } : best;
      }, { id: "", label: "", alignedNumbers: [] as readonly number[], score: 0 })
    : null;

  const alternatives = result && objCompat && objCompat.score < 60
    ? (() => {
        const targetObj = brandObjectives.find((o) => o.id === objective);
        if (!targetObj || !targetObj.alignedNumbers[0]) return [];
        return suggestAlternatives(brandName, targetObj.alignedNumbers[0]);
      })()
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

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
              <Target className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-lg font-semibold">Analizzatore Brand</h1>
              <p className="text-xs text-muted-foreground">Vibrazione numerologica del nome</p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8 max-w-2xl space-y-8">
        {/* Input section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-cosmic rounded-2xl p-6 space-y-6"
        >
          {/* Brand type selector */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Tipo di nome</label>
            <div className="grid grid-cols-4 gap-2">
              {brandTypes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setBrandType(t.id)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all text-xs ${
                    brandType === t.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/50 text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  <t.icon className="w-5 h-5" />
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Brand name input */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              Nome {brandTypes.find((t) => t.id === brandType)?.label}
            </label>
            <div className="flex gap-2">
              <Input
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Es. Aurora Digital"
                className="flex-1 bg-input/50"
                onKeyDown={(e) => e.key === "Enter" && analyze()}
              />
              <Button onClick={analyze} className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                <Sparkles className="w-4 h-4 mr-2" />
                Analizza
              </Button>
            </div>
          </div>

          {/* Objective selector */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Obiettivo strategico</label>
            <div className="flex flex-wrap gap-2">
              {brandObjectives.map((obj) => (
                <button
                  key={obj.id}
                  onClick={() => setObjective(obj.id)}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                    objective === obj.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/50 text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  {obj.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {result && meaning && (
            <motion.div
              key={result.vibration + brandName}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Main vibration */}
              <div className="glass-cosmic rounded-2xl p-6 text-center">
                <p className="text-sm text-muted-foreground mb-3">Vibrazione del nome</p>
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br ${meaning.color} mb-4`}>
                  <span className="text-3xl font-bold text-white">{result.vibration}</span>
                </div>
                <h2 className="font-display text-2xl font-bold mb-1">{meaning.title}</h2>
                <p className="text-muted-foreground">{meaning.energy}</p>

                {/* Letter breakdown */}
                <div className="mt-6 flex flex-wrap justify-center gap-1.5">
                  {result.letterBreakdown.map((l, i) => (
                    <div key={i} className="flex flex-col items-center bg-muted/50 rounded-lg px-2 py-1 min-w-[32px]">
                      <span className="text-xs text-muted-foreground">{l.letter}</span>
                      <span className="text-sm font-semibold text-primary">{l.value}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Somma: {result.totalSum} → Riduzione: {result.vibration}
                </p>
              </div>

              {/* Strengths and ideal for */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="glass-cosmic rounded-2xl p-5">
                  <h3 className="font-display font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Punti di forza
                  </h3>
                  <ul className="space-y-1.5">
                    {meaning.strengths.map((s) => (
                      <li key={s} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="glass-cosmic rounded-2xl p-5">
                  <h3 className="font-display font-semibold mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" /> Ideale per
                  </h3>
                  <ul className="space-y-1.5">
                    {meaning.idealFor.map((s) => (
                      <li key={s} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" /> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Alignment indicators */}
              <div className="glass-cosmic rounded-2xl p-6 space-y-6">
                <h3 className="font-display text-lg font-semibold flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-primary" /> Allineamento Strategico
                </h3>

                {/* Life Path compatibility */}
                {lpCompat && (
                  <div className="flex items-start gap-4">
                    <AlignmentGauge score={lpCompat.score} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Con il tuo Destino ({lifePath})</p>
                      <p className="text-sm text-muted-foreground">{lpCompat.description}</p>
                    </div>
                  </div>
                )}

                {/* Objective compatibility */}
                {objCompat && (
                  <div className="flex items-start gap-4">
                    <AlignmentGauge score={objCompat.score} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Con l'obiettivo: {brandObjectives.find((o) => o.id === objective)?.label}
                      </p>
                      <p className="text-sm text-muted-foreground">{objCompat.description}</p>
                    </div>
                  </div>
                )}

                {bestObjective && bestObjective.score > 0 && (
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                    <p className="text-sm">
                      <Lightbulb className="w-4 h-4 text-primary inline mr-1.5" />
                      <span className="font-medium">Suggerimento:</span>{" "}
                      <span className="text-muted-foreground">
                        Questo nome è più allineato all'obiettivo "{bestObjective.label}" (punteggio {bestObjective.score}/100).
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Less ideal for */}
              {meaning.lessIdealFor.length > 0 && (
                <div className="glass-cosmic rounded-2xl p-5">
                  <h3 className="font-display font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" /> Meno indicato per
                  </h3>
                  <ul className="space-y-1.5">
                    {meaning.lessIdealFor.map((s) => (
                      <li key={s} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Alternative suggestions */}
              {alternatives.length > 0 && (
                <div className="glass-cosmic rounded-2xl p-5">
                  <h3 className="font-display font-semibold mb-3 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-accent" /> Varianti suggerite
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Nomi con vibrazione più allineata al tuo obiettivo:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {alternatives.map((alt) => {
                      const v = calculateBrandVibration(alt);
                      return (
                        <button
                          key={alt}
                          onClick={() => { setBrandName(alt); setResult(v); }}
                          className="px-3 py-2 rounded-xl border border-accent/30 bg-accent/5 text-sm hover:bg-accent/10 transition-all"
                        >
                          <span className="font-medium">{alt}</span>
                          <span className="ml-2 text-xs text-accent">({v.vibration})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
