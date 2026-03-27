import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const OutfitScene = ({ displayFont, bodyFont }: { displayFont: string; bodyFont: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Outfit cards sliding in
  const outfits = [
    { color: "#a78bfa", label: "Vibrazione 7", tip: "Viola e argento per l'introspezione" },
    { color: "#f0abfc", label: "Vibrazione 3", tip: "Rosa e oro per la creatività" },
    { color: "#60a5fa", label: "Vibrazione 1", tip: "Blu e rosso per la leadership" },
  ];

  return (
    <AbsoluteFill style={{ padding: 60, justifyContent: "center" }}>
      {/* Label */}
      <div
        style={{
          fontFamily: bodyFont,
          fontSize: 22,
          fontWeight: 600,
          color: "#f0abfc",
          textTransform: "uppercase",
          letterSpacing: 4,
          opacity: titleOp,
          marginBottom: 16,
          textAlign: "center",
        }}
      >
        Outfit del Giorno
      </div>

      <div
        style={{
          fontFamily: displayFont,
          fontSize: 48,
          fontWeight: 900,
          color: "white",
          textAlign: "center",
          opacity: titleOp,
          marginBottom: 20,
          lineHeight: 1.2,
        }}
      >
        Vestiti in sintonia
        <br />
        <span style={{ color: "#f0abfc" }}>con la tua energia</span>
      </div>

      <div
        style={{
          fontFamily: bodyFont,
          fontSize: 24,
          color: "rgba(255,255,255,0.6)",
          textAlign: "center",
          opacity: titleOp,
          marginBottom: 50,
          maxWidth: 750,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        Colori e stile personalizzati in base alla tua vibrazione personale e al tuo aspetto fisico
      </div>

      {/* Outfit suggestion cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "center" }}>
        {outfits.map((o, i) => {
          const delay = 15 + i * 14;
          const x = interpolate(
            spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 160 } }),
            [0, 1],
            [i % 2 === 0 ? -400 : 400, 0]
          );
          const op = interpolate(frame, [delay, delay + 12], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

          return (
            <div
              key={o.label}
              style={{
                width: 860,
                padding: "32px 40px",
                borderRadius: 28,
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${o.color}33`,
                display: "flex",
                alignItems: "center",
                gap: 28,
                opacity: op,
                transform: `translateX(${x}px)`,
              }}
            >
              {/* Color swatch */}
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 20,
                  background: `linear-gradient(135deg, ${o.color}, ${o.color}88)`,
                  boxShadow: `0 0 30px ${o.color}44`,
                  flexShrink: 0,
                }}
              />
              <div>
                <div style={{ fontFamily: bodyFont, fontSize: 28, fontWeight: 700, color: "white" }}>
                  {o.label}
                </div>
                <div style={{ fontFamily: bodyFont, fontSize: 22, color: "rgba(255,255,255,0.6)", marginTop: 6 }}>
                  {o.tip}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
