import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from "remotion";

export const WalkingScene = ({ d, b }: { d: string; b: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slow pan on background
  const bgX = interpolate(frame, [0, 110], [0, -60]);
  const bgScale = interpolate(frame, [0, 110], [1.15, 1.2]);

  // Woman image parallax (slower pan, creates depth)
  const womanX = interpolate(frame, [0, 110], [-30, 30]);
  const womanOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const womanScale = interpolate(frame, [0, 110], [1, 1.05]);

  // Text speech bubble
  const bubbleOp = interpolate(frame, [30, 45], [0, 1], { extrapolateRight: "clamp" });
  const bubbleY = interpolate(
    spring({ frame: frame - 30, fps, config: { damping: 14, stiffness: 120 } }),
    [0, 1], [40, 0]
  );

  // Subtitle bar
  const subOp = interpolate(frame, [50, 62], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      {/* Background street */}
      <Img
        src={staticFile("images/sicilian-street.jpg")}
        style={{
          position: "absolute", width: "120%", height: "100%",
          objectFit: "cover", transform: `translateX(${bgX}px) scale(${bgScale})`,
          filter: "brightness(0.6) saturate(1.2)",
        }}
      />

      {/* Warm golden overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(255,180,60,0.1) 0%, transparent 40%, rgba(0,0,0,0.5) 100%)",
      }} />

      {/* Woman walking */}
      <div style={{
        position: "absolute", bottom: 0, left: "50%",
        transform: `translateX(calc(-50% + ${womanX}px)) scale(${womanScale})`,
        opacity: womanOp, width: 650, height: 1400,
      }}>
        <Img
          src={staticFile("images/woman-walking.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
        />
        {/* Fade bottom */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 200,
          background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
        }} />
      </div>

      {/* Speech thought bubble */}
      <div style={{
        position: "absolute", top: 180, left: 60, right: 60,
        opacity: bubbleOp, transform: `translateY(${bubbleY}px)`,
      }}>
        <div style={{
          background: "rgba(255,255,255,0.95)", borderRadius: 28, padding: "24px 32px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
        }}>
          <p style={{
            fontFamily: b, fontSize: 28, color: "#1a1a2e", fontWeight: 600,
            lineHeight: 1.4, margin: 0,
          }}>
            💭 "Oggi l'app mi ha suggerito questo outfit incredibile..."
          </p>
        </div>
        {/* Bubble tail */}
        <div style={{
          width: 0, height: 0, marginLeft: 100,
          borderLeft: "15px solid transparent",
          borderRight: "15px solid transparent",
          borderTop: "20px solid rgba(255,255,255,0.95)",
        }} />
      </div>

      {/* Bottom subtitle */}
      <div style={{
        position: "absolute", bottom: 120, left: 40, right: 40,
        opacity: subOp, textAlign: "center",
      }}>
        <p style={{
          fontFamily: d, fontSize: 36, fontWeight: 900, color: "white",
          textShadow: "0 2px 20px rgba(0,0,0,0.8)",
        }}>
          Passeggiata in Sicilia ☀️
        </p>
      </div>
    </AbsoluteFill>
  );
};
