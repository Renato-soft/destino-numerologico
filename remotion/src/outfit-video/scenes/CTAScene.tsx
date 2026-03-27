import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const CTAScene = ({ d, b }: { d: string; b: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ frame, fps, config: { damping: 12 } });
  const titleOp = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  const subOp = interpolate(frame, [20, 38], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  const btnScale = spring({ frame: frame - 40, fps, config: { damping: 10, stiffness: 100 } });
  const btnOp = interpolate(frame, [40, 55], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Pulsating button
  const pulse = 1 + Math.sin(frame * 0.12) * 0.03;

  const linkOp = interpolate(frame, [60, 75], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 60 }}>
      {/* Radial glow */}
      <div style={{
        position: "absolute", width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(167,139,250,0.2), transparent 70%)",
      }} />

      <div style={{ textAlign: "center", zIndex: 1 }}>
        <div style={{
          fontSize: 70, marginBottom: 20,
          transform: `scale(${titleScale})`, opacity: titleOp,
        }}>
          👗✨
        </div>

        <div style={{
          fontFamily: d, fontSize: 56, fontWeight: 900, color: "white",
          lineHeight: 1.2, opacity: titleOp,
          transform: `scale(${0.8 + titleScale * 0.2})`,
        }}>
          Scopri il tuo
          <br />
          <span style={{
            background: "linear-gradient(135deg, #f0abfc, #a78bfa, #60a5fa)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            look perfetto
          </span>
        </div>

        <div style={{
          fontFamily: b, fontSize: 26, color: "rgba(255,255,255,0.6)",
          opacity: subOp, marginTop: 24, maxWidth: 700,
          marginLeft: "auto", marginRight: "auto",
        }}>
          Outfit personalizzati ogni giorno in base alla tua vibrazione numerologica
        </div>

        {/* CTA Button */}
        <div style={{
          marginTop: 50, opacity: btnOp,
          transform: `scale(${btnScale * pulse})`,
        }}>
          <div style={{
            display: "inline-block", padding: "24px 64px", borderRadius: 60,
            background: "linear-gradient(135deg, #a78bfa, #7c3aed)",
            boxShadow: "0 10px 40px rgba(124,58,237,0.5), 0 0 80px rgba(167,139,250,0.3)",
          }}>
            <span style={{
              fontFamily: b, fontSize: 30, fontWeight: 700, color: "white",
              letterSpacing: 1,
            }}>
              Prova gratis ora →
            </span>
          </div>
        </div>

        <div style={{
          fontFamily: b, fontSize: 22, color: "#a78bfa",
          opacity: linkOp, marginTop: 30, letterSpacing: 2,
        }}>
          destino-numerologico.lovable.app
        </div>
      </div>
    </AbsoluteFill>
  );
};
