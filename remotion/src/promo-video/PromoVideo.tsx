import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { HookScene } from "./scenes/HookScene";
import { IntroScene } from "./scenes/IntroScene";
import { DailyScene } from "./scenes/DailyScene";
import { OutfitScene } from "./scenes/OutfitScene";
import { ChatScene } from "./scenes/ChatScene";
import { CTAScene } from "./scenes/CTAScene";
import { loadFont } from "@remotion/google-fonts/Poppins";
import { loadFont as loadDisplay } from "@remotion/google-fonts/PlayfairDisplay";

const { fontFamily: bodyFont } = loadFont("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });
const { fontFamily: displayFont } = loadDisplay("normal", { weights: ["700", "900"], subsets: ["latin"] });

const transition = springTiming({ config: { damping: 200 }, durationInFrames: 25 });

// Scene durations (frames at 30fps):
// Hook: 150 (5s), Intro: 210 (7s), Daily: 240 (8s), Outfit: 300 (10s), Chat: 240 (8s), CTA: 210 (7s)
// Total raw: 1350. Transitions: 5 × 25 = 125 overlap => 1350 - 125 = 1225 frames ≈ 40.8s

export const PromoVideo = () => {
  const frame = useCurrentFrame();

  // Animated cosmic background
  const bgHue = interpolate(frame, [0, 1225], [260, 310]);
  const bg2 = interpolate(frame, [0, 1225], [220, 260]);

  return (
    <AbsoluteFill style={{ fontFamily: bodyFont, overflow: "hidden" }}>
      {/* Animated background */}
      <AbsoluteFill style={{
        background: `linear-gradient(170deg, hsl(${bgHue}, 60%, 7%) 0%, hsl(${bg2}, 50%, 11%) 40%, hsl(280, 40%, 5%) 100%)`,
      }} />

      {/* Floating orbs */}
      <FloatingOrb frame={frame} x={150} y={400} size={300} hue={270} speed={0.6} opacity={0.12} />
      <FloatingOrb frame={frame} x={800} y={1200} size={250} hue={220} speed={1.0} opacity={0.08} />
      <FloatingOrb frame={frame} x={500} y={800} size={200} hue={300} speed={0.4} opacity={0.1} />
      <FloatingOrb frame={frame} x={200} y={1500} size={180} hue={250} speed={0.7} opacity={0.09} />

      {/* Subtle grid overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(167,139,250,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,0.03) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={150}>
          <HookScene d={displayFont} b={bodyFont} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={transition} />

        <TransitionSeries.Sequence durationInFrames={210}>
          <IntroScene d={displayFont} b={bodyFont} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={transition} />

        <TransitionSeries.Sequence durationInFrames={240}>
          <DailyScene d={displayFont} b={bodyFont} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: "from-left" })} timing={transition} />

        <TransitionSeries.Sequence durationInFrames={300}>
          <OutfitScene d={displayFont} b={bodyFont} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={transition} />

        <TransitionSeries.Sequence durationInFrames={240}>
          <ChatScene d={displayFont} b={bodyFont} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={transition} />

        <TransitionSeries.Sequence durationInFrames={210}>
          <CTAScene d={displayFont} b={bodyFont} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

const FloatingOrb = ({ frame, x, y, size, hue, speed, opacity }: any) => {
  const offsetX = Math.sin(frame * 0.015 * speed) * 50;
  const offsetY = Math.cos(frame * 0.012 * speed) * 35;
  const scale = 1 + Math.sin(frame * 0.008 * speed) * 0.15;

  return (
    <div style={{
      position: "absolute", left: x + offsetX, top: y + offsetY,
      width: size, height: size, borderRadius: "50%",
      background: `radial-gradient(circle, hsla(${hue}, 70%, 50%, ${opacity}) 0%, transparent 70%)`,
      transform: `scale(${scale})`, filter: "blur(40px)",
    }} />
  );
};
