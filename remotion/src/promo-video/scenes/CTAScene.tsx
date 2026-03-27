import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const CTAScene = ({ d, b }: { d: string; b: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mainOp = interpolate(frame, [0, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const mainScale = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });

  // Pulsating CTA button
  const pulse = 1 + Math.sin(frame * 0.12) * 0.04;
  const btnOp = interpolate(frame, [40, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const urlOp = interpolate(frame, [70, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Grand glow
  const glowSize = 500 + Math.sin(frame * 0.05) * 80;
  const glowOp = 0.15 + Math.sin(frame * 0.04) * 0.08;

  // Keyword animations
  const kw1Op = interpolate(frame, [10, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const kw1Scale = spring({ frame: frame - 5, fps, config: { damping: 10 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Grand glow */}
      <div style={{
        position: "absolute", width: glowSize, height: glowSize,
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(167,139,250,${glowOp}), rgba(240,171,252,${glowOp * 0.5}), transparent 70%)`,
      }} />

      {/* DESTINO keyword */}
      <div style={{
        position: "absolute", top: 350,
        opacity: kw1Op, transform: `scale(${0.7 + kw1Scale * 0.3})`,
      }}>
        <div style={{
          fontFamily: d, fontSize: 28, fontWeight: 900, color: "#a78bfa",
          letterSpacing: 12, textShadow: "0 0 40px rgba(167,139,250,0.4)",
        }}>
          DESTINO • ENERGIA • POTENZIALE
        </div>
      </div>

      {/* Main message */}
      <div style={{ textAlign: "center", opacity: mainOp, transform: `scale(${0.85 + mainScale * 0.15})` }}>
        <div style={{
          fontFamily: d, fontSize: 54, fontWeight: 900, color: "white",
          lineHeight: 1.2, marginBottom: 16,
        }}>
          Scopri il tuo
          <br />
          <span style={{
            background: "linear-gradient(135deg, #f0abfc, #a78bfa, #60a5fa)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>vero potenziale</span>
        </div>

        <div style={{
          fontFamily: b, fontSize: 26, color: "rgba(255,255,255,0.6)",
          marginBottom: 50,
        }}>
          Non lasciare il tuo futuro al caso.
        </div>
      </div>

      {/* CTA Button */}
      <div style={{
        opacity: btnOp, transform: `scale(${pulse})`,
      }}>
        <div style={{
          fontFamily: b, fontSize: 32, fontWeight: 700, color: "white",
          background: "linear-gradient(135deg, #a78bfa, #7c3aed)",
          padding: "22px 70px", borderRadius: 60,
          boxShadow: "0 10px 40px rgba(124,58,237,0.4), 0 0 60px rgba(167,139,250,0.2)",
        }}>
          Iscriviti ora ✨
        </div>
      </div>

      {/* URL */}
      <div style={{
        position: "absolute", bottom: 260, opacity: urlOp,
      }}>
        <div style={{
          fontFamily: b, fontSize: 24, color: "rgba(255,255,255,0.5)",
          letterSpacing: 2,
        }}>
          numerologicaldestiny.com
        </div>
      </div>

      {/* Final caption */}
      <div style={{
        position: "absolute", bottom: 140, left: 60, right: 60,
        textAlign: "center",
        opacity: interpolate(frame, [5, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        <div style={{
          fontFamily: b, fontSize: 26, color: "rgba(255,255,255,0.85)",
          fontStyle: "italic", lineHeight: 1.5,
          textShadow: "0 2px 20px rgba(0,0,0,0.8)",
        }}>
          "Iscriviti ora a Numerological Destiny."
        </div>
      </div>
    </AbsoluteFill>
  );
};
