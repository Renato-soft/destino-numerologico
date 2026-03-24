import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { reduceNumber } from "@/lib/numerology";
import { SectorKey } from "@/lib/personalYearSectors";
import { Heart, Briefcase, DollarSign, Leaf, Star, TrendingUp, AlertTriangle, Sparkles } from "lucide-react";
import {
  getSectorMeta,
  getDayVibrationInsights,
  getMotivationalMessages,
  getDefaultMotivational,
} from "@/lib/dailyAnalysisI18n";

interface DailyAnalysisProps {
  personalYear: number;
  lifePath: number;
}

const sectorIcons: Record<SectorKey, React.ElementType> = {
  amore: Heart,
  lavoro: Briefcase,
  denaro: DollarSign,
  benessere: Leaf,
  crescita: Star,
};

function getUniversalDayVibration(): number {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const sum = day + month + reduceNumber(year);
  return reduceNumber(sum);
}

function getPersonalDayVibration(personalYear: number): number {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const personalMonth = reduceNumber(month + personalYear);
  return reduceNumber(day + personalMonth);
}

const DailyAnalysis = ({ personalYear, lifePath }: DailyAnalysisProps) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.substring(0, 2) || "it";

  const dayVibe = getPersonalDayVibration(personalYear);
  const universalVibe = getUniversalDayVibration();
  const sectors: SectorKey[] = ['lavoro', 'amore', 'denaro', 'benessere', 'crescita'];

  const sectorMeta = getSectorMeta(lang);
  const dayVibrationInsights = getDayVibrationInsights(lang);
  const motivationalMessages = getMotivationalMessages(lang);

  // Get insights for today's vibration (fallback to reduced if master number)
  const vibeKey = dayVibe > 9 ? reduceNumber(dayVibe % 10 + Math.floor(dayVibe / 10)) : dayVibe;
  const insights = dayVibrationInsights[vibeKey] || dayVibrationInsights[1];

  // Get motivational message
  const dv = dayVibe > 9 ? reduceNumber(dayVibe) : dayVibe;
  const py = personalYear > 9 ? reduceNumber(personalYear) : personalYear;
  const motivation = motivationalMessages[`${dv}-${py}`] || getDefaultMotivational(lang);

  const dateLocale = lang === "it" ? "it-IT" : "en-US";

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="mb-12"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="number-circle w-12 h-12 text-xl">{dayVibe}</div>
        <div>
          <h2 className="font-display text-xl font-semibold">
            {t("dailyAnalysis.title")} — {new Date().toLocaleDateString(dateLocale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("dailyAnalysis.personalVibration")}: <span className="text-primary font-semibold">{dayVibe}</span> · {t("dailyAnalysis.personalYearLabel")}: <span className="text-primary font-semibold">{personalYear}</span>
          </p>
        </div>
      </div>

      {/* Motivational message */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.18 }}
        className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-primary/15 via-accent/10 to-primary/5 border border-primary/20"
      >
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <p className="text-foreground font-medium italic leading-relaxed">
            "{motivation}"
          </p>
        </div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sectors.map((sector, index) => {
          const Icon = sectorIcons[sector];
          const meta = sectorMeta[sector];
          const insight = insights[sector];

          return (
            <motion.div
              key={sector}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="glass-cosmic rounded-2xl p-5 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold">{meta.title}</h3>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-foreground">{insight.forza}</p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">{insight.evita}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};

export default DailyAnalysis;
