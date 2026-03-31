import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from "remotion";

export const OutfitTalkScene = ({ d, b }: { d: string; b: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(
    spring({ frame, fps, config: { damping: 15 } }),
    [0, 1], [50, 0]
  );

  // Outfit cards stagger
  const card1Scale = spring({ frame: frame - 20, fps, config: { damping: 12 } });
  const card1Op = interpolate(frame, [20, 35], [0, 1], { extrapolateRight: "clamp" });

  const card2Scale = spring({ frame: frame - 40, fps, config: { damping: 12 } });
  const card2Op = interpolate(frame, [40, 55], [0, 1], { extrapolateRight: "clamp" });

  // Speech bubble
  const speechOp = interpolate(frame, [65, 80], [0, 1], { extrapolateRight: "clamp" });
  const speechY = interpolate(
    spring({ frame: frame - 65, fps, config: { damping: 14 } }),
    [0, 1], [30, 0]
  );

  // Floating sparkles
  const sparkle1 = Math.sin(frame * 0.1) * 10;
  const sparkle2 = Math.cos(frame * 0.08) * 15;

  return (
    <AbsoluteFill style={{ background: "linear-gradient(170deg, #1a0a2e 0%, #0d0d1a 50%, #1a1a0a 100%)" }}>
      {/* Warm glow */}
      <div style={{
        position: "absolute", top: 200, left: "50%", transform: "translateX(-50%)",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,180,60,0.12), transparent 70%)",
        filter: "blur(20px)",
      }} />

      {/* Title */}
      <div style={{
        position: "absolute", top: 100, left: 60, right: 60,
        opacity: titleOp, transform: `translateY(${titleY}px)`, textAlign: "center",
      }}>
        <p style={{
          fontFamily: b, fontSize: 22, fontWeight: 600, color: "#f0abfc",
          textTransform: "uppercase", letterSpacing: 4, margin: 0,
        }}>
          ✨ Outfit del Giorno
        </p>
        <p style={{
          fontFamily: d, fontSize: 46, fontWeight: 900, color: "white",
          lineHeight: 1.2, marginTop: 12,
        }}>
          Generato dall'app{"\n"}
          <span style={{ color: "#fbbf24" }}>per la mia vibrazione</span>
        </p>
      </div>

      {/* Outfit cards */}
      <div style={{
        position: "absolute", top: 380, left: 0, right: 0,
        display: "flex", justifyContent: "center", gap: 20, padding: "0 40px",
      }}>
        <div style={{
          opacity: card1Op, transform: `scale(${0.7 + card1Scale * 0.3}) rotate(-3deg)`,
          width: 460, borderRadius: 24, overflow: "hidden",
          border: "2px solid rgba(251,191,36,0.3)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(251,191,36,0.1)",
        }}>
          <Img src={staticFile("images/outfit-today-1.avif")} style={{
            width: "100%", height: 550, objectFit: "cover",
          }} />
          <div style={{
            padding: "14px 18px", background: "rgba(15,15,25,0.9)",
          }}>
            <p style={{ fontFamily: b, fontSize: 20, fontWeight: 700, color: "white", margin: 0 }}>
              Look Giorno ☀️
            </p>
          </div>
        </div>

        <div style={{
          opacity: card2Op, transform: `scale(${0.7 + card2Scale * 0.3}) rotate(3deg)`,
          width: 460, borderRadius: 24, overflow: "hidden",
          border: "2px solid rgba(167,139,250,0.3)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(167,139,250,0.1)",
        }}>
          <Img src={staticFile("images/outfit-today-2.avif")} style={{
            width: "100%", height: 550, objectFit: "cover",
          }} />
          <div style={{
            padding: "14px 18px", background: "rgba(15,15,25,0.9)",
          }}>
            <p style={{ fontFamily: b, fontSize: 20, fontWeight: 700, color: "white", margin: 0 }}>
              Look Sera 🌙
            </p>
          </div>
        </div>
      </div>

      {/* Speech bubble */}
      <div style={{
        position: "absolute", bottom: 200, left: 50, right: 50,
        opacity: speechOp, transform: `translateY(${speechY}px)`,
      }}>
        <div style={{
          background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "22px 28px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
        }}>
          <p style={{
            fontFamily: b, fontSize: 26, color: "#1a1a2e", fontWeight: 600,
            lineHeight: 1.5, margin: 0, textAlign: "center",
          }}>
            "Guarda che belli! 😍 Basati sui miei numeri e il mio aspetto..."
          </p>
        </div>
      </div>

      {/* Floating sparkles */}
      <div style={{
        position: "absolute", top: 350 + sparkle1, right: 80, fontSize: 40, opacity: 0.6,
      }}>✨</div>
      <div style={{
        position: "absolute", bottom: 450 + sparkle2, left: 60, fontSize: 30, opacity: 0.4,
      }}>💫</div>
    </AbsoluteFill>
  );
};
