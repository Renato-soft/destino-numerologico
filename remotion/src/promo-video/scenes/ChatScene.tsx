import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const chatMessages = [
  { role: "user", text: "Oggi è un buon giorno per prendere decisioni importanti?" },
  { role: "assistant", text: "La tua Vibrazione 8 di oggi favorisce leadership e decisioni strategiche. È il momento ideale per agire con determinazione. 🎯" },
  { role: "user", text: "Quali colori mi danno più energia?" },
  { role: "assistant", text: "Con la vibrazione 8, punta su blu navy, nero e oro. Colori che irradiano potere e autorevolezza. ✨" },
];

export const ChatScene = ({ d, b }: { d: string; b: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 50 }}>
      {/* Section label */}
      <div style={{
        fontFamily: b, fontSize: 20, fontWeight: 600, color: "#a78bfa",
        textTransform: "uppercase", letterSpacing: 6, opacity: titleOp,
        position: "absolute", top: 220,
      }}>
        💬 Il tuo assistente personale
      </div>

      {/* Chat container */}
      <div style={{
        width: 900, maxHeight: 1200, display: "flex", flexDirection: "column",
        gap: 20, marginTop: 40,
      }}>
        {chatMessages.map((msg, i) => {
          const delay = 15 + i * 35;
          const op = interpolate(frame, [delay, delay + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const yOff = interpolate(spring({ frame: frame - delay, fps, config: { damping: 16 } }), [0, 1], [30, 0]);
          const isUser = msg.role === "user";

          // Typing effect for assistant messages
          let displayText = msg.text;
          if (!isUser && frame > delay) {
            const charsToShow = Math.min(
              msg.text.length,
              Math.floor((frame - delay) * 2.5)
            );
            displayText = msg.text.slice(0, charsToShow);
            if (charsToShow < msg.text.length) displayText += "▍";
          }

          return (
            <div key={i} style={{
              display: "flex",
              justifyContent: isUser ? "flex-end" : "flex-start",
              opacity: op, transform: `translateY(${yOff}px)`,
            }}>
              <div style={{
                maxWidth: 700, padding: "20px 28px", borderRadius: 24,
                fontFamily: b, fontSize: 24, lineHeight: 1.5,
                color: isUser ? "white" : "#e2e8f0",
                background: isUser
                  ? "linear-gradient(135deg, rgba(167,139,250,0.3), rgba(96,165,250,0.2))"
                  : "rgba(255,255,255,0.06)",
                border: isUser
                  ? "1px solid rgba(167,139,250,0.3)"
                  : "1px solid rgba(255,255,255,0.08)",
                borderBottomRightRadius: isUser ? 6 : 24,
                borderBottomLeftRadius: isUser ? 24 : 6,
              }}>
                {displayText}
              </div>
            </div>
          );
        })}
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
          Risposte su misura, in ogni momento.
        </div>
      </div>
    </AbsoluteFill>
  );
};
