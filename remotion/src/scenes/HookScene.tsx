import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Sequence } from "remotion";

export const HookScene = ({ displayFont, bodyFont }: { displayFont: string; bodyFont: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const numberScale = spring({ frame: frame - 5, fps, config: { damping: 12, stiffness: 150 } });
  const titleY = interpolate(spring({ frame: frame - 18, fps, config: { damping: 20 } }), [0, 1], [80, 0]);
  const titleOp = interpolate(frame, [18, 35], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const subOp = interpolate(frame, [35, 50], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const subY = interpolate(frame, [35, 50], [30, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Pulsing glow on number
  const pulse = 1 + Math.sin(frame * 0.15) * 0.08;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 60 }}>
      {/* Big vibration number */}
      <div
        style={{
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(167,139,250,0.3) 0%, rgba(139,92,246,0.15) 100%)",
          border: "2px solid rgba(167,139,250,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${numberScale * pulse})`,
          boxShadow: "0 0 60px rgba(139,92,246,0.3), 0 0 120px rgba(139,92,246,0.1)",
          marginBottom: 50,
        }}
      >
        <span
          style={{
            fontFamily: displayFont,
            fontSize: 120,
            fontWeight: 900,
            color: "white",
            textShadow: "0 0 30px rgba(167,139,250,0.6)",
          }}
        >
          7
        </span>
      </div>

      {/* Title */}
      <div
        style={{
          fontFamily: displayFont,
          fontSize: 64,
          fontWeight: 900,
          color: "white",
          textAlign: "center",
          lineHeight: 1.15,
          opacity: titleOp,
          transform: `translateY(${titleY}px)`,
          marginBottom: 24,
        }}
      >
        Conosci la tua
        <br />
        <span
          style={{
            background: "linear-gradient(135deg, #a78bfa, #c084fc, #f0abfc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          energia del giorno
        </span>
      </div>

      {/* Subtitle */}
      <div
        style={{
          fontFamily: bodyFont,
          fontSize: 32,
          color: "rgba(255,255,255,0.7)",
          textAlign: "center",
          opacity: subOp,
          transform: `translateY(${subY}px)`,
          maxWidth: 700,
        }}
      >
        Ogni giorno ha una vibrazione unica.
        <br />
        Scopri la tua con Destino Numerologico.
      </div>
    </AbsoluteFill>
  );
};
