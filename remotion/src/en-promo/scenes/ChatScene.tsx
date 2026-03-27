import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const chatMessages = [
  { role: "user", text: "Is today a good day for important decisions?" },
  { role: "assistant", text: "Your Vibration 8 today favors leadership and strategic decisions. It's the perfect time to act with determination. 🎯" },
  { role: "user", text: "What colors boost my energy today?" },
  { role: "assistant", text: "With Vibration 8, go for navy blue, black, and gold — colors that radiate power and authority. ✨" },
];

export const ChatScene = ({ d, b }: { d: string; b: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [0, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // AI glow effect
  const aiGlow = 0.15 + Math.sin(frame * 0.08) * 0.1;

  // Extra text
  const extraOp = interpolate(frame, [180, 210], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const extraY = interpolate(spring({ frame: frame - 175, fps, config: { damping: 16 } }), [0, 1], [25, 0]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 50 }}>
      {/* AI glow background */}
      <div style={{
        position: "absolute", width: 400, height: 400,
        borderRadius: "50%", top: 600,
        background: `radial-gradient(circle, rgba(167,139,250,${aiGlow}), transparent 70%)`,
      }} />

      {/* Section label */}
      <div style={{
        fontFamily: b, fontSize: 20, fontWeight: 600, color: "#a78bfa",
        textTransform: "uppercase", letterSpacing: 6, opacity: titleOp,
        position: "absolute", top: 220,
      }}>
        💬 Your Personal AI Assistant
      </div>

      {/* Chat container */}
      <div style={{
        width: 900, maxHeight: 1200, display: "flex", flexDirection: "column",
        gap: 18, marginTop: 40,
      }}>
        {chatMessages.map((msg, i) => {
          const delay = 20 + i * 40;
          const op = interpolate(frame, [delay, delay + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const yOff = interpolate(spring({ frame: frame - delay, fps, config: { damping: 16 } }), [0, 1], [30, 0]);
          const isUser = msg.role === "user";

          let displayText = msg.text;
          if (!isUser && frame > delay) {
            const charsToShow = Math.min(msg.text.length, Math.floor((frame - delay) * 2.2));
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
                maxWidth: 680, padding: "18px 26px", borderRadius: 22,
                fontFamily: b, fontSize: 23, lineHeight: 1.5,
                color: isUser ? "white" : "#e2e8f0",
                background: isUser
                  ? "linear-gradient(135deg, rgba(167,139,250,0.3), rgba(96,165,250,0.2))"
                  : "rgba(255,255,255,0.06)",
                border: isUser
                  ? "1px solid rgba(167,139,250,0.3)"
                  : "1px solid rgba(255,255,255,0.08)",
                borderBottomRightRadius: isUser ? 6 : 22,
                borderBottomLeftRadius: isUser ? 22 : 6,
              }}>
                {displayText}
              </div>
            </div>
          );
        })}
      </div>

      {/* Extra text */}
      <div style={{
        position: "absolute", bottom: 280, left: 60, right: 60,
        textAlign: "center", opacity: extraOp,
        transform: `translateY(${extraY}px)`,
      }}>
        <div style={{
          fontFamily: b, fontSize: 24, color: "rgba(255,255,255,0.7)",
          lineHeight: 1.5,
        }}>
          Always by your side, ready to
          <br />reveal your full potential.
        </div>
      </div>

      {/* Keyword */}
      <div style={{
        position: "absolute", bottom: 210,
        opacity: interpolate(frame, [200, 220], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        transform: `scale(${0.7 + spring({ frame: frame - 195, fps, config: { damping: 10 } }) * 0.3})`,
      }}>
        <div style={{
          fontFamily: d, fontSize: 30, fontWeight: 900, color: "#a78bfa",
          letterSpacing: 6, textShadow: "0 0 30px rgba(167,139,250,0.5)",
        }}>
          POTENTIAL • GUIDANCE
        </div>
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
          "Your personal assistant, with tailored
          <br />answers for you, at any moment."
        </div>
      </div>
    </AbsoluteFill>
  );
};
