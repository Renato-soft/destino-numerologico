import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const IntroScene = ({ d, b }: { d: string; b: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ frame, fps, config: { damping: 15, stiffness: 120 } });
  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const subtitleOp = interpolate(frame, [25, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subtitleY = interpolate(spring({ frame: frame - 20, fps, config: { damping: 18 } }), [0, 1], [40, 0]);

  // Animated ring
  const ringRotation = frame * 0.5;
  const ringScale = 0.8 + Math.sin(frame * 0.03) * 0.1;

  // Feature pills appearing
  const features = ["🔮 Mappa personale", "📊 Analisi giornaliera", "👗 Outfit su misura", "💬 Assistente AI"];

  const captionOp = interpolate(frame, [10, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 60 }}>
      {/* Decorative ring */}
      <div style={{
        position: "absolute", width: 400, height: 400,
        border: "1px solid rgba(167,139,250,0.2)",
        borderRadius: "50%", transform: `rotate(${ringRotation}deg) scale(${ringScale})`,
      }} />
      <div style={{
        position: "absolute", width: 500, height: 500,
        border: "1px solid rgba(240,171,252,0.1)",
        borderRadius: "50%", transform: `rotate(${-ringRotation * 0.7}deg) scale(${ringScale})`,
      }} />

      {/* App name */}
      <div style={{
        fontFamily: b, fontSize: 20, fontWeight: 600, color: "#a78bfa",
        textTransform: "uppercase", letterSpacing: 8, opacity: titleOp,
        marginBottom: 20,
      }}>
        Numerological Destiny
      </div>

      {/* Main title */}
      <div style={{
        fontFamily: d, fontSize: 52, fontWeight: 900, color: "white",
        textAlign: "center", lineHeight: 1.2, opacity: titleOp,
        transform: `scale(${0.8 + titleScale * 0.2})`,
      }}>
        Scopri il tuo
        <br />
        <span style={{
          background: "linear-gradient(135deg, #f0abfc, #a78bfa)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>percorso</span>
      </div>

      {/* Feature pills */}
      <div style={{
        marginTop: 60, display: "flex", flexDirection: "column",
        gap: 16, alignItems: "center",
      }}>
        {features.map((f, i) => {
          const delay = 40 + i * 12;
          const op = interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const x = interpolate(spring({ frame: frame - delay, fps, config: { damping: 14 } }), [0, 1], [80, 0]);
          return (
            <div key={i} style={{
              fontFamily: b, fontSize: 26, color: "white",
              background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.25)",
              borderRadius: 50, padding: "14px 36px",
              opacity: op, transform: `translateX(${i % 2 === 0 ? x : -x}px)`,
            }}>
              {f}
            </div>
          );
        })}
      </div>

      {/* Caption */}
      <div style={{
        position: "absolute", bottom: 160, left: 60, right: 60,
        textAlign: "center", opacity: captionOp,
      }}>
        <div style={{
          fontFamily: b, fontSize: 26, color: "rgba(255,255,255,0.8)",
          lineHeight: 1.5, textShadow: "0 2px 20px rgba(0,0,0,0.8)",
        }}>
          Trasforma i numeri della tua vita
          <br />in guida concreta, ogni giorno.
        </div>
      </div>
    </AbsoluteFill>
  );
};
