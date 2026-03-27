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
// Hook: 270 (9s), Intro: 330 (11s), Daily: 390 (13s), Outfit: 390 (13s), Chat: 330 (11s), CTA: 300 (10s)
// Total raw: 2010. Transitions: 5 × 25 = 125 overlap => 2010 - 125 = 1885 frames ≈ 62.8s

export const EnPromoVideo = () => {
  const frame = useCurrentFrame();

  const bgHue = interpolate(frame, [0, 1885], [260, 320]);
  const bg2 = interpolate(frame, [0, 1885], [220, 270]);

  return (
    <AbsoluteFill style={{ fontFamily: bodyFont, overflow: "hidden" }}>
      <AbsoluteFill style={{
        background: `linear-gradient(170deg, hsl(${bgHue}, 60%, 7%) 0%, hsl(${bg2}, 50%, 11%) 40%, hsl(280, 40%, 5%) 100%)`,
      }} />

      {/* Floating orbs */}
      <FloatingOrb frame={frame} x={150} y={400} size={300} hue={270} speed={0.6} opacity={0.12} />
      <FloatingOrb frame={frame} x={800} y={1200} size={250} hue={220} speed={1.0} opacity={0.08} />
      <FloatingOrb frame={frame} x={500} y={800} size={200} hue={300} speed={0.4} opacity={0.1} />
      <FloatingOrb frame={frame} x={200} y={1500} size={180} hue={250} speed={0.7} opacity={0.09} />
      <FloatingOrb frame={frame} x={700} y={300} size={160} hue={290} speed={0.5} opacity={0.07} />

      {/* Grid overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(167,139,250,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,0.03) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={270}>
          <HookScene d={displayFont} b={bodyFont} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={transition} />

        <TransitionSeries.Sequence durationInFrames={330}>
          <IntroScene d={displayFont} b={bodyFont} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={transition} />

        <TransitionSeries.Sequence durationInFrames={390}>
          <DailyScene d={displayFont} b={bodyFont} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: "from-left" })} timing={transition} />

        <TransitionSeries.Sequence durationInFrames={390}>
          <OutfitScene d={displayFont} b={bodyFont} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={transition} />

        <TransitionSeries.Sequence durationInFrames={330}>
          <ChatScene d={displayFont} b={bodyFont} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={transition} />

        <TransitionSeries.Sequence durationInFrames={300}>
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
