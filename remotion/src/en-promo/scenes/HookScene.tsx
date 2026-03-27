import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const HookScene = ({ d, b }: { d: string; b: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const glowPulse = 0.3 + Math.sin(frame * 0.08) * 0.15;
  const glowSize = 220 + Math.sin(frame * 0.06) * 50;

  const line1Op = interpolate(frame, [20, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line1Y = interpolate(spring({ frame: frame - 15, fps, config: { damping: 18 } }), [0, 1], [60, 0]);

  const line2Op = interpolate(frame, [55, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line2Y = interpolate(spring({ frame: frame - 50, fps, config: { damping: 18 } }), [0, 1], [60, 0]);

  const line3Op = interpolate(frame, [90, 115], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line3Y = interpolate(spring({ frame: frame - 85, fps, config: { damping: 18 } }), [0, 1], [40, 0]);

  // Mystical number rain
  const numbers = Array.from({ length: 20 }, (_, i) => ({
    x: (i * 57 + 30) % 1080,
    y: ((frame * (0.5 + i * 0.15) + i * 97) % 2200) - 200,
    size: 18 + (i % 5) * 6,
    op: 0.06 + Math.sin(i * 2.3 + frame * 0.03) * 0.04,
    num: ((i * 7 + 3) % 9) + 1,
  }));

  // Floating particles
  const particles = Array.from({ length: 15 }, (_, i) => ({
    x: 540 + Math.sin(i * 1.3 + frame * 0.02) * (200 + i * 30),
    y: 960 + Math.cos(i * 0.9 + frame * 0.015) * (300 + i * 20),
    size: 3 + Math.sin(i * 2.1 + frame * 0.05) * 2,
    op: 0.3 + Math.sin(i * 1.7 + frame * 0.04) * 0.25,
  }));

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Number rain background */}
      {numbers.map((n, i) => (
        <div key={`n${i}`} style={{
          position: "absolute", left: n.x, top: n.y,
          fontFamily: d, fontSize: n.size, fontWeight: 700,
          color: `rgba(167,139,250,${n.op})`,
        }}>{n.num}</div>
      ))}

      {/* Center glow */}
      <div style={{
        position: "absolute", width: glowSize, height: glowSize,
        borderRadius: "50%", left: 540 - glowSize / 2, top: 750 - glowSize / 2,
        background: `radial-gradient(circle, rgba(167,139,250,${glowPulse}), transparent 70%)`,
      }} />

      {/* Particles */}
      {particles.map((p, i) => (
        <div key={`p${i}`} style={{
          position: "absolute", left: p.x, top: p.y,
          width: p.size, height: p.size, borderRadius: "50%",
          background: `rgba(240,171,252,${p.op})`,
        }} />
      ))}

      {/* Crystal ball emoji */}
      <div style={{
        fontSize: 110, marginBottom: 50,
        opacity: interpolate(frame, [0, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        transform: `scale(${spring({ frame, fps, config: { damping: 12 } })})`,
      }}>🔮</div>

      {/* Main text */}
      <div style={{ textAlign: "center", padding: "0 70px" }}>
        <div style={{
          fontFamily: d, fontSize: 50, fontWeight: 900, color: "white",
          lineHeight: 1.25, opacity: line1Op, transform: `translateY(${line1Y}px)`,
        }}>
          What if your destiny
        </div>
        <div style={{
          fontFamily: d, fontSize: 50, fontWeight: 900, lineHeight: 1.25,
          opacity: line2Op, transform: `translateY(${line2Y}px)`,
          background: "linear-gradient(135deg, #f0abfc, #a78bfa, #60a5fa)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          were already written
        </div>
        <div style={{
          fontFamily: d, fontSize: 48, fontWeight: 900, lineHeight: 1.25,
          opacity: line3Op, transform: `translateY(${line3Y}px)`,
          color: "white",
        }}>
          in numbers?
        </div>
      </div>

      {/* Sub-caption */}
      <div style={{
        position: "absolute", bottom: 240, left: 60, right: 60,
        textAlign: "center",
        opacity: interpolate(frame, [120, 145], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        <div style={{
          fontFamily: b, fontSize: 28, color: "rgba(255,255,255,0.7)",
          lineHeight: 1.5,
        }}>
          Discover the secret that will forever
          <br />change the way you see the world.
        </div>
      </div>

      {/* Caption */}
      <div style={{
        position: "absolute", bottom: 140, left: 60, right: 60,
        textAlign: "center",
        opacity: interpolate(frame, [5, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        <div style={{
          fontFamily: b, fontSize: 26, color: "rgba(255,255,255,0.85)",
          fontStyle: "italic", lineHeight: 1.5,
          textShadow: "0 2px 20px rgba(0,0,0,0.8)",
        }}>
          "What if your destiny were already written
          <br />in numbers?"
        </div>
      </div>
    </AbsoluteFill>
  );
};
