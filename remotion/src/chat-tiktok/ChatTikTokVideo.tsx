import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";
import { loadFont as loadDisplay } from "@remotion/google-fonts/PlayfairDisplay";

const { fontFamily: body } = loadFont("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });
const { fontFamily: display } = loadDisplay("normal", { weights: ["700", "900"], subsets: ["latin"] });

const chatMessages = [
  { role: "user", text: "Non so se accettare questa offerta di lavoro... cosa mi consigli?" },
  { role: "ai", text: "Con il tuo Numero del Destino 7 e l'Anno Personale 1, questo è il momento ideale per nuovi inizi. La tua intuizione ti guida bene — fidati! 🎯" },
  { role: "user", text: "E per quanto riguarda il tempismo?" },
  { role: "ai", text: "La vibrazione di oggi è 8: potere e decisione. È il giorno perfetto per agire con sicurezza. Le stelle sono dalla tua parte! ✨" },
];

const HookScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = interpolate(spring({ frame, fps, config: { damping: 12 } }), [0, 1], [0.3, 1]);
  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  const subtitleOp = interpolate(frame, [25, 50], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const subtitleY = interpolate(spring({ frame: frame - 20, fps, config: { damping: 15 } }), [0, 1], [40, 0]);

  const questionOp = interpolate(frame, [50, 75], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Floating pulse
  const pulse = 0.8 + Math.sin(frame * 0.06) * 0.2;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 60 }}>
      {/* Glowing circle */}
      <div style={{
        position: "absolute", width: 350, height: 350, borderRadius: "50%",
        background: `radial-gradient(circle, rgba(139,92,246,${0.25 * pulse}), transparent 70%)`,
        top: 500, filter: "blur(30px)",
      }} />

      {/* Question mark icon */}
      <div style={{
        fontSize: 120, opacity: titleOp, transform: `scale(${titleScale})`,
        marginBottom: 30, filter: `drop-shadow(0 0 30px rgba(167,139,250,0.6))`,
      }}>
        🤔
      </div>

      {/* Title */}
      <div style={{
        fontFamily: display, fontSize: 58, fontWeight: 900, color: "white",
        textAlign: "center", lineHeight: 1.2, opacity: titleOp,
        transform: `scale(${titleScale})`,
        textShadow: "0 4px 30px rgba(0,0,0,0.5)",
      }}>
        Non sai che
        <br />
        <span style={{ color: "#a78bfa" }}>decisione</span>
        <br />prendere?
      </div>

      {/* Subtitle */}
      <div style={{
        fontFamily: body, fontSize: 28, color: "rgba(255,255,255,0.8)",
        textAlign: "center", marginTop: 30, lineHeight: 1.5,
        opacity: subtitleOp, transform: `translateY(${subtitleY}px)`,
      }}>
        Il tuo Esperto AI è qui per te.
      </div>

      {/* Swipe hint */}
      <div style={{
        position: "absolute", bottom: 200,
        opacity: questionOp,
        transform: `translateY(${Math.sin(frame * 0.08) * 8}px)`,
      }}>
        <div style={{
          fontFamily: body, fontSize: 20, color: "rgba(167,139,250,0.7)",
          letterSpacing: 3, textTransform: "uppercase",
        }}>
          ▼ Guarda come funziona
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ChatScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // AI glow
  const glow = 0.12 + Math.sin(frame * 0.07) * 0.08;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 40 }}>
      {/* AI glow */}
      <div style={{
        position: "absolute", width: 500, height: 500, borderRadius: "50%",
        background: `radial-gradient(circle, rgba(139,92,246,${glow}), transparent 70%)`,
        top: 600, filter: "blur(50px)",
      }} />

      {/* Section label */}
      <div style={{
        fontFamily: body, fontSize: 18, fontWeight: 700, color: "#a78bfa",
        textTransform: "uppercase", letterSpacing: 5, opacity: labelOp,
        position: "absolute", top: 180,
      }}>
        💬 Esperto AI in azione
      </div>

      {/* Chat container */}
      <div style={{
        width: 960, display: "flex", flexDirection: "column", gap: 16, marginTop: 20,
      }}>
        {chatMessages.map((msg, i) => {
          const delay = 10 + i * 50;
          const op = interpolate(frame, [delay, delay + 18], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
          const yOff = interpolate(spring({ frame: frame - delay, fps, config: { damping: 16 } }), [0, 1], [35, 0]);
          const isUser = msg.role === "user";

          // Typing effect for AI
          let displayText = msg.text;
          if (!isUser && frame > delay) {
            const chars = Math.min(msg.text.length, Math.floor((frame - delay) * 3));
            displayText = msg.text.slice(0, chars);
            if (chars < msg.text.length) displayText += "▍";
          }

          return (
            <div key={i} style={{
              display: "flex", justifyContent: isUser ? "flex-end" : "flex-start",
              opacity: op, transform: `translateY(${yOff}px)`,
            }}>
              <div style={{
                maxWidth: 750, padding: "20px 28px", borderRadius: 24,
                fontFamily: body, fontSize: 25, lineHeight: 1.55,
                color: isUser ? "white" : "#e2e8f0",
                background: isUser
                  ? "linear-gradient(135deg, rgba(139,92,246,0.35), rgba(96,165,250,0.2))"
                  : "rgba(255,255,255,0.07)",
                border: isUser
                  ? "1px solid rgba(167,139,250,0.35)"
                  : "1px solid rgba(255,255,255,0.1)",
                borderBottomRightRadius: isUser ? 6 : 24,
                borderBottomLeftRadius: isUser ? 24 : 6,
              }}>
                {!isUser && (
                  <div style={{ fontSize: 14, color: "#a78bfa", fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>
                    ✨ Esperto AI
                  </div>
                )}
                {displayText}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const CTAScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mainScale = interpolate(spring({ frame, fps, config: { damping: 10 } }), [0, 1], [0.5, 1]);
  const mainOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  const textOp = interpolate(frame, [20, 45], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const textY = interpolate(spring({ frame: frame - 15, fps, config: { damping: 14 } }), [0, 1], [30, 0]);

  const ctaOp = interpolate(frame, [45, 65], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const ctaPulse = 1 + Math.sin(frame * 0.1) * 0.03;

  const subOp = interpolate(frame, [60, 80], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 60 }}>
      {/* Glow */}
      <div style={{
        position: "absolute", width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139,92,246,0.2), transparent 70%)",
        filter: "blur(60px)",
      }} />

      {/* Icon */}
      <div style={{
        fontSize: 90, opacity: mainOp, transform: `scale(${mainScale})`,
        marginBottom: 30,
      }}>
        🔮
      </div>

      {/* Main text */}
      <div style={{
        fontFamily: display, fontSize: 50, fontWeight: 900, color: "white",
        textAlign: "center", lineHeight: 1.25, opacity: mainOp,
        transform: `scale(${mainScale})`,
        textShadow: "0 4px 30px rgba(0,0,0,0.5)",
      }}>
        Il tuo consulente
        <br /><span style={{ color: "#a78bfa" }}>sempre a portata</span>
        <br />di mano
      </div>

      {/* Description */}
      <div style={{
        fontFamily: body, fontSize: 26, color: "rgba(255,255,255,0.75)",
        textAlign: "center", marginTop: 30, lineHeight: 1.5, maxWidth: 800,
        opacity: textOp, transform: `translateY(${textY}px)`,
      }}>
        Conosce la tua mappa e ti dà consigli
        <br />personalizzati come un vero consulente.
      </div>

      {/* CTA button */}
      <div style={{
        marginTop: 50, opacity: ctaOp, transform: `scale(${ctaPulse})`,
      }}>
        <div style={{
          fontFamily: body, fontSize: 26, fontWeight: 700, color: "white",
          background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
          padding: "20px 60px", borderRadius: 50,
          boxShadow: "0 8px 30px rgba(139,92,246,0.4)",
          letterSpacing: 1,
        }}>
          Scarica l'App Gratis →
        </div>
      </div>

      {/* Sub */}
      <div style={{
        fontFamily: body, fontSize: 18, color: "rgba(167,139,250,0.7)",
        marginTop: 20, letterSpacing: 2, textTransform: "uppercase",
        opacity: subOp,
      }}>
        Destino Numerologico
      </div>
    </AbsoluteFill>
  );
};

// Main composition: Hook(100) + Chat(300) + CTA(120) = 520 frames ~17s
export const ChatTikTokVideo = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const bgHue = interpolate(frame, [0, durationInFrames], [260, 300]);
  const bg2 = interpolate(frame, [0, durationInFrames], [230, 270]);

  return (
    <AbsoluteFill style={{ fontFamily: body, overflow: "hidden" }}>
      {/* Animated gradient background */}
      <AbsoluteFill style={{
        background: `linear-gradient(170deg, hsl(${bgHue}, 55%, 6%) 0%, hsl(${bg2}, 45%, 10%) 45%, hsl(275, 35%, 5%) 100%)`,
      }} />

      {/* Floating orbs */}
      <Orb frame={frame} x={100} y={350} size={280} hue={270} speed={0.5} opacity={0.1} />
      <Orb frame={frame} x={750} y={1100} size={220} hue={220} speed={0.8} opacity={0.07} />
      <Orb frame={frame} x={400} y={1600} size={200} hue={300} speed={0.4} opacity={0.09} />

      {/* Grid overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(167,139,250,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,0.025) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      {/* Scenes */}
      <Sequence from={0} durationInFrames={100}>
        <HookScene />
      </Sequence>
      <Sequence from={100} durationInFrames={300}>
        <ChatScene />
      </Sequence>
      <Sequence from={400} durationInFrames={120}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};

const Orb = ({ frame, x, y, size, hue, speed, opacity }: any) => {
  const ox = Math.sin(frame * 0.015 * speed) * 40;
  const oy = Math.cos(frame * 0.012 * speed) * 30;
  const s = 1 + Math.sin(frame * 0.008 * speed) * 0.12;
  return (
    <div style={{
      position: "absolute", left: x + ox, top: y + oy, width: size, height: size,
      borderRadius: "50%",
      background: `radial-gradient(circle, hsla(${hue},70%,50%,${opacity}) 0%, transparent 70%)`,
      transform: `scale(${s})`, filter: "blur(35px)",
    }} />
  );
};
