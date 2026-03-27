import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from "remotion";

const outfits = [
  { src: "images/outfit-day-m2.jpg", label: "Look Giorno", vib: "Vibrazione 22", color: "#fbbf24" },
  { src: "images/outfit-day-m1.jpg", label: "Look Giorno", vib: "Vibrazione 7", color: "#60a5fa" },
];

export const OutfitGrid = ({ d, b }: { d: string; b: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ padding: 50, justifyContent: "center" }}>
      <div style={{
        fontFamily: b, fontSize: 22, fontWeight: 600, color: "#60a5fa",
        textTransform: "uppercase", letterSpacing: 4, textAlign: "center",
        opacity: titleOp, marginBottom: 12,
      }}>
        Look personalizzati per lui
      </div>
      <div style={{
        fontFamily: d, fontSize: 44, fontWeight: 900, color: "white",
        textAlign: "center", opacity: titleOp, marginBottom: 40, lineHeight: 1.2,
      }}>
        Ogni giorno un outfit
        <br />
        <span style={{ color: "#60a5fa" }}>in sintonia con te</span>
      </div>

      <div style={{ display: "flex", gap: 24, justifyContent: "center" }}>
        {outfits.map((o, i) => {
          const delay = 20 + i * 20;
          const scale = spring({ frame: frame - delay, fps, config: { damping: 14 } });
          const op = interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

          return (
            <div key={o.vib} style={{
              opacity: op, transform: `scale(${0.7 + scale * 0.3})`,
              width: 460, borderRadius: 28, overflow: "hidden",
              background: "rgba(255,255,255,0.05)",
              border: `1px solid ${o.color}33`,
              boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 40px ${o.color}22`,
            }}>
              <Img src={staticFile(o.src)} style={{
                width: "100%", height: 620, objectFit: "cover",
              }} />
              <div style={{ padding: "20px 24px" }}>
                <div style={{ fontFamily: b, fontSize: 22, fontWeight: 700, color: "white" }}>{o.label}</div>
                <div style={{ fontFamily: b, fontSize: 17, color: o.color, marginTop: 4 }}>{o.vib}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
