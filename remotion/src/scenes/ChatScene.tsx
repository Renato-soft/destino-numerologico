import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const messages = [
  { role: "user", text: "Cosa significa il mio numero del destino?" },
  { role: "ai", text: "Il tuo numero 7 indica una profonda ricerca interiore. Sei una persona intuitiva e analitica..." },
  { role: "user", text: "Come posso sfruttare l'energia di oggi?" },
  { role: "ai", text: "Oggi la vibrazione 3 favorisce la creatività. Esprimi le tue idee con coraggio!" },
];

export const ChatScene = ({ displayFont, bodyFont }: { displayFont: string; bodyFont: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ padding: 60, justifyContent: "center" }}>
      {/* Label */}
      <div
        style={{
          fontFamily: bodyFont,
          fontSize: 22,
          fontWeight: 600,
          color: "#60a5fa",
          textTransform: "uppercase",
          letterSpacing: 4,
          opacity: titleOp,
          marginBottom: 16,
          textAlign: "center",
        }}
      >
        Assistente AI
      </div>

      <div
        style={{
          fontFamily: displayFont,
          fontSize: 48,
          fontWeight: 900,
          color: "white",
          textAlign: "center",
          opacity: titleOp,
          marginBottom: 50,
          lineHeight: 1.2,
        }}
      >
        Chiedi qualsiasi cosa
        <br />
        <span style={{ color: "#60a5fa" }}>sui tuoi numeri</span>
      </div>

      {/* Chat bubbles */}
      <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 900, margin: "0 auto", width: "100%" }}>
        {messages.map((m, i) => {
          const delay = 12 + i * 18;
          const bubbleY = interpolate(
            spring({ frame: frame - delay, fps, config: { damping: 18 } }),
            [0, 1],
            [50, 0]
          );
          const bubbleOp = interpolate(frame, [delay, delay + 12], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

          const isUser = m.role === "user";

          return (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: isUser ? "flex-end" : "flex-start",
                opacity: bubbleOp,
                transform: `translateY(${bubbleY}px)`,
              }}
            >
              <div
                style={{
                  maxWidth: 700,
                  padding: "22px 30px",
                  borderRadius: isUser ? "24px 24px 6px 24px" : "24px 24px 24px 6px",
                  background: isUser
                    ? "linear-gradient(135deg, rgba(139,92,246,0.4), rgba(167,139,250,0.25))"
                    : "rgba(255,255,255,0.08)",
                  border: isUser
                    ? "1px solid rgba(167,139,250,0.4)"
                    : "1px solid rgba(255,255,255,0.1)",
                  fontFamily: bodyFont,
                  fontSize: 24,
                  color: "rgba(255,255,255,0.9)",
                  lineHeight: 1.5,
                }}
              >
                {!isUser && (
                  <div style={{ fontSize: 14, color: "#60a5fa", fontWeight: 600, marginBottom: 6 }}>
                    ✨ Assistente Numerologico
                  </div>
                )}
                {m.text}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
