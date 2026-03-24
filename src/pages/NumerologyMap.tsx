import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/useSubscription";
import {
  calculateLifePath,
  calculateExpression,
  calculateSoul,
  calculatePersonality,
  calculatePersonalYear,
  calculatePersonalMonth,
  calculateLifeCycles,
  calculateQuintessenza,
} from "@/lib/numerology";
import NumerologyPyramid from "@/components/NumerologyPyramid";
import NumberSection from "@/components/NumberSection";
import PhotoPersonalitySection from "@/components/PhotoPersonalitySection";
import {
  Sparkles,
  ArrowLeft,
  RefreshCw,
  Loader2,
  Lock,
  Crown,
} from "lucide-react";
import { type SectorKey } from "@/lib/personalYearSectors";

interface Profile {
  nome: string;
  cognome: string;
  birth_date: string;
}

interface NumerologyData {
  lifePath: number;
  expression: number;
  soul: number;
  personality: number;
  quintessenza: number;
  personalYear: number;
  personalMonth: number;
  cycles: ReturnType<typeof calculateLifeCycles>;
  rawCalculations: object;
}

const NumerologyMap = () => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [numerologyData, setNumerologyData] = useState<NumerologyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [existingMapId, setExistingMapId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { canAccess } = useSubscription();
  const hasMapAccess = canAccess("/map");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("nome, cognome, birth_date")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (!profileData) {
      navigate("/onboarding");
      return;
    }

    setProfile(profileData);

    const { data: mapData } = await supabase
      .from("numerology_maps")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (mapData) {
      setExistingMapId(mapData.id);
      const expression = mapData.destiny_expression;
      const lifePath = mapData.life_path;
      setNumerologyData({
        lifePath,
        expression,
        soul: mapData.soul,
        personality: mapData.personality,
        quintessenza: calculateQuintessenza(expression, lifePath),
        personalYear: mapData.personal_year,
        personalMonth: mapData.personal_month || calculatePersonalMonth(mapData.personal_year, new Date().getMonth() + 1),
        cycles: mapData.cycles_json as ReturnType<typeof calculateLifeCycles>,
        rawCalculations: mapData.raw_calculations_json as object,
      });
    }

    setLoading(false);
  };

  const generateMap = async () => {
    if (!profile) return;

    setGenerating(true);

    try {
      const [year, month, day] = profile.birth_date.split("-").map(Number);
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const fullName = `${profile.nome} ${profile.cognome}`;

      const lifePath = calculateLifePath(day, month, year);
      const expression = calculateExpression(fullName);
      const soul = calculateSoul(fullName);
      const personality = calculatePersonality(fullName);
      const quintessenza = calculateQuintessenza(expression, lifePath);
      const personalYear = calculatePersonalYear(day, month, currentYear);
      const personalMonth = calculatePersonalMonth(personalYear, currentMonth);
      const cycles = calculateLifeCycles(day, month, year);

      const rawCalculations = {
        birthDate: { day, month, year },
        fullName,
        currentYear,
        currentMonth,
        calculatedAt: new Date().toISOString(),
      };

      const data: NumerologyData = {
        lifePath,
        expression,
        soul,
        personality,
        quintessenza,
        personalYear,
        personalMonth,
        cycles,
        rawCalculations,
      };

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: savedMap, error } = await supabase
        .from("numerology_maps")
        .insert({
          user_id: session.user.id,
          life_path: lifePath,
          destiny_expression: expression,
          soul,
          personality,
          personal_year: personalYear,
          personal_year_reference: currentYear,
          personal_month: personalMonth,
          cycles_json: cycles,
          raw_calculations_json: rawCalculations,
        })
        .select()
        .single();

      if (error) throw error;

      setNumerologyData(data);
      setExistingMapId(savedMap.id);

      toast({
        title: t("map.generated"),
        description: t("map.generatedDesc"),
      });
    } catch (error) {
      console.error("Error generating map:", error);
      toast({
        title: t("map.error"),
        description: t("map.errorDesc"),
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const numberLabels = [
    { label: t("map.destiny"), key: "lifePath" as const },
    { label: t("map.self"), key: "expression" as const },
    { label: t("map.soul"), key: "soul" as const },
    { label: t("map.personality"), key: "personality" as const },
    { label: t("map.quintessence"), key: "quintessenza" as const },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground">{t("map.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 numerology-pattern opacity-20 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-b from-secondary/5 via-transparent to-primary/5 pointer-events-none" />

      <header className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-semibold">{t("map.headerTitle")}</span>
            </div>
          </div>

          {numerologyData && profile && hasMapAccess && (
            <Button
              variant="cosmic-outline"
              size="sm"
              onClick={generateMap}
              disabled={generating}
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("map.regenerating")}
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t("map.regenerate")}
                </>
              )}
            </Button>
          )}
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {!numerologyData ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold mb-4">
              {t("map.generateTitle")}
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              {t("map.generateDesc")}
            </p>
            <Button
              variant="cosmic"
              size="xl"
              onClick={generateMap}
              disabled={generating}
            >
              {generating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {t("map.generating")}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  {t("map.generateButton")}
                </>
              )}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Premium header */}
            <div className="glass-cosmic rounded-2xl p-8 text-center">
              <h1 className="font-display text-2xl md:text-3xl font-bold mb-4">
                {t("map.premiumTitle")}
              </h1>
              <p className="text-muted-foreground text-lg">
                {t("map.premiumDesc", { name: profile?.nome })}
              </p>
            </div>

            {/* Numbers grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {numberLabels.map((item) => (
                <div key={item.key} className="glass-cosmic rounded-xl p-6 text-center">
                  <div className="number-circle number-circle-lg mx-auto mb-3">
                    {numerologyData[item.key]}
                  </div>
                  <p className="font-display font-semibold">{item.label}</p>
                </div>
              ))}
            </div>

            {/* Pyramid Diagram */}
            <NumerologyPyramid
              destino={numerologyData.lifePath}
              io={numerologyData.expression}
              anima={numerologyData.soul}
              persona={numerologyData.personality}
              quintessenza={numerologyData.quintessenza}
            />

            {/* Photo personality analysis - before numbers */}
            <PhotoPersonalitySection userName={profile?.nome || ""} />

            {/* Destino section - always visible */}
            <NumberSection num={numerologyData.lifePath} type="destino" title={`${t("map.destiny")} ${numerologyData.lifePath}`} />

            {/* Remaining sections - blurred for free users */}
            <div className="relative">
              {!hasMapAccess && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
                  <div className="absolute inset-0 bg-background/60 backdrop-blur-md rounded-2xl" />
                  <div className="relative z-30 text-center p-8 max-w-md">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                      <Lock className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-display text-2xl font-bold mb-3">{t("map.unlockTitle")}</h3>
                    <p className="text-muted-foreground mb-6">
                      {t("map.unlockDesc")}
                    </p>
                    <Button variant="cosmic" size="lg" asChild>
                      <Link to="/pricing">
                        <Crown className="w-5 h-5 mr-2" />
                        {t("map.choosePlan")}
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
              <div className={`space-y-8 ${!hasMapAccess ? "pointer-events-none select-none" : ""}`}>

            <NumberSection num={numerologyData.expression} type="io" title={`${t("map.self")} ${numerologyData.expression}`} />
            <NumberSection num={numerologyData.soul} type="anima" title={`${t("map.soul")} ${numerologyData.soul}`} />
            <NumberSection num={numerologyData.personality} type="personalita" title={`${t("map.personality")} ${numerologyData.personality}`} />
            <NumberSection num={numerologyData.quintessenza} type="quintessenza" title={`${t("map.quintessence")} ${numerologyData.quintessenza}`} />

            {/* Life Cycles section */}
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-bold mb-2">{t("map.lifeCycles")}</h2>
              <p className="text-muted-foreground text-sm mb-6">
                {t("map.lifeCyclesDesc")}
              </p>
            </div>

            {[
              {
                cycle: numerologyData.cycles.firstCycle,
                label: t("map.firstCycle"),
                period: t("map.fromBirth", {
                  start: numerologyData.cycles.firstCycle.startYear,
                  end1: numerologyData.cycles.firstCycle.endYear - 2,
                  end2: numerologyData.cycles.firstCycle.endYear,
                }),
                calcDetail: t("map.derivedMonth"),
              },
              {
                cycle: numerologyData.cycles.secondCycle,
                label: t("map.secondCycle"),
                period: t("map.fromTransition", {
                  start: numerologyData.cycles.secondCycle.startYear,
                  start2: numerologyData.cycles.secondCycle.startYear + 2,
                  end: numerologyData.cycles.secondCycle.endYear,
                }),
                calcDetail: t("map.derivedDay"),
              },
              {
                cycle: numerologyData.cycles.thirdCycle,
                label: t("map.thirdCycle"),
                period: t("map.fromTransitionOnward", {
                  start: numerologyData.cycles.thirdCycle.startYear,
                }),
                calcDetail: t("map.derivedYear"),
              },
            ].map((item) => (
              <NumberSection
                key={item.label}
                num={item.cycle.number}
                type="ciclo"
                title={`${item.label} — ${t("map.number")} ${item.cycle.number}`}
                subtitle={`${t("map.period")}: ${item.period} · ${item.calcDetail}`}
              />
            ))}

              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default NumerologyMap;
