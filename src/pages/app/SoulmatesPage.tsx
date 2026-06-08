import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, MapPin, Star, Moon } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { getMockUsers, toUserProfile } from '@/lib/mockUsers';
import { calculateCompatibility, CompatibilityResult, displayNumber, isMasterNumber } from '@/lib/numerology';

type Filter = 'all' | 'soulmate' | 'high';

// ─── Compatibility badge ──────────────────────────────────────────────────────

function CompatBadge({ label, score }: { label: CompatibilityResult['label']; score: number }) {
  const { t } = useLanguage();
  const a = t.app;

  const configs: Record<CompatibilityResult['label'], { text: string; cls: string }> = {
    soulmate: { text: a.smSoulmate,  cls: 'bg-primary/20 text-primary border-primary/40' },
    high:     { text: a.smHigh,      cls: 'bg-accent/20 text-accent border-accent/40' },
    good:     { text: a.smGood,      cls: 'bg-green-500/20 text-green-400 border-green-500/30' },
    moderate: { text: a.smModerate,  cls: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    low:      { text: a.smLow,       cls: 'bg-muted text-muted-foreground border-border' },
  };
  const cfg = configs[label];

  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${cfg.cls}`}>
      {label === 'soulmate' && <Star className="w-2.5 h-2.5" />}
      {cfg.text} · {score}%
    </span>
  );
}

// ─── Score bar ────────────────────────────────────────────────────────────────

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-0.5">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-foreground/70">{value}%</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${value >= 80 ? 'bg-primary' : value >= 60 ? 'bg-accent' : 'bg-muted-foreground/40'}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

// ─── Match card ───────────────────────────────────────────────────────────────

function MatchCard({ match, compatibility, rank }: {
  match: ReturnType<typeof toUserProfile>;
  compatibility: CompatibilityResult;
  rank: number;
}) {
  const { t } = useLanguage();
  const a = t.app;
  const [expanded, setExpanded] = useState(false);
  const isSoulmate = compatibility.label === 'soulmate';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.06 }}
      className={`bg-card border rounded-2xl overflow-hidden transition ${isSoulmate ? 'border-primary/40 shadow-lg shadow-primary/5' : 'border-border'}`}
    >
      {/* Header */}
      <div className="flex items-start gap-4 p-4">
        <div className="relative shrink-0">
          <img
            src={match.avatarUrl}
            alt={match.firstName}
            className="w-16 h-16 rounded-full object-cover bg-muted"
          />
          {isSoulmate && (
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-primary-foreground" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <h3 className="font-heading text-lg leading-tight">{match.firstName} {match.lastName[0]}.</h3>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                <MapPin className="w-3 h-3" />
                {match.city} · {match.age}
              </div>
            </div>
            <CompatBadge label={compatibility.label} score={compatibility.score} />
          </div>

          {match.bio && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{match.bio}</p>
          )}

          {/* Key numbers */}
          <div className="flex gap-2 mt-2">
            {[
              { label: a.smDestiny,    val: match.numerology.destiny },
              { label: a.smSoul,      val: match.numerology.soul },
              { label: a.smExpression, val: match.numerology.expression },
            ].map(({ label, val }) => (
              <div key={label} className="text-center">
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-heading ${isMasterNumber(val) ? 'border-accent/40 text-accent bg-accent/10' : 'border-primary/30 text-primary bg-primary/5'}`}>
                  {displayNumber(val)}
                </div>
                <p className="text-xs text-muted-foreground/60 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expandable breakdown */}
      <div className="border-t border-border/50">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-muted-foreground hover:text-foreground transition"
        >
          <span>{a.smViewDetails}</span>
          <Heart className={`w-3.5 h-3.5 transition ${expanded ? 'text-primary fill-primary' : ''}`} />
        </button>

        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="px-4 pb-4 space-y-2"
          >
            <ScoreBar label={a.smDestiny}    value={compatibility.breakdown.destiny} />
            <ScoreBar label={a.smSoul}       value={compatibility.breakdown.soul} />
            <ScoreBar label={a.smExpression} value={compatibility.breakdown.expression} />
            <ScoreBar label="Persona"        value={compatibility.breakdown.persona} />
            <ScoreBar label="Quintessence"   value={compatibility.breakdown.quintessence} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ─── No match state ───────────────────────────────────────────────────────────

function NoMatch() {
  const { t } = useLanguage();
  const a = t.app;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-16"
    >
      <div className="relative inline-block mb-6">
        <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
          <Moon className="w-10 h-10 text-primary/60" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
          <Star className="w-4 h-4 text-accent" />
        </div>
      </div>
      <h2 className="font-heading text-2xl mb-2">{a.smNoMatch}</h2>
      <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">{a.smNoMatchDesc}</p>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function SoulmatesPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const a = t.app;
  const [filter, setFilter] = useState<Filter>('all');

  const matches = useMemo(() => {
    if (!user?.numerology || !user.birthDate) return [];

    const mockUsers = getMockUsers();

    // Filter by lookingFor preference
    const filtered = mockUsers.filter(mu => {
      if (user.lookingFor === 'M') return mu.gender === 'M';
      if (user.lookingFor === 'F') return mu.gender === 'F';
      return true;
    });

    // Calculate compatibility for each
    const scored = filtered.map(mu => ({
      profile: toUserProfile(mu),
      compatibility: calculateCompatibility(user.numerology, mu.numerology),
    }));

    // Sort by score descending, take top 10
    return scored
      .sort((a, b) => b.compatibility.score - a.compatibility.score)
      .slice(0, 10);
  }, [user]);

  const filtered = useMemo(() => {
    if (filter === 'soulmate') return matches.filter(m => m.compatibility.label === 'soulmate');
    if (filter === 'high')     return matches.filter(m => ['soulmate', 'high'].includes(m.compatibility.label));
    return matches;
  }, [matches, filter]);

  const filters: { key: Filter; label: string }[] = [
    { key: 'all',      label: a.smFilterAll },
    { key: 'soulmate', label: a.smFilterSoulmate },
    { key: 'high',     label: a.smFilterHigh },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-3xl md:text-4xl">{a.smTitle}</h1>
        <p className="text-muted-foreground mt-1">{a.smSubtitle}</p>
      </motion.div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 rounded-full text-sm border transition ${
              filter === f.key
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List or no-match */}
      {filtered.length === 0 ? (
        <NoMatch />
      ) : (
        <div className="space-y-3">
          {filtered.map(({ profile, compatibility }, i) => (
            <MatchCard
              key={profile.id}
              match={profile}
              compatibility={compatibility}
              rank={i}
            />
          ))}
        </div>
      )}
    </div>
  );
}
