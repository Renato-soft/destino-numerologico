import { motion } from 'framer-motion';
import { Sparkles, Star, Zap, Moon, Sun, TrendingUp, Heart } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useNumerologyTexts, NumberMeaningT } from '@/i18n/numerologyTranslations';
import { useAuth } from '@/contexts/AuthContext';
import {
  displayNumber,
  isMasterNumber,
  NumerologyProfile,
} from '@/lib/numerology';

// ─── Number card ──────────────────────────────────────────────────────────────

function NumberCard({
  label,
  value,
  icon: Icon,
  size = 'normal',
}: {
  label: string;
  value: number;
  icon?: React.ElementType;
  size?: 'normal' | 'large';
}) {
  const isMaster = isMasterNumber(value);
  return (
    <div className={`bg-card border ${isMaster ? 'border-accent/40' : 'border-border'} rounded-2xl p-4 relative overflow-hidden`}>
      {isMaster && (
        <div className="absolute top-2 right-2 text-xs px-1.5 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/30">
          ★
        </div>
      )}
      <div className="flex items-start gap-3">
        {Icon && (
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isMaster ? 'bg-accent/10' : 'bg-primary/10'}`}>
            <Icon className={`w-4 h-4 ${isMaster ? 'text-accent' : 'text-primary'}`} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
          <div className={`font-heading ${size === 'large' ? 'text-4xl' : 'text-3xl'} ${isMaster ? 'text-accent' : 'text-gradient-gold'}`}>
            {displayNumber(value)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Meaning block ────────────────────────────────────────────────────────────

function MeaningBlock({
  label,
  value,
  meaning,
}: {
  label: string;
  value: number;
  meaning: NumberMeaningT | undefined;
}) {
  const { t } = useLanguage();
  const a = t.app;
  const isMaster = isMasterNumber(value);

  if (!meaning) return null;

  return (
    <div className={`bg-card border ${isMaster ? 'border-accent/30' : 'border-border'} rounded-2xl p-5`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className={`font-heading text-2xl ${isMaster ? 'text-accent' : 'text-primary'}`}>{displayNumber(value)}</span>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {meaning.keywords.map(kw => (
          <span key={kw} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
            {kw}
          </span>
        ))}
      </div>
      <div className="space-y-2 text-xs text-muted-foreground">
        <p className="text-sm text-foreground/80 leading-relaxed">{meaning.description}</p>
        <p className="italic text-muted-foreground/70 leading-relaxed">{meaning.example}</p>
        <div className="border-t border-border/50 pt-2 space-y-1.5">
          <p><span className="text-foreground/70 font-medium">{a.dashTalents}:</span> {meaning.talents}</p>
          <p><span className="text-foreground/70 font-medium">{a.dashEvolution}:</span> {meaning.evolution}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Daily advice card ────────────────────────────────────────────────────────

function DailyAdviceCard({ num }: { num: NumerologyProfile }) {
  const { t } = useLanguage();
  const { monthAdvice, personalYearMeanings } = useNumerologyTexts();
  const a = t.app;

  const pdAdvice = monthAdvice[num.personalDay]   ?? monthAdvice[1];
  const pmAdvice = monthAdvice[num.personalMonth] ?? monthAdvice[1];
  const pyMeaning = personalYearMeanings[num.personalYear] ?? '';

  return (
    <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-card border border-primary/20 rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="font-heading text-lg">{a.dashAdviceToday}</h3>
      </div>

      {/* Personal numbers */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { val: num.personalDay,   label: a.dashPersonalDay },
          { val: num.personalMonth, label: a.dashPersonalMonth },
          { val: num.personalYear,  label: a.dashPersonalYear },
        ].map(({ val, label }) => (
          <div key={label} className="text-center">
            <div className={`w-12 h-12 rounded-full border mx-auto flex items-center justify-center font-heading text-xl mb-1 ${isMasterNumber(val) ? 'border-accent/50 bg-accent/10 text-accent' : 'border-primary/40 bg-primary/10 text-primary'}`}>
              {displayNumber(val)}
            </div>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Monthly theme */}
      <div className="space-y-1">
        <p className="text-foreground/80 font-medium text-sm">{pmAdvice.theme}</p>
        <p className="text-muted-foreground text-xs leading-relaxed">{pmAdvice.favor}</p>
        <p className="text-muted-foreground/60 text-xs italic">{pyMeaning}</p>
      </div>

      {/* Love & Relationships advice */}
      <div className="bg-accent/5 border border-accent/20 rounded-xl p-3 space-y-1">
        <div className="flex items-center gap-1.5 mb-1">
          <Heart className="w-3.5 h-3.5 text-accent" />
          <p className="text-xs font-medium text-accent">{a.dashLoveAdvice}</p>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{pdAdvice.love}</p>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { t } = useLanguage();
  const { numberMeanings } = useNumerologyTexts();
  const { user } = useAuth();
  const a = t.app;

  if (!user || !user.numerology || !user.birthDate) return null;
  const num = user.numerology;

  const fadeIn = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.5 },
  });

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div {...fadeIn(0)}>
        <h1 className="font-heading text-3xl md:text-4xl">
          {a.dashWelcome}{' '}
          <span className="text-gradient-gold">{user.firstName}</span>
        </h1>
        <p className="text-muted-foreground mt-1">{a.dashSubtitle}</p>
      </motion.div>

      {/* Daily advice */}
      <motion.div {...fadeIn(0.1)}>
        <DailyAdviceCard num={num} />
      </motion.div>

      {/* Numerological map */}
      <motion.div {...fadeIn(0.2)}>
        <h2 className="font-heading text-2xl mb-4">{a.dashMyMap}</h2>

        {/* Main numbers grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          <NumberCard label={a.dashDestiny}      value={num.destiny}      icon={Star}        size="large" />
          <NumberCard label={a.dashSoul}         value={num.soul}         icon={Moon}        size="large" />
          <NumberCard label={a.dashExpression}   value={num.expression}   icon={Sun}         size="large" />
          <NumberCard label={a.dashPersona}      value={num.persona}      icon={Zap}         />
          <NumberCard label={a.dashQuintessence} value={num.quintessence} icon={TrendingUp}  />
        </div>

        {/* Meanings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          <MeaningBlock label={a.dashDestiny}    value={num.destiny}    meaning={numberMeanings[num.destiny]} />
          <MeaningBlock label={a.dashSoul}       value={num.soul}       meaning={numberMeanings[num.soul]} />
          <MeaningBlock label={a.dashExpression} value={num.expression} meaning={numberMeanings[num.expression]} />
          <MeaningBlock label={a.dashPersona}    value={num.persona}    meaning={numberMeanings[num.persona]} />
        </div>

        {/* Shadow numbers */}
        <div className="bg-card border border-border rounded-2xl p-5 mb-4">
          <h3 className="font-heading text-lg mb-3">{a.dashShadow}</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: a.dashShadowMain,     val: num.shadow.main },
              { label: a.dashShadowYouth,    val: num.shadow.youth },
              { label: a.dashShadowMaturity, val: num.shadow.maturity },
            ].map(({ label, val }) => (
              <div key={label} className="text-center">
                <div className="w-12 h-12 rounded-full bg-muted border border-border mx-auto flex items-center justify-center font-heading text-xl text-muted-foreground mb-1">
                  {displayNumber(val)}
                </div>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Life cycles */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-heading text-lg mb-3">{a.dashLifeCycles}</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: a.dashCycle1, val: num.lifeCycles.first },
              { label: a.dashCycle2, val: num.lifeCycles.second },
              { label: a.dashCycle3, val: num.lifeCycles.third },
            ].map(({ label, val }) => (
              <div key={label} className="text-center">
                <div className={`w-12 h-12 rounded-full border mx-auto flex items-center justify-center font-heading text-xl mb-1 ${isMasterNumber(val) ? 'border-accent/40 bg-accent/10 text-accent' : 'border-primary/30 bg-primary/5 text-primary'}`}>
                  {displayNumber(val)}
                </div>
                <p className="text-xs text-muted-foreground">{label}</p>
                {numberMeanings[val] && (
                  <p className="text-xs text-muted-foreground/60 mt-0.5">{numberMeanings[val].keywords[0]}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
