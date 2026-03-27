import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const HookScene = ({ d, b }: { d: string; b: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line1Y = interpolate(spring({ frame, fps, config: { damping: 15, stiffness: 120 } }), [0, 1], [80, 0]);
  const line1Op = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  const line2Y = interpolate(spring({ frame: frame - 18, fps, config: { damping: 15, stiffness: 120 } }), [0, 1], [80, 0]);
  const line2Op = interpolate(frame, [18, 36], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  const emojiScale = spring({ frame: frame - 40, fps, config: { damping: 8 } });

  // Pulsating glow behind emoji
  const glowSize = 120 + Math.sin(frame * 0.15) * 20;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 60 }}>
      {/* Decorative line */}
      <div style={{
        position: "absolute", top: 350, left: 80, right: 80, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(240,171,252,0.3), transparent)",
        opacity: line1Op,
      }} />

      <div style={{ textAlign: "center" }}>
        <div style={{
          fontFamily: b, fontSize: 26, fontWeight: 600, color: "#f0abfc",
          textTransform: "uppercase", letterSpacing: 6, opacity: line1Op,
          transform: `translateY(${line1Y}px)`, marginBottom: 30,
        }}>
          👗 Outfit del Giorno
        </div>

        <div style={{
          fontFamily: d, fontSize: 64, fontWeight: 900, color: "white",
          lineHeight: 1.15, opacity: line1Op, transform: `translateY(${line1Y}px)`,
        }}>
          I tuoi numeri
        </div>
        <div style={{
          fontFamily: d, fontSize: 64, fontWeight: 900, lineHeight: 1.15,
          opacity: line2Op, transform: `translateY(${line2Y}px)`,
          background: "linear-gradient(135deg, #f0abfc, #a78bfa, #60a5fa)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          scelgono il tuo look
        </div>

        {/* Emoji with glow */}
        <div style={{
          marginTop: 50, position: "relative", display: "flex",
          justifyContent: "center", alignItems: "center",
        }}>
          <div style={{
            position: "absolute", width: glowSize, height: glowSize,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(167,139,250,0.3), transparent 70%)",
          }} />
          <div style={{
            fontSize: 90, transform: `scale(${emojiScale})`,
          }}>
            ✨
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
