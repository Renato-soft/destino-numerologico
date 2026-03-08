import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Sparkles,
  Lock,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Brain,
  Trophy,
  X,
} from "lucide-react";
import { pillarsContent, type PillarContent } from "@/data/pillarsContent";
import { calculateKarmicLessons, karmicLessonMeanings } from "@/lib/karmicLessons";
import { numberMeanings, masterMeanings } from "@/lib/numerology";

interface PillarProgress {
  pillar_index: number;
  unlocked_at: string;
  started_at: string | null;
  exercise_completed: boolean;
  meditation_completed: boolean;
  completed_at: string | null;
}

interface Badge {
  badge_id: string;
  earned_at: string;
}

interface NumerologyData {
  life_path: number;
  destiny_expression: number;
  soul: number;
  personality: number;
  personal_year: number;
}

interface ProfileData {
  nome: string;
  cognome: string;
}

export default function Pillars() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [progress, setProgress] = useState<PillarProgress[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [numerology, setNumerology] = useState<NumerologyData | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [activePillar, setActivePillar] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "exercise" | "meditation">("overview");

  const loadData = useCallback(async (uid: string) => {
    const [progressRes, badgesRes, mapRes, profileRes] = await Promise.all([
      supabase.from("pillar_progress").select("*").eq("user_id", uid),
      supabase.from("pillar_badges").select("*").eq("user_id", uid),
      supabase
        .from("numerology_maps")
        .select("life_path, destiny_expression, soul, personality, personal_year")
        .eq("user_id", uid)
        .order("computed_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase.from("profiles").select("nome, cognome").eq("user_id", uid).maybeSingle(),
    ]);

    if (progressRes.data) setProgress(progressRes.data as PillarProgress[]);
    if (badgesRes.data) setBadges(badgesRes.data as Badge[]);
    if (mapRes.data) setNumerology(mapRes.data as NumerologyData);
    if (profileRes.data) setProfile(profileRes.data as ProfileData);
  }, []);

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUserId(session.user.id);
      await loadData(session.user.id);

      // Auto-unlock first pillar if nothing exists
      const { data: existing } = await supabase
        .from("pillar_progress")
        .select("pillar_index")
        .eq("user_id", session.user.id)
        .eq("pillar_index", 0)
        .maybeSingle();

      if (!existing) {
        await supabase.from("pillar_progress").insert({
          user_id: session.user.id,
          pillar_index: 0,
        });
        await loadData(session.user.id);
      }

      setLoading(false);
    };
    init();
  }, [navigate, loadData]);

  const getPillarProgress = (index: number) => progress.find((p) => p.pillar_index === index);
  const isPillarUnlocked = (index: number) => !!getPillarProgress(index);
  const isPillarCompleted = (index: number) => !!getPillarProgress(index)?.completed_at;

  const completedCount = progress.filter((p) => p.completed_at).length;
  const overallProgress = Math.round((completedCount / 7) * 100);

  const getPillarNumber = (pillar: PillarContent): number | null => {
    if (!numerology) return null;
    if (pillar.mapKey) return numerology[pillar.mapKey];
    return null;
  };

  const karmicLessons =
    profile && numerology ? calculateKarmicLessons(`${profile.nome} ${profile.cognome}`) : [];

  const handleStartPillar = async (index: number) => {
    if (!userId) return;
    const p = getPillarProgress(index);
    if (p && !p.started_at) {
      await supabase
        .from("pillar_progress")
        .update({ started_at: new Date().toISOString() })
        .eq("user_id", userId)
        .eq("pillar_index", index);
      await loadData(userId);
    }
    setActivePillar(index);
    setActiveTab("overview");
  };

  const handleCompleteStep = async (index: number, step: "exercise" | "meditation") => {
    if (!userId) return;
    const field = step === "exercise" ? "exercise_completed" : "meditation_completed";
    await supabase
      .from("pillar_progress")
      .update({ [field]: true })
      .eq("user_id", userId)
      .eq("pillar_index", index);

    // Check if both are now complete
    const p = getPillarProgress(index);
    const otherDone =
      step === "exercise" ? p?.meditation_completed : p?.exercise_completed;

    if (otherDone) {
      // Complete the pillar
      await supabase
        .from("pillar_progress")
        .update({ completed_at: new Date().toISOString() })
        .eq("user_id", userId)
        .eq("pillar_index", index);

      // Award badge
      const pillar = pillarsContent[index];
      await supabase.from("pillar_badges").insert({
        user_id: userId,
        badge_id: pillar.badgeId,
      });

      // Unlock next pillar
      if (index < 6) {
        const nextExists = getPillarProgress(index + 1);
        if (!nextExists) {
          await supabase.from("pillar_progress").insert({
            user_id: userId,
            pillar_index: index + 1,
          });
        }
      }

      toast({
        title: `🏆 Badge sbloccato: ${pillar.badgeName}!`,
        description: `Hai completato il Pilastro "${pillar.title}". ${index < 6 ? "Il prossimo pilastro è ora disponibile!" : "Hai completato tutti i 7 Pilastri!"}`,
      });
    }

    await loadData(userId);
  };

  const getNumberInterpretation = (num: number): string => {
    if (masterMeanings[num]) return masterMeanings[num].description;
    if (numberMeanings[num]) return numberMeanings[num].evolution;
    return "";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const activePillarData = activePillar !== null ? pillarsContent[activePillar] : null;
  const activePillarProgress = activePillar !== null ? getPillarProgress(activePillar) : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 numerology-pattern opacity-20 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-b from-secondary/5 via-transparent to-primary/5 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-lg font-semibold">I 7 Pilastri del Destino</h1>
              <p className="text-xs text-muted-foreground">Percorso Evolutivo Guidato</p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8 max-w-3xl">
        {/* Progress overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-cosmic rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-lg font-semibold">Il tuo cammino</h2>
              <p className="text-sm text-muted-foreground">
                {completedCount}/7 pilastri completati
              </p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-gradient-gold">{overallProgress}%</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-3 bg-muted rounded-full overflow-hidden mb-4">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>

          {/* Badge row */}
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {badges.map((b) => {
                const pillar = pillarsContent.find((p) => p.badgeId === b.badge_id);
                return (
                  <div
                    key={b.badge_id}
                    className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 text-xs"
                  >
                    <span>{pillar?.badgeEmoji}</span>
                    <span className="text-primary font-medium">{pillar?.badgeName}</span>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Pillar list */}
        <div className="space-y-4">
          {pillarsContent.map((pillar, i) => {
            const unlocked = isPillarUnlocked(i);
            const completed = isPillarCompleted(i);
            const pillarNum = getPillarNumber(pillar);
            const p = getPillarProgress(i);

            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <button
                  onClick={() => unlocked && handleStartPillar(i)}
                  disabled={!unlocked}
                  className={`w-full text-left rounded-2xl border p-5 transition-all ${
                    completed
                      ? "bg-primary/5 border-primary/30"
                      : unlocked
                      ? "glass-cosmic border-border/50 hover:border-primary/40 hover:shadow-cosmic cursor-pointer"
                      : "bg-muted/20 border-border/20 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
                        unlocked
                          ? `bg-gradient-to-br ${pillar.color}`
                          : "bg-muted"
                      }`}
                    >
                      {unlocked ? pillar.icon : <Lock className="w-5 h-5 text-muted-foreground" />}
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Pilastro {i + 1}</span>
                        {completed && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        )}
                      </div>
                      <h3 className="font-display text-lg font-semibold truncate">{pillar.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">{pillar.subtitle}</p>
                    </div>

                    {/* Number or status */}
                    <div className="flex-shrink-0">
                      {completed ? (
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <Trophy className="w-5 h-5 text-emerald-400" />
                        </div>
                      ) : unlocked && pillarNum ? (
                        <div className="number-circle w-10 h-10 text-lg">{pillarNum}</div>
                      ) : unlocked ? (
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      ) : null}
                    </div>
                  </div>

                  {/* Step indicators */}
                  {unlocked && !completed && p?.started_at && (
                    <div className="flex gap-3 mt-3 ml-[72px]">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          p.exercise_completed
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {p.exercise_completed ? "✓" : "○"} Esercizio
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          p.meditation_completed
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {p.meditation_completed ? "✓" : "○"} Meditazione
                      </span>
                    </div>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Detail modal */}
      <AnimatePresence>
        {activePillarData && activePillar !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-y-auto"
          >
            <div className="container mx-auto px-4 py-6 max-w-2xl">
              {/* Modal header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${activePillarData.color} flex items-center justify-center text-xl`}
                  >
                    {activePillarData.icon}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Pilastro {activePillar + 1}</p>
                    <h2 className="font-display text-xl font-bold">{activePillarData.title}</h2>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setActivePillar(null)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Your number */}
              {(() => {
                const num = getPillarNumber(activePillarData);
                return num ? (
                  <div className="glass-cosmic rounded-2xl p-5 mb-6 text-center">
                    <p className="text-sm text-muted-foreground mb-2">Il tuo numero</p>
                    <div className="number-circle number-circle-lg mx-auto mb-3">{num}</div>
                    <p className="text-sm text-muted-foreground italic">
                      {getNumberInterpretation(num)}
                    </p>
                  </div>
                ) : activePillarData.id === "lezioni_karmiche" && karmicLessons.length > 0 ? (
                  <div className="glass-cosmic rounded-2xl p-5 mb-6">
                    <p className="text-sm text-muted-foreground mb-3 text-center">
                      I numeri assenti nel tuo nome
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 mb-4">
                      {karmicLessons.map((n) => (
                        <div key={n} className="number-circle w-10 h-10 text-lg">{n}</div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {karmicLessons.map((n) => (
                        <p key={n} className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">{n} – {karmicLessonMeanings[n]?.title}:</span>{" "}
                          {karmicLessonMeanings[n]?.lesson}
                        </p>
                      ))}
                    </div>
                  </div>
                ) : activePillarData.id === "anno_personale" && numerology ? (
                  <div className="glass-cosmic rounded-2xl p-5 mb-6 text-center">
                    <p className="text-sm text-muted-foreground mb-2">Il tuo Anno Personale {new Date().getFullYear()}</p>
                    <div className="number-circle number-circle-lg mx-auto mb-3">{numerology.personal_year}</div>
                    <p className="text-sm text-muted-foreground italic">
                      {getNumberInterpretation(numerology.personal_year)}
                    </p>
                  </div>
                ) : null;
              })()}

              {/* Tabs */}
              <div className="flex gap-1 bg-muted/50 rounded-xl p-1 mb-6">
                {(
                  [
                    { key: "overview" as const, label: "Scopri", icon: BookOpen },
                    { key: "exercise" as const, label: "Esercizio", icon: Brain },
                    { key: "meditation" as const, label: "Meditazione", icon: Sparkles },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.key
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <AnimatePresence mode="wait">
                {activeTab === "overview" && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="glass-cosmic rounded-2xl p-5">
                      <p className="text-muted-foreground leading-relaxed">
                        {activePillarData.description}
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="glass-cosmic rounded-2xl p-5">
                        <h4 className="font-display font-semibold mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" /> Luce
                        </h4>
                        <ul className="space-y-2">
                          {activePillarData.lightQualities.map((q) => (
                            <li key={q} className="text-sm text-muted-foreground">• {q}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="glass-cosmic rounded-2xl p-5">
                        <h4 className="font-display font-semibold mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-400" /> Ombra
                        </h4>
                        <ul className="space-y-2">
                          {activePillarData.shadowQualities.map((q) => (
                            <li key={q} className="text-sm text-muted-foreground">• {q}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "exercise" && (
                  <motion.div
                    key="exercise"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="glass-cosmic rounded-2xl p-5">
                      <h4 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                        <Brain className="w-5 h-5 text-primary" />
                        {activePillarData.exercise.title}
                      </h4>
                      <ol className="space-y-3">
                        {activePillarData.exercise.instructions.map((step, i) => (
                          <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-semibold">
                              {i + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                      <p className="text-sm text-muted-foreground italic">
                        💡 {activePillarData.exercise.reflection}
                      </p>
                    </div>

                    {activePillarProgress && !activePillarProgress.exercise_completed && (
                      <Button
                        onClick={() => handleCompleteStep(activePillar, "exercise")}
                        className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Segna come completato
                      </Button>
                    )}
                    {activePillarProgress?.exercise_completed && (
                      <div className="text-center text-sm text-emerald-400 flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Esercizio completato
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "meditation" && (
                  <motion.div
                    key="meditation"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="glass-cosmic rounded-2xl p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-display text-lg font-semibold flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-secondary" />
                          {activePillarData.meditation.title}
                        </h4>
                        <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded-full">
                          {activePillarData.meditation.duration}
                        </span>
                      </div>
                      <ol className="space-y-4">
                        {activePillarData.meditation.steps.map((step, i) => (
                          <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary/10 text-secondary text-xs flex items-center justify-center font-semibold">
                              {i + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    {activePillarProgress && !activePillarProgress.meditation_completed && (
                      <Button
                        onClick={() => handleCompleteStep(activePillar, "meditation")}
                        className="w-full bg-gradient-to-r from-secondary to-purple-500 text-secondary-foreground"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Ho completato la meditazione
                      </Button>
                    )}
                    {activePillarProgress?.meditation_completed && (
                      <div className="text-center text-sm text-emerald-400 flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Meditazione completata
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
