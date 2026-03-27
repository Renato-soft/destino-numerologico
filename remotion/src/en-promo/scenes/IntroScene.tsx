import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const IntroScene = ({ d, b }: { d: string; b: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ frame, fps, config: { damping: 15, stiffness: 120 } });
  const titleOp = interpolate(frame, [0, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const subtitleOp = interpolate(frame, [30, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const ringRotation = frame * 0.4;
  const ringScale = 0.8 + Math.sin(frame * 0.025) * 0.1;

  const features = ["🔮 Personal Map", "📊 Daily Analysis", "👗 Custom Outfits", "💬 AI Assistant"];

  const descOp = interpolate(frame, [120, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const descY = interpolate(spring({ frame: frame - 115, fps, config: { damping: 18 } }), [0, 1], [40, 0]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 60 }}>
      {/* Decorative rings */}
      <div style={{
        position: "absolute", width: 420, height: 420,
        border: "1px solid rgba(167,139,250,0.2)",
        borderRadius: "50%", transform: `rotate(${ringRotation}deg) scale(${ringScale})`,
      }} />
      <div style={{
        position: "absolute", width: 530, height: 530,
        border: "1px solid rgba(240,171,252,0.1)",
        borderRadius: "50%", transform: `rotate(${-ringRotation * 0.7}deg) scale(${ringScale})`,
      }} />

      {/* App name */}
      <div style={{
        fontFamily: b, fontSize: 18, fontWeight: 600, color: "#a78bfa",
        textTransform: "uppercase", letterSpacing: 8, opacity: titleOp,
        marginBottom: 24,
      }}>
        Numerological Destiny
      </div>

      {/* Main title */}
      <div style={{
        fontFamily: d, fontSize: 50, fontWeight: 900, color: "white",
        textAlign: "center", lineHeight: 1.2, opacity: titleOp,
        transform: `scale(${0.8 + titleScale * 0.2})`,
      }}>
        The exclusive tool
        <br />
        <span style={{
          background: "linear-gradient(135deg, #f0abfc, #a78bfa)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>for your success</span>
      </div>

      {/* Feature pills */}
      <div style={{
        marginTop: 55, display: "flex", flexDirection: "column",
        gap: 14, alignItems: "center",
      }}>
        {features.map((f, i) => {
          const delay = 45 + i * 14;
          const op = interpolate(frame, [delay, delay + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const x = interpolate(spring({ frame: frame - delay, fps, config: { damping: 14 } }), [0, 1], [80, 0]);
          return (
            <div key={i} style={{
              fontFamily: b, fontSize: 25, color: "white",
              background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.25)",
              borderRadius: 50, padding: "13px 34px",
              opacity: op, transform: `translateX(${i % 2 === 0 ? x : -x}px)`,
            }}>
              {f}
            </div>
          );
        })}
      </div>

      {/* Extended description */}
      <div style={{
        position: "absolute", bottom: 220, left: 60, right: 60,
        textAlign: "center", opacity: descOp,
        transform: `translateY(${descY}px)`,
      }}>
        <div style={{
          fontFamily: b, fontSize: 26, color: "rgba(255,255,255,0.75)",
          lineHeight: 1.5,
        }}>
          Transforms numerology into
          <br />your daily guide to success.
        </div>
      </div>

      {/* Caption */}
      <div style={{
        position: "absolute", bottom: 130, left: 60, right: 60,
        textAlign: "center",
        opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        <div style={{
          fontFamily: b, fontSize: 24, color: "rgba(255,255,255,0.8)",
          lineHeight: 1.5, textShadow: "0 2px 20px rgba(0,0,0,0.8)",
        }}>
          "Numerological Destiny transforms the numbers
          <br />of your life into concrete guidance."
        </div>
      </div>
    </AbsoluteFill>
  );
};
