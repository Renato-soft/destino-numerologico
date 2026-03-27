import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const sectors = [
  { icon: "❤️", label: "Amore", desc: "Giornata ideale per il dialogo" },
  { icon: "💼", label: "Lavoro", desc: "Concentrati sui dettagli" },
  { icon: "💰", label: "Denaro", desc: "Evita spese impulsive" },
  { icon: "🌿", label: "Benessere", desc: "Dedica tempo alla natura" },
  { icon: "⭐", label: "Crescita", desc: "Apri la mente a nuove idee" },
];

export const DailyAnalysisScene = ({ displayFont, bodyFont }: { displayFont: string; bodyFont: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const titleY = interpolate(frame, [0, 20], [40, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ padding: 60, justifyContent: "center" }}>
      {/* Section label */}
      <div
        style={{
          fontFamily: bodyFont,
          fontSize: 22,
          fontWeight: 600,
          color: "#a78bfa",
          textTransform: "uppercase",
          letterSpacing: 4,
          opacity: titleOp,
          marginBottom: 16,
          textAlign: "center",
        }}
      >
        Analisi del Giorno
      </div>

      {/* Title */}
      <div
        style={{
          fontFamily: displayFont,
          fontSize: 52,
          fontWeight: 900,
          color: "white",
          textAlign: "center",
          opacity: titleOp,
          transform: `translateY(${titleY}px)`,
          marginBottom: 50,
          lineHeight: 1.2,
        }}
      >
        5 aree della tua vita,
        <br />
        <span style={{ color: "#c084fc" }}>analizzate ogni giorno</span>
      </div>

      {/* Sector cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }}>
        {sectors.map((s, i) => {
          const delay = 20 + i * 10;
          const cardScale = spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 180 } });
          const cardOp = interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

          return (
            <div
              key={s.label}
              style={{
                width: 860,
                padding: "28px 36px",
                borderRadius: 24,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(167,139,250,0.2)",
                backdropFilter: "none",
                display: "flex",
                alignItems: "center",
                gap: 24,
                opacity: cardOp,
                transform: `scale(${cardScale})`,
              }}
            >
              <div style={{ fontSize: 44 }}>{s.icon}</div>
              <div>
                <div style={{ fontFamily: bodyFont, fontSize: 28, fontWeight: 700, color: "white" }}>
                  {s.label}
                </div>
                <div style={{ fontFamily: bodyFont, fontSize: 22, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>
                  {s.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
