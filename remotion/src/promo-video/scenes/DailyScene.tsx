import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const areas = [
  { icon: "❤️", label: "Amore", value: "Ottimo", color: "#f472b6" },
  { icon: "💼", label: "Lavoro", value: "Favorevole", color: "#60a5fa" },
  { icon: "💰", label: "Denaro", value: "Attenzione", color: "#fbbf24" },
  { icon: "🧘", label: "Benessere", value: "Alto", color: "#34d399" },
  { icon: "🌱", label: "Crescita", value: "In espansione", color: "#a78bfa" },
];

export const DailyScene = ({ d, b }: { d: string; b: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Vibration number animation
  const vibNum = spring({ frame: frame - 5, fps, config: { damping: 10 } });
  const vibGlow = 0.2 + Math.sin(frame * 0.1) * 0.15;

  // Keywords highlight
  const kw1Op = interpolate(frame, [100, 115], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const kw1Scale = spring({ frame: frame - 95, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 50 }}>
      {/* Section label */}
      <div style={{
        fontFamily: b, fontSize: 20, fontWeight: 600, color: "#60a5fa",
        textTransform: "uppercase", letterSpacing: 6, opacity: titleOp,
        marginBottom: 16,
      }}>
        📊 Analisi del Giorno
      </div>

      {/* Vibration number */}
      <div style={{
        position: "relative", marginBottom: 40,
        display: "flex", justifyContent: "center", alignItems: "center",
      }}>
        <div style={{
          position: "absolute", width: 160, height: 160, borderRadius: "50%",
          background: `radial-gradient(circle, rgba(96,165,250,${vibGlow}), transparent 70%)`,
        }} />
        <div style={{
          fontFamily: d, fontSize: 80, fontWeight: 900, color: "white",
          transform: `scale(${vibNum})`,
        }}>8</div>
      </div>

      <div style={{
        fontFamily: b, fontSize: 24, color: "rgba(255,255,255,0.6)",
        marginBottom: 40, opacity: titleOp,
      }}>
        Vibrazione Personale del Giorno
      </div>

      {/* Area cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%", maxWidth: 900, padding: "0 20px" }}>
        {areas.map((a, i) => {
          const delay = 25 + i * 12;
          const op = interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const xOff = interpolate(spring({ frame: frame - delay, fps, config: { damping: 16 } }), [0, 1], [-60, 0]);
          return (
            <div key={a.label} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "rgba(255,255,255,0.04)", borderRadius: 20,
              border: `1px solid ${a.color}33`, padding: "18px 28px",
              opacity: op, transform: `translateX(${xOff}px)`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 32 }}>{a.icon}</span>
                <span style={{ fontFamily: b, fontSize: 26, fontWeight: 600, color: "white" }}>{a.label}</span>
              </div>
              <span style={{ fontFamily: b, fontSize: 22, color: a.color, fontWeight: 700 }}>{a.value}</span>
            </div>
          );
        })}
      </div>

      {/* Highlighted keywords */}
      <div style={{
        position: "absolute", bottom: 240, left: 0, right: 0,
        display: "flex", justifyContent: "center", gap: 20,
        opacity: kw1Op, transform: `scale(${0.8 + kw1Scale * 0.2})`,
      }}>
        {["CHIAREZZA", "CONTROLLO"].map((kw, i) => (
          <div key={kw} style={{
            fontFamily: d, fontSize: 32, fontWeight: 900,
            color: "#60a5fa", letterSpacing: 4,
            textShadow: "0 0 30px rgba(96,165,250,0.5)",
          }}>{kw}</div>
        ))}
      </div>

      {/* Caption */}
      <div style={{
        position: "absolute", bottom: 140, left: 60, right: 60,
        textAlign: "center",
        opacity: interpolate(frame, [10, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        <div style={{
          fontFamily: b, fontSize: 24, color: "rgba(255,255,255,0.8)",
          lineHeight: 1.5, textShadow: "0 2px 20px rgba(0,0,0,0.8)",
        }}>
          Più chiarezza. Più controllo.
        </div>
      </div>
    </AbsoluteFill>
  );
};
