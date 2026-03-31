import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const SkitCTAScene = ({ d, b }: { d: string; b: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const emojiScale = spring({ frame, fps, config: { damping: 8 } });
  const titleOp = interpolate(frame, [10, 25], [0, 1], { extrapolateRight: "clamp" });
  const titleScale = spring({ frame: frame - 10, fps, config: { damping: 12 } });

  const subOp = interpolate(frame, [30, 45], [0, 1], { extrapolateRight: "clamp" });

  const btnScale = spring({ frame: frame - 50, fps, config: { damping: 10 } });
  const btnOp = interpolate(frame, [50, 65], [0, 1], { extrapolateRight: "clamp" });
  const pulse = 1 + Math.sin(frame * 0.1) * 0.025;

  const linkOp = interpolate(frame, [70, 85], [0, 1], { extrapolateRight: "clamp" });

  // Floating particles
  const particles = Array.from({ length: 6 }, (_, i) => ({
    x: 150 + i * 150 + Math.sin(frame * 0.02 + i * 1.5) * 40,
    y: 400 + i * 200 + Math.cos(frame * 0.015 + i) * 30,
    size: 4 + Math.sin(frame * 0.03 + i) * 2,
    op: 0.15 + Math.sin(frame * 0.02 + i * 0.8) * 0.1,
  }));

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(170deg, #1a0a2e 0%, #0d0d1a 40%, #1a0520 100%)",
      justifyContent: "center", alignItems: "center",
    }}>
      {/* Glow */}
      <div style={{
        position: "absolute", width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(251,191,36,0.15), transparent 70%)",
      }} />

      {/* Particles */}
      {particles.map((p, i) => (
        <div key={i} style={{
          position: "absolute", left: p.x, top: p.y,
          width: p.size, height: p.size, borderRadius: "50%",
          background: i % 2 === 0 ? "rgba(240,171,252,0.5)" : "rgba(251,191,36,0.5)",
          opacity: p.op,
        }} />
      ))}

      <div style={{ textAlign: "center", zIndex: 1, padding: 60 }}>
        <div style={{ fontSize: 80, transform: `scale(${emojiScale})`, marginBottom: 20 }}>
          👗✨🔥
        </div>

        <div style={{
          fontFamily: d, fontSize: 54, fontWeight: 900, color: "white",
          lineHeight: 1.2, opacity: titleOp,
          transform: `scale(${0.8 + titleScale * 0.2})`,
        }}>
          Outfit perfetti
          <br />
          <span style={{
            background: "linear-gradient(135deg, #fbbf24, #f59e0b, #f0abfc)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            ogni giorno
          </span>
        </div>

        <div style={{
          fontFamily: b, fontSize: 26, color: "rgba(255,255,255,0.6)",
          opacity: subOp, marginTop: 28, maxWidth: 700,
          marginLeft: "auto", marginRight: "auto", lineHeight: 1.5,
        }}>
          Basati sulla tua vibrazione numerologica e il tuo aspetto
        </div>

        <div style={{
          marginTop: 50, opacity: btnOp,
          transform: `scale(${btnScale * pulse})`,
        }}>
          <div style={{
            display: "inline-block", padding: "24px 64px", borderRadius: 60,
            background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
            boxShadow: "0 10px 40px rgba(251,191,36,0.4), 0 0 60px rgba(251,191,36,0.2)",
          }}>
            <span style={{
              fontFamily: b, fontSize: 30, fontWeight: 700, color: "#1a1a2e",
              letterSpacing: 1,
            }}>
              Provalo gratis →
            </span>
          </div>
        </div>

        <div style={{
          fontFamily: b, fontSize: 22, color: "#fbbf24",
          opacity: linkOp, marginTop: 30, letterSpacing: 2,
        }}>
          destino-numerologico.lovable.app
        </div>
      </div>
    </AbsoluteFill>
  );
};
