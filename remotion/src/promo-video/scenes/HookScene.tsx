import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const HookScene = ({ d, b }: { d: string; b: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phone glow effect
  const glowPulse = 0.3 + Math.sin(frame * 0.08) * 0.15;
  const glowSize = 200 + Math.sin(frame * 0.06) * 40;

  // Text animations
  const line1Op = interpolate(frame, [15, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line1Y = interpolate(spring({ frame: frame - 10, fps, config: { damping: 18 } }), [0, 1], [60, 0]);

  const line2Op = interpolate(frame, [40, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line2Y = interpolate(spring({ frame: frame - 35, fps, config: { damping: 18 } }), [0, 1], [60, 0]);

  // Caption (voiceover text)
  const captionOp = interpolate(frame, [5, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Mystical particles
  const particles = Array.from({ length: 12 }, (_, i) => ({
    x: 540 + Math.sin(i * 1.3 + frame * 0.02) * (200 + i * 30),
    y: 960 + Math.cos(i * 0.9 + frame * 0.015) * (300 + i * 20),
    size: 3 + Math.sin(i * 2.1 + frame * 0.05) * 2,
    op: 0.3 + Math.sin(i * 1.7 + frame * 0.04) * 0.25,
  }));

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Soft center glow */}
      <div style={{
        position: "absolute", width: glowSize, height: glowSize,
        borderRadius: "50%", left: 540 - glowSize / 2, top: 800 - glowSize / 2,
        background: `radial-gradient(circle, rgba(167,139,250,${glowPulse}), transparent 70%)`,
      }} />

      {/* Particles */}
      {particles.map((p, i) => (
        <div key={i} style={{
          position: "absolute", left: p.x, top: p.y,
          width: p.size, height: p.size, borderRadius: "50%",
          background: `rgba(240,171,252,${p.op})`,
        }} />
      ))}

      {/* Phone emoji */}
      <div style={{
        fontSize: 100, marginBottom: 60,
        opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        transform: `scale(${spring({ frame, fps, config: { damping: 12 } })})`,
      }}>📱</div>

      {/* Main text */}
      <div style={{ textAlign: "center", padding: "0 80px" }}>
        <div style={{
          fontFamily: d, fontSize: 58, fontWeight: 900, color: "white",
          lineHeight: 1.2, opacity: line1Op, transform: `translateY(${line1Y}px)`,
        }}>
          Il tuo destino.
        </div>
        <div style={{
          fontFamily: d, fontSize: 58, fontWeight: 900, lineHeight: 1.2,
          opacity: line2Op, transform: `translateY(${line2Y}px)`,
          background: "linear-gradient(135deg, #f0abfc, #a78bfa, #60a5fa)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          Ogni giorno.
        </div>
      </div>

      {/* Caption / voiceover subtitle */}
      <div style={{
        position: "absolute", bottom: 180, left: 60, right: 60,
        textAlign: "center", opacity: captionOp,
      }}>
        <div style={{
          fontFamily: b, fontSize: 28, color: "rgba(255,255,255,0.85)",
          fontStyle: "italic", lineHeight: 1.5,
          textShadow: "0 2px 20px rgba(0,0,0,0.8)",
        }}>
          "E se il tuo destino fosse già scritto…
          <br />e tu potessi leggerlo ogni giorno?"
        </div>
      </div>
    </AbsoluteFill>
  );
};
