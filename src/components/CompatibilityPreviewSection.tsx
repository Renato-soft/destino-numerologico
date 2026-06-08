import { useLanguage } from '@/i18n/LanguageContext';
import { motion } from 'framer-motion';

const radarData = [
  { label: 'love', value: 92 },
  { label: 'communication', value: 78 },
  { label: 'work', value: 65 },
  { label: 'challenges', value: 45 },
  { label: 'growth', value: 88 },
];

const numberComparisons = [
  { key: 'destiny', numA: 9, numB: 1, colorA: 'bg-primary', colorB: 'bg-purple-500', percent: 90 },
  { key: 'soul', numA: 5, numB: 3, colorA: 'bg-primary', colorB: 'bg-purple-500', percent: 85 },
  { key: 'self', numA: 6, numB: 11, colorA: 'bg-primary', colorB: 'bg-purple-500', percent: 82 },
  { key: 'personality', numA: 1, numB: 8, colorA: 'bg-primary', colorB: 'bg-purple-500', percent: 70 },
];

// SVG Radar Chart component
const RadarChart = ({ data, labels }: { data: typeof radarData; labels: string[] }) => {
  const cx = 150, cy = 150, r = 110;
  const n = data.length;
  const angleStep = (2 * Math.PI) / n;

  const getPoint = (i: number, value: number) => {
    const angle = -Math.PI / 2 + i * angleStep;
    const dist = (value / 100) * r;
    return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) };
  };

  const gridLevels = [25, 50, 75, 100];

  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-[320px] mx-auto">
      {/* Grid */}
      {gridLevels.map((level) => {
        const points = Array.from({ length: n }, (_, i) => {
          const p = getPoint(i, level);
          return `${p.x},${p.y}`;
        }).join(' ');
        return (
          <polygon
            key={level}
            points={points}
            fill="none"
            stroke="hsl(var(--muted-foreground) / 0.15)"
            strokeWidth="1"
          />
        );
      })}

      {/* Axis lines */}
      {Array.from({ length: n }, (_, i) => {
        const p = getPoint(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="hsl(var(--muted-foreground) / 0.15)" strokeWidth="1" />;
      })}

      {/* Data polygon */}
      <polygon
        points={data.map((d, i) => {
          const p = getPoint(i, d.value);
          return `${p.x},${p.y}`;
        }).join(' ')}
        fill="hsl(var(--primary) / 0.3)"
        stroke="hsl(var(--primary))"
        strokeWidth="2.5"
      />

      {/* Data points */}
      {data.map((d, i) => {
        const p = getPoint(i, d.value);
        return <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="hsl(var(--primary))" />;
      })}

      {/* Labels */}
      {labels.map((label, i) => {
        const p = getPoint(i, 125);
        return (
          <text
            key={i}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-muted-foreground text-[11px] font-body"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
};

// Circular progress
const CompatibilityCircle = ({ value }: { value: number }) => {
  const r = 56;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
        <circle cx="64" cy="64" r={r} fill="none" stroke="hsl(var(--muted) / 0.3)" strokeWidth="8" />
        <motion.circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          viewport={{ once: true }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-heading text-3xl text-primary">
        {value}%
      </span>
    </div>
  );
};

const CompatibilityPreviewSection = () => {
  const { t } = useLanguage();
  const cp = t.compatibilityPreview;

  const radarLabels = [cp.radarLove, cp.radarCommunication, cp.radarWork, cp.radarChallenges, cp.radarGrowth];

  return (
    <section id="compatibility-preview" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-4">{cp.title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-body">{cp.subtitle}</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Column 1: Radar + Overall Score */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            {/* Radar Chart */}
            <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6">
              <h3 className="font-heading text-lg text-foreground text-center mb-4">{cp.radarTitle}</h3>
              <RadarChart data={radarData} labels={radarLabels} />
            </div>

            {/* Overall Compatibility */}
            <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 text-center">
              <h3 className="font-heading text-lg text-foreground mb-4">{cp.overallTitle}</h3>
              <CompatibilityCircle value={86} />
            </div>
          </motion.div>

          {/* Column 2: Number Comparisons */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6">
              <h3 className="font-heading text-lg text-foreground mb-6">{cp.comparisonTitle}</h3>
              <div className="space-y-6">
                {numberComparisons.map((comp) => (
                  <div key={comp.key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-body font-semibold text-foreground text-sm">
                        {cp[`comp_${comp.key}` as keyof typeof cp]}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`w-8 h-8 rounded-full ${comp.colorA} flex items-center justify-center text-xs font-bold text-primary-foreground`}>
                          {comp.numA}
                        </span>
                        <span className="text-muted-foreground text-xs">vs</span>
                        <span className={`w-8 h-8 rounded-full ${comp.colorB} flex items-center justify-center text-xs font-bold text-white`}>
                          {comp.numB}
                        </span>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-xs mb-2 font-body">
                      {cp[`comp_${comp.key}_desc` as keyof typeof cp]}
                    </p>
                    <div className="h-1.5 rounded-full bg-muted/30 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${comp.percent}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Column 3: Insights */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {/* Challenges */}
            <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-5">
              <h4 className="font-heading text-sm text-foreground flex items-center gap-2 mb-2">
                <span className="text-amber-400">⚠</span> {cp.challengesTitle}
              </h4>
              <p className="text-muted-foreground text-xs font-body leading-relaxed">{cp.challengesDesc}</p>
            </div>

            {/* Growth */}
            <div className="rounded-2xl border-l-2 border-primary border border-t-border border-r-border border-b-border bg-card/50 backdrop-blur-sm p-5">
              <h4 className="font-heading text-sm text-foreground flex items-center gap-2 mb-2">
                <span className="text-primary">💡</span> {cp.growthTitle}
              </h4>
              <p className="text-muted-foreground text-xs font-body leading-relaxed">{cp.growthDesc}</p>
            </div>

            {/* Dynamics */}
            <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-5">
              <h4 className="font-heading text-sm text-foreground flex items-center gap-2 mb-2">
                <span className="text-primary">🔥</span> {cp.dynamicsTitle}
              </h4>
              <p className="text-muted-foreground text-xs font-body leading-relaxed">{cp.dynamicsDesc}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CompatibilityPreviewSection;
