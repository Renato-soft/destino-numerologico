import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from "remotion";

export const DialogueScene = ({ d, b }: { d: string; b: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dual portraits with tilt
  const leftX = interpolate(
    spring({ frame, fps, config: { damping: 16 } }),
    [0, 1], [-400, 0]
  );
  const rightX = interpolate(
    spring({ frame: frame - 8, fps, config: { damping: 16 } }),
    [0, 1], [400, 0]
  );
  const portraitOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  // Main dialogue bubble - appears after portraits
  const bubble1Op = interpolate(frame, [35, 50], [0, 1], { extrapolateRight: "clamp" });
  const bubble1Y = interpolate(
    spring({ frame: frame - 35, fps, config: { damping: 12 } }),
    [0, 1], [40, 0]
  );

  // Second bubble
  const bubble2Op = interpolate(frame, [75, 90], [0, 1], { extrapolateRight: "clamp" });
  const bubble2Y = interpolate(
    spring({ frame: frame - 75, fps, config: { damping: 12 } }),
    [0, 1], [40, 0]
  );

  // Hearts floating
  const hearts = [0, 1, 2, 3, 4].map(i => {
    const startFrame = 50 + i * 12;
    const progress = interpolate(frame, [startFrame, startFrame + 60], [0, 1], {
      extrapolateRight: "clamp", extrapolateLeft: "clamp",
    });
    return {
      y: interpolate(progress, [0, 1], [1600, 200]),
      x: 200 + i * 180 + Math.sin(frame * 0.05 + i) * 30,
      op: interpolate(progress, [0, 0.1, 0.8, 1], [0, 0.7, 0.7, 0]),
      scale: 0.6 + Math.sin(frame * 0.08 + i) * 0.2,
    };
  });

  return (
    <AbsoluteFill style={{ background: "linear-gradient(170deg, #1a0520 0%, #0d0d1a 50%, #0a1a1a 100%)" }}>
      {/* Warm spotlight */}
      <div style={{
        position: "absolute", top: "30%", left: "50%", transform: "translate(-50%, -50%)",
        width: 700, height: 700, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(251,191,36,0.08), transparent 70%)",
      }} />

      {/* Dual portraits */}
      <div style={{
        position: "absolute", top: 160, left: 0, right: 0,
        display: "flex", justifyContent: "center", gap: 30,
        opacity: portraitOp, padding: "0 40px",
      }}>
        {/* Woman */}
        <div style={{
          transform: `translateX(${leftX}px) rotate(-5deg)`,
          width: 400, height: 500, borderRadius: 24, overflow: "hidden",
          border: "3px solid rgba(240,171,252,0.4)",
          boxShadow: "0 15px 50px rgba(0,0,0,0.5), 0 0 30px rgba(240,171,252,0.15)",
        }}>
          <Img src={staticFile("images/woman-walking.jpg")} style={{
            width: "100%", height: "100%", objectFit: "cover", objectPosition: "top",
          }} />
        </div>

        {/* Man */}
        <div style={{
          transform: `translateX(${rightX}px) rotate(5deg)`,
          width: 400, height: 500, borderRadius: 24, overflow: "hidden",
          border: "3px solid rgba(96,165,250,0.4)",
          boxShadow: "0 15px 50px rgba(0,0,0,0.5), 0 0 30px rgba(96,165,250,0.15)",
        }}>
          <Img src={staticFile("images/handsome-man.jpg")} style={{
            width: "100%", height: "100%", objectFit: "cover",
          }} />
        </div>
      </div>

      {/* Floating hearts */}
      {hearts.map((h, i) => (
        <div key={i} style={{
          position: "absolute", left: h.x, top: h.y,
          fontSize: 35, opacity: h.op, transform: `scale(${h.scale})`,
          pointerEvents: "none",
        }}>
          ❤️
        </div>
      ))}

      {/* Dialogue bubble 1 */}
      <div style={{
        position: "absolute", top: 730, left: 50, right: 50,
        opacity: bubble1Op, transform: `translateY(${bubble1Y}px)`,
      }}>
        <div style={{
          background: "linear-gradient(135deg, rgba(240,171,252,0.95), rgba(200,140,220,0.95))",
          borderRadius: 28, padding: "26px 32px",
          boxShadow: "0 10px 40px rgba(240,171,252,0.3)",
        }}>
          <p style={{
            fontFamily: d, fontSize: 38, fontWeight: 900, color: "white",
            lineHeight: 1.4, margin: 0, textAlign: "center",
            textShadow: "0 2px 10px rgba(0,0,0,0.2)",
          }}>
            "Che bello che sei!" 😍
          </p>
        </div>
        <div style={{
          width: 0, height: 0, marginLeft: 80,
          borderLeft: "12px solid transparent",
          borderRight: "12px solid transparent",
          borderTop: "16px solid rgba(240,171,252,0.95)",
        }} />
      </div>

      {/* Dialogue bubble 2 */}
      <div style={{
        position: "absolute", top: 920, left: 50, right: 50,
        opacity: bubble2Op, transform: `translateY(${bubble2Y}px)`,
      }}>
        <div style={{
          background: "rgba(255,255,255,0.95)",
          borderRadius: 28, padding: "26px 32px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
        }}>
          <p style={{
            fontFamily: d, fontSize: 34, fontWeight: 900, color: "#1a1a2e",
            lineHeight: 1.4, margin: 0, textAlign: "center",
          }}>
            "Anche lui usa l'applicazione?" 🤔✨
          </p>
        </div>
        <div style={{
          width: 0, height: 0, marginLeft: "auto", marginRight: 80,
          borderLeft: "12px solid transparent",
          borderRight: "12px solid transparent",
          borderTop: "16px solid rgba(255,255,255,0.95)",
        }} />
      </div>

      {/* Bottom hint */}
      <div style={{
        position: "absolute", bottom: 100, left: 60, right: 60,
        textAlign: "center",
        opacity: interpolate(frame, [100, 115], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        <p style={{
          fontFamily: b, fontSize: 24, color: "rgba(255,255,255,0.5)", fontWeight: 600,
        }}>
          Quando la numerologia ti veste bene... 💅
        </p>
      </div>
    </AbsoluteFill>
  );
};
