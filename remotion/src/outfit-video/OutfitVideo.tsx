import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { loadFont } from "@remotion/google-fonts/Poppins";
import { loadFont as loadDisplay } from "@remotion/google-fonts/PlayfairDisplay";
import { HookScene } from "./scenes/HookScene";
import { VibrationScene } from "./scenes/VibrationScene";
import { OutfitShowcase } from "./scenes/OutfitShowcase";
import { OutfitGrid } from "./scenes/OutfitGrid";
import { CTAScene } from "./scenes/CTAScene";

const { fontFamily: body } = loadFont("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });
const { fontFamily: display } = loadDisplay("normal", { weights: ["700", "900"], subsets: ["latin"] });

const t = springTiming({ config: { damping: 200 }, durationInFrames: 20 });

export const OutfitVideo = () => {
  const frame = useCurrentFrame();
  const hue1 = interpolate(frame, [0, 540], [265, 300]);
  const hue2 = interpolate(frame, [0, 540], [220, 260]);

  return (
    <AbsoluteFill style={{ fontFamily: body, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `linear-gradient(170deg, hsl(${hue1},55%,7%) 0%, hsl(${hue2},45%,11%) 45%, hsl(280,35%,5%) 100%)`,
        }}
      />
      {/* Floating orbs */}
      <Orb frame={frame} x={100} y={300} size={350} hue={270} speed={0.7} op={0.12} />
      <Orb frame={frame} x={750} y={1100} size={280} hue={320} speed={1.1} op={0.1} />
      <Orb frame={frame} x={400} y={1600} size={200} hue={200} speed={0.5} op={0.08} />

      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={90}>
          <HookScene d={display} b={body} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />

        <TransitionSeries.Sequence durationInFrames={100}>
          <VibrationScene d={display} b={body} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={t} />

        <TransitionSeries.Sequence durationInFrames={150}>
          <OutfitShowcase d={display} b={body} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />

        <TransitionSeries.Sequence durationInFrames={130}>
          <OutfitGrid d={display} b={body} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={t} />

        <TransitionSeries.Sequence durationInFrames={130}>
          <CTAScene d={display} b={body} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

const Orb = ({ frame, x, y, size, hue, speed, op }: any) => {
  const ox = Math.sin(frame * 0.02 * speed) * 40;
  const oy = Math.cos(frame * 0.015 * speed) * 30;
  const s = 1 + Math.sin(frame * 0.01 * speed) * 0.15;
  return (
    <div
      style={{
        position: "absolute",
        left: x + ox,
        top: y + oy,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, hsla(${hue},70%,50%,${op}) 0%, transparent 70%)`,
        transform: `scale(${s})`,
        filter: "blur(40px)",
      }}
    />
  );
};
