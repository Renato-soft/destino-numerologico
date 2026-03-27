import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from "remotion";

const outfits = [
  { src: "images/outfit-day-f.jpg", label: "Giorno ✨", vib: "Vibrazione 6", color: "#86efac" },
  { src: "images/outfit-eve.jpg", label: "Sera 🌙", vib: "Vibrazione 6", color: "#f0abfc" },
  { src: "images/outfit-day-f2.jpg", label: "Giorno ☀️", vib: "Vibrazione 6", color: "#86efac" },
  { src: "images/outfit-eve2.jpg", label: "Sera 💎", vib: "Vibrazione 6", color: "#f0abfc" },
  { src: "images/outfit-day-m1.jpg", label: "Giorno 🔷", vib: "Vibrazione 7", color: "#60a5fa" },
  { src: "images/outfit-day-m3.jpg", label: "Giorno 🌊", vib: "Vibrazione 7", color: "#60a5fa" },
  { src: "images/outfit-day-m2.jpg", label: "Giorno ⚡", vib: "Vibrazione 22", color: "#fbbf24" },
  { src: "images/outfit-day-m4.jpg", label: "Giorno 🔥", vib: "Vibrazione 22", color: "#fbbf24" },
];

export const OutfitScene = ({ d, b }: { d: string; b: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Show outfits in pairs, cycling through
  const cycleFrame = frame % 120;
  const pairIndex = Math.floor(frame / 60) % 4;
  const pair = [outfits[pairIndex * 2], outfits[pairIndex * 2 + 1]];

  const pairOp = interpolate(cycleFrame, [0, 15, 50, 60], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Keyword highlight
  const kwDelay = 120;
  const kwOp = interpolate(frame, [kwDelay, kwDelay + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const kwScale = spring({ frame: frame - kwDelay, fps, config: { damping: 10 } });

  // Zoom effect on images
  const imgZoom = 1 + Math.sin(frame * 0.02) * 0.03;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 50 }}>
      {/* Section label */}
      <div style={{
        fontFamily: b, fontSize: 20, fontWeight: 600, color: "#f0abfc",
        textTransform: "uppercase", letterSpacing: 6, opacity: titleOp,
        marginBottom: 10, position: "absolute", top: 200,
      }}>
        👗 Outfit Personalizzato
      </div>

      {/* Title */}
      <div style={{
        fontFamily: d, fontSize: 46, fontWeight: 900, color: "white",
        textAlign: "center", lineHeight: 1.2, opacity: titleOp,
        position: "absolute", top: 260,
      }}>
        Indossa la tua
        <br />
        <span style={{
          background: "linear-gradient(135deg, #f0abfc, #a78bfa)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>energia</span>
      </div>

      {/* Outfit pair display */}
      <div style={{
        display: "flex", gap: 20, justifyContent: "center",
        marginTop: 60, opacity: pairOp,
      }}>
        {pair.map((o, i) => {
          const cardScale = spring({ frame: frame - (i * 8), fps, config: { damping: 14 } });
          return (
            <div key={`${pairIndex}-${i}`} style={{
              width: 440, borderRadius: 24, overflow: "hidden",
              background: "rgba(255,255,255,0.05)",
              border: `1px solid ${o.color}33`,
              boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 40px ${o.color}15`,
              transform: `scale(${0.85 + cardScale * 0.15})`,
            }}>
              <div style={{ overflow: "hidden", height: 580 }}>
                <Img src={staticFile(o.src)} style={{
                  width: "100%", height: 580, objectFit: "cover",
                  transform: `scale(${imgZoom})`,
                }} />
              </div>
              <div style={{ padding: "16px 22px" }}>
                <div style={{ fontFamily: b, fontSize: 22, fontWeight: 700, color: "white" }}>{o.label}</div>
                <div style={{ fontFamily: b, fontSize: 17, color: o.color, marginTop: 4 }}>{o.vib}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Keyword: ENERGIA */}
      <div style={{
        position: "absolute", bottom: 240,
        opacity: kwOp, transform: `scale(${0.7 + kwScale * 0.3})`,
      }}>
        <div style={{
          fontFamily: d, fontSize: 36, fontWeight: 900, color: "#f0abfc",
          letterSpacing: 8, textShadow: "0 0 40px rgba(240,171,252,0.5)",
        }}>
          ENERGIA
        </div>
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
          Scegli l'outfit giusto per attrarre le opportunità.
        </div>
      </div>
    </AbsoluteFill>
  );
};
