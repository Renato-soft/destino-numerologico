import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from "remotion";

export const EncounterScene = ({ d, b }: { d: string; b: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background slow zoom
  const bgScale = interpolate(frame, [0, 110], [1.1, 1.2]);

  // Man slides in from right
  const manX = interpolate(
    spring({ frame: frame - 10, fps, config: { damping: 18, stiffness: 80 } }),
    [0, 1], [400, 0]
  );
  const manOp = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp" });

  // Heart eyes reaction
  const heartScale = spring({ frame: frame - 45, fps, config: { damping: 6, stiffness: 80 } });
  const heartOp = interpolate(frame, [45, 55], [0, 1], { extrapolateRight: "clamp" });

  // "!" reaction
  const exclOp = interpolate(frame, [35, 42], [0, 1], { extrapolateRight: "clamp" });
  const exclScale = spring({ frame: frame - 35, fps, config: { damping: 8 } });

  // Text "Ma guarda chi c'è..."
  const textOp = interpolate(frame, [55, 68], [0, 1], { extrapolateRight: "clamp" });
  const textY = interpolate(
    spring({ frame: frame - 55, fps, config: { damping: 14 } }),
    [0, 1], [30, 0]
  );

  return (
    <AbsoluteFill>
      {/* Background */}
      <Img
        src={staticFile("images/sicilian-street.jpg")}
        style={{
          position: "absolute", width: "120%", height: "100%",
          objectFit: "cover", transform: `scale(${bgScale})`,
          filter: "brightness(0.5) saturate(1.3)",
        }}
      />
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, transparent 20%, rgba(0,0,0,0.6) 100%)",
      }} />

      {/* Man portrait */}
      <div style={{
        position: "absolute", bottom: 100, left: "50%",
        transform: `translateX(calc(-50% + ${manX}px))`,
        opacity: manOp, width: 700, height: 1200,
        borderRadius: 30, overflow: "hidden",
        boxShadow: "0 20px 80px rgba(0,0,0,0.6)",
      }}>
        <Img
          src={staticFile("images/handsome-man.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {/* Warm glow on man */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, transparent 50%, rgba(251,191,36,0.15) 100%)",
        }} />
      </div>

      {/* Exclamation mark reaction */}
      <div style={{
        position: "absolute", top: 250, right: 120,
        opacity: exclOp, transform: `scale(${exclScale})`,
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          background: "rgba(251,191,36,0.9)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 30px rgba(251,191,36,0.5)",
        }}>
          <span style={{ fontSize: 50, color: "white" }}>❗</span>
        </div>
      </div>

      {/* Heart eyes */}
      <div style={{
        position: "absolute", top: 350, left: 100,
        opacity: heartOp, transform: `scale(${heartScale})`,
        fontSize: 80,
      }}>
        😍
      </div>

      {/* Text */}
      <div style={{
        position: "absolute", top: 100, left: 60, right: 60,
        opacity: textOp, transform: `translateY(${textY}px)`,
        textAlign: "center",
      }}>
        <p style={{
          fontFamily: d, fontSize: 48, fontWeight: 900, color: "white",
          textShadow: "0 4px 30px rgba(0,0,0,0.8)",
          lineHeight: 1.3,
        }}>
          Ma guarda chi c'è... 👀
        </p>
      </div>
    </AbsoluteFill>
  );
};
