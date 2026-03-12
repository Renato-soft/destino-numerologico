import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown, ChevronUp, Calendar, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { calculatePersonalYear } from "@/lib/numerology";
import { personalYearSectors, sectorMeta, SectorKey } from "@/lib/personalYearSectors";
import { useSubscription } from "@/hooks/useSubscription";

const sectorKeys: SectorKey[] = ['lavoro', 'amore', 'denaro', 'benessere', 'crescita'];

const PersonalYear = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [birthDate, setBirthDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSector, setExpandedSector] = useState<SectorKey | null>(null);
  const { canAccess } = useSubscription();
  const hasFullAccess = canAccess("/map");

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }

      const { data } = await supabase
        .from("profiles")
        .select("birth_date")
        .eq("user_id", session.user.id)
        .single();

      if (data) setBirthDate(data.birth_date);
      setLoading(false);
    };
    load();
  }, [navigate]);

  const personalYear = useMemo(() => {
    if (!birthDate) return null;
    const bd = new Date(birthDate);
    return calculatePersonalYear(bd.getDate(), bd.getMonth() + 1, new Date().getFullYear());
  }, [birthDate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const sectors = personalYear ? personalYearSectors[personalYear] : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 numerology-pattern opacity-20 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-b from-secondary/5 via-transparent to-primary/5 pointer-events-none" />

      <header className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display text-xl font-semibold">
            {t("dashboard.personalYear", { year: new Date().getFullYear() })}
          </h1>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8 max-w-3xl">
        {personalYear && sectors ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-10"
            >
              <div className="number-circle number-circle-lg mx-auto mb-4 w-20 h-20 text-3xl">{personalYear}</div>
              <h2 className="font-display text-3xl font-bold mb-2">
                Anno Personale {personalYear}
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                {t("dashboard.personalYearDesc")}
              </p>
            </motion.div>

            <div className="space-y-4 relative">
              {sectorKeys.map((key, index) => {
                const meta = sectorMeta[key];
                const sector = sectors[key];
                const isExpanded = expandedSector === key;
                const isLocked = !hasFullAccess && index > 0;

                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className={`glass-cosmic rounded-2xl overflow-hidden relative ${isLocked ? "select-none" : ""}`}
                  >
                    {isLocked && (
                      <div className="absolute inset-0 z-10 backdrop-blur-md bg-background/40 rounded-2xl" />
                    )}
                    <button
                      onClick={() => !isLocked && setExpandedSector(isExpanded ? null : key)}
                      className={`w-full flex items-center justify-between p-5 text-left transition-colors ${isLocked ? "cursor-default" : "hover:bg-muted/10"}`}
                      disabled={isLocked}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{meta.icon}</span>
                        <div>
                          <span className="font-display font-semibold text-base">{meta.title}</span>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{sector.summary}</p>
                        </div>
                      </div>
                      {isLocked ? (
                        <Lock className="w-5 h-5 text-muted-foreground shrink-0 ml-4" />
                      ) : isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0 ml-4" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0 ml-4" />
                      )}
                    </button>
                    {isExpanded && !isLocked && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        className="px-5 pb-5 border-t border-border/30"
                      >
                        <p className="text-sm leading-relaxed pt-4">{sector.detail}</p>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}

              {!hasFullAccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-center py-6"
                >
                  <Lock className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-display text-lg font-bold mb-2">Sblocca tutti i settori</h3>
                  <p className="text-sm text-muted-foreground mb-4">Scegli un piano per accedere all'analisi completa del tuo Anno Personale.</p>
                  <Button variant="cosmic" asChild>
                    <Link to="/pricing">Scegli il tuo Piano</Link>
                  </Button>
                </motion.div>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-10"
            >
              <Button variant="cosmic-outline" asChild>
                <Link to="/dashboard">← Torna alla Dashboard</Link>
              </Button>
            </motion.div>
          </>
        ) : (
          <div className="text-center py-20">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Completa il tuo profilo per scoprire il tuo Anno Personale.</p>
            <Button variant="cosmic" className="mt-4" asChild>
              <Link to="/onboarding">Completa il Profilo</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default PersonalYear;
