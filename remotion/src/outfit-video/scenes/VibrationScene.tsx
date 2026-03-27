import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const VibrationScene = ({ d, b }: { d: string; b: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Number counting up animation
  const numberProgress = interpolate(frame, [20, 55], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const displayNum = Math.round(interpolate(numberProgress, [0, 1], [1, 6]));

  const numScale = spring({ frame: frame - 50, fps, config: { damping: 10 } });
  const numGlow = interpolate(frame, [50, 70], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Sectors appearing
  const sectors = [
    { icon: "💜", label: "Colori viola e lavanda", delay: 55 },
    { icon: "🌙", label: "Stile intuitivo e raffinato", delay: 62 },
    { icon: "🔮", label: "Accessori spirituali", delay: 69 },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 60 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontFamily: b, fontSize: 22, fontWeight: 600, color: "#a78bfa",
          textTransform: "uppercase", letterSpacing: 4, opacity: titleOp, marginBottom: 16,
        }}>
          La tua vibrazione di oggi
        </div>

        <div style={{
          fontFamily: d, fontSize: 38, fontWeight: 700, color: "white",
          opacity: titleOp, marginBottom: 40,
        }}>
          determina il tuo stile
        </div>

        {/* Big number */}
        <div style={{ position: "relative", display: "inline-flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{
            position: "absolute", width: 250, height: 250, borderRadius: "50%",
            background: `radial-gradient(circle, rgba(167,139,250,${numGlow * 0.4}), transparent 70%)`,
          }} />
          <div style={{
            fontFamily: d, fontSize: 180, fontWeight: 900,
            background: "linear-gradient(135deg, #f0abfc, #a78bfa)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            transform: `scale(${0.5 + numScale * 0.5})`,
          }}>
            {displayNum}
          </div>
        </div>

        <div style={{
          fontFamily: b, fontSize: 28, color: "rgba(255,255,255,0.5)",
          opacity: numGlow, marginTop: 10, marginBottom: 50,
        }}>
          Vibrazione Personale del Giorno
        </div>

        {/* Style descriptors */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18, alignItems: "center" }}>
          {sectors.map((s, i) => {
            const op = interpolate(frame, [s.delay, s.delay + 12], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
            const x = interpolate(
              spring({ frame: frame - s.delay, fps, config: { damping: 18, stiffness: 160 } }),
              [0, 1], [i % 2 === 0 ? -300 : 300, 0]
            );
            return (
              <div key={s.label} style={{
                display: "flex", alignItems: "center", gap: 16,
                padding: "16px 32px", borderRadius: 20,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(167,139,250,0.2)",
                opacity: op, transform: `translateX(${x}px)`,
              }}>
                <span style={{ fontSize: 32 }}>{s.icon}</span>
                <span style={{ fontFamily: b, fontSize: 24, color: "white", fontWeight: 600 }}>{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
