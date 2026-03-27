import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const CTAScene = ({ d, b }: { d: string; b: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mainOp = interpolate(frame, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const mainScale = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });

  const pulse = 1 + Math.sin(frame * 0.12) * 0.04;
  const btnOp = interpolate(frame, [50, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const urlOp = interpolate(frame, [85, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const glowSize = 520 + Math.sin(frame * 0.05) * 90;
  const glowOp = 0.15 + Math.sin(frame * 0.04) * 0.08;

  const kw1Op = interpolate(frame, [15, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const kw1Scale = spring({ frame: frame - 10, fps, config: { damping: 10 } });

  // Confidence text
  const confOp = interpolate(frame, [120, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Grand glow */}
      <div style={{
        position: "absolute", width: glowSize, height: glowSize,
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(167,139,250,${glowOp}), rgba(240,171,252,${glowOp * 0.5}), transparent 70%)`,
      }} />

      {/* Keywords */}
      <div style={{
        position: "absolute", top: 350,
        opacity: kw1Op, transform: `scale(${0.7 + kw1Scale * 0.3})`,
      }}>
        <div style={{
          fontFamily: d, fontSize: 26, fontWeight: 900, color: "#a78bfa",
          letterSpacing: 10, textShadow: "0 0 40px rgba(167,139,250,0.4)",
        }}>
          DESTINY • ENERGY • POTENTIAL
        </div>
      </div>

      {/* Main message */}
      <div style={{ textAlign: "center", opacity: mainOp, transform: `scale(${0.85 + mainScale * 0.15})` }}>
        <div style={{
          fontFamily: d, fontSize: 52, fontWeight: 900, color: "white",
          lineHeight: 1.2, marginBottom: 18,
        }}>
          Step into your
          <br />
          <span style={{
            background: "linear-gradient(135deg, #f0abfc, #a78bfa, #60a5fa)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>true potential</span>
        </div>

        <div style={{
          fontFamily: b, fontSize: 26, color: "rgba(255,255,255,0.6)",
          marginBottom: 50,
        }}>
          Don't leave your future to chance.
        </div>
      </div>

      {/* CTA Button */}
      <div style={{ opacity: btnOp, transform: `scale(${pulse})` }}>
        <div style={{
          fontFamily: b, fontSize: 32, fontWeight: 700, color: "white",
          background: "linear-gradient(135deg, #a78bfa, #7c3aed)",
          padding: "22px 70px", borderRadius: 60,
          boxShadow: "0 10px 40px rgba(124,58,237,0.4), 0 0 60px rgba(167,139,250,0.2)",
        }}>
          Sign up now ✨
        </div>
      </div>

      {/* URL */}
      <div style={{ position: "absolute", bottom: 280, opacity: urlOp }}>
        <div style={{
          fontFamily: b, fontSize: 24, color: "rgba(255,255,255,0.5)",
          letterSpacing: 2,
        }}>
          numerologicaldestiny.com
        </div>
      </div>

      {/* Confidence line */}
      <div style={{
        position: "absolute", bottom: 210, left: 60, right: 60,
        textAlign: "center", opacity: confOp,
      }}>
        <div style={{
          fontFamily: b, fontSize: 22, color: "rgba(255,255,255,0.6)",
          lineHeight: 1.5,
        }}>
          Unlock the power of your numbers.
        </div>
      </div>

      {/* Caption */}
      <div style={{
        position: "absolute", bottom: 130, left: 60, right: 60,
        textAlign: "center",
        opacity: interpolate(frame, [5, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        <div style={{
          fontFamily: b, fontSize: 24, color: "rgba(255,255,255,0.85)",
          fontStyle: "italic", lineHeight: 1.5,
          textShadow: "0 2px 20px rgba(0,0,0,0.8)",
        }}>
          "Sign up now at Numerological Destiny
          <br />and unlock the power of your numbers."
        </div>
      </div>
    </AbsoluteFill>
  );
};
