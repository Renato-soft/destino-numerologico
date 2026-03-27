import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const CTAScene = ({ displayFont, bodyFont }: { displayFont: string; bodyFont: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame: frame - 5, fps, config: { damping: 12 } });
  const titleOp = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const titleY = interpolate(frame, [15, 30], [40, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const subOp = interpolate(frame, [30, 45], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  const pulse = 1 + Math.sin(frame * 0.12) * 0.04;

  const features = ["Analisi giornaliera", "Outfit personalizzato", "Chat AI illimitata"];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 60 }}>
      {/* App name */}
      <div
        style={{
          fontFamily: displayFont,
          fontSize: 56,
          fontWeight: 900,
          textAlign: "center",
          transform: `scale(${logoScale})`,
          marginBottom: 40,
          background: "linear-gradient(135deg, #a78bfa, #c084fc, #f0abfc)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Destino
        <br />
        Numerologico
      </div>

      {/* Tagline */}
      <div
        style={{
          fontFamily: displayFont,
          fontSize: 44,
          fontWeight: 700,
          color: "white",
          textAlign: "center",
          opacity: titleOp,
          transform: `translateY(${titleY}px)`,
          marginBottom: 40,
          lineHeight: 1.3,
        }}
      >
        La tua guida
        <br />
        numerologica quotidiana
      </div>

      {/* Feature pills */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center", opacity: subOp }}>
        {features.map((f, i) => {
          const pillScale = spring({ frame: frame - 35 - i * 6, fps, config: { damping: 15 } });
          return (
            <div
              key={f}
              style={{
                padding: "16px 40px",
                borderRadius: 50,
                background: "rgba(167,139,250,0.15)",
                border: "1px solid rgba(167,139,250,0.35)",
                fontFamily: bodyFont,
                fontSize: 26,
                fontWeight: 600,
                color: "white",
                transform: `scale(${pillScale * pulse})`,
              }}
            >
              ✦ {f}
            </div>
          );
        })}
      </div>

      {/* Bottom text */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          fontFamily: bodyFont,
          fontSize: 28,
          color: "rgba(255,255,255,0.5)",
          textAlign: "center",
          opacity: subOp,
        }}
      >
        Disponibile ora · destino-numerologico.lovable.app
      </div>
    </AbsoluteFill>
  );
};
