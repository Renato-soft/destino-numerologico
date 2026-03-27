import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const areas = [
  { icon: "❤️", label: "Love", value: "Excellent", color: "#f472b6" },
  { icon: "💼", label: "Career", value: "Favorable", color: "#60a5fa" },
  { icon: "💰", label: "Finance", value: "Caution", color: "#fbbf24" },
  { icon: "🧘", label: "Wellness", value: "High", color: "#34d399" },
  { icon: "🌱", label: "Growth", value: "Expanding", color: "#a78bfa" },
];

export const DailyScene = ({ d, b }: { d: string; b: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [0, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const vibNum = spring({ frame: frame - 8, fps, config: { damping: 10 } });
  const vibGlow = 0.2 + Math.sin(frame * 0.1) * 0.15;

  const kw1Op = interpolate(frame, [140, 160], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const kw1Scale = spring({ frame: frame - 135, fps, config: { damping: 12 } });

  // Insight text that appears after the cards
  const insightOp = interpolate(frame, [110, 135], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const insightY = interpolate(spring({ frame: frame - 105, fps, config: { damping: 16 } }), [0, 1], [30, 0]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 50 }}>
      {/* Section label */}
      <div style={{
        fontFamily: b, fontSize: 20, fontWeight: 600, color: "#60a5fa",
        textTransform: "uppercase", letterSpacing: 6, opacity: titleOp,
        marginBottom: 16,
      }}>
        📊 Daily Analysis
      </div>

      {/* Vibration number */}
      <div style={{
        position: "relative", marginBottom: 35,
        display: "flex", justifyContent: "center", alignItems: "center",
      }}>
        <div style={{
          position: "absolute", width: 170, height: 170, borderRadius: "50%",
          background: `radial-gradient(circle, rgba(96,165,250,${vibGlow}), transparent 70%)`,
        }} />
        <div style={{
          fontFamily: d, fontSize: 85, fontWeight: 900, color: "white",
          transform: `scale(${vibNum})`,
        }}>8</div>
      </div>

      <div style={{
        fontFamily: b, fontSize: 22, color: "rgba(255,255,255,0.6)",
        marginBottom: 35, opacity: titleOp,
      }}>
        Personal Day Vibration
      </div>

      {/* Area cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 13, width: "100%", maxWidth: 900, padding: "0 20px" }}>
        {areas.map((a, i) => {
          const delay = 30 + i * 14;
          const op = interpolate(frame, [delay, delay + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const xOff = interpolate(spring({ frame: frame - delay, fps, config: { damping: 16 } }), [0, 1], [-60, 0]);
          return (
            <div key={a.label} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "rgba(255,255,255,0.04)", borderRadius: 20,
              border: `1px solid ${a.color}33`, padding: "17px 28px",
              opacity: op, transform: `translateX(${xOff}px)`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 30 }}>{a.icon}</span>
                <span style={{ fontFamily: b, fontSize: 25, fontWeight: 600, color: "white" }}>{a.label}</span>
              </div>
              <span style={{ fontFamily: b, fontSize: 21, color: a.color, fontWeight: 700 }}>{a.value}</span>
            </div>
          );
        })}
      </div>

      {/* Insight text */}
      <div style={{
        position: "absolute", bottom: 300, left: 60, right: 60,
        textAlign: "center", opacity: insightOp,
        transform: `translateY(${insightY}px)`,
      }}>
        <div style={{
          fontFamily: b, fontSize: 24, color: "rgba(255,255,255,0.7)",
          lineHeight: 1.5,
        }}>
          Receive targeted insights and make
          <br />better decisions every single day.
        </div>
      </div>

      {/* Keywords */}
      <div style={{
        position: "absolute", bottom: 220, left: 0, right: 0,
        display: "flex", justifyContent: "center", gap: 24,
        opacity: kw1Op, transform: `scale(${0.8 + kw1Scale * 0.2})`,
      }}>
        {["CLARITY", "AWARENESS"].map((kw) => (
          <div key={kw} style={{
            fontFamily: d, fontSize: 30, fontWeight: 900,
            color: "#60a5fa", letterSpacing: 5,
            textShadow: "0 0 30px rgba(96,165,250,0.5)",
          }}>{kw}</div>
        ))}
      </div>

      {/* Caption */}
      <div style={{
        position: "absolute", bottom: 130, left: 60, right: 60,
        textAlign: "center",
        opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        <div style={{
          fontFamily: b, fontSize: 23, color: "rgba(255,255,255,0.8)",
          lineHeight: 1.5, textShadow: "0 2px 20px rgba(0,0,0,0.8)",
        }}>
          "Analyze your personal energy and receive
          <br />targeted insights for better decisions."
        </div>
      </div>
    </AbsoluteFill>
  );
};
