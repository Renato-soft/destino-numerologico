import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { HookScene } from "./scenes/HookScene";
import { DailyAnalysisScene } from "./scenes/DailyAnalysisScene";
import { OutfitScene } from "./scenes/OutfitScene";
import { ChatScene } from "./scenes/ChatScene";
import { CTAScene } from "./scenes/CTAScene";
import { loadFont } from "@remotion/google-fonts/Poppins";
import { loadFont as loadDisplay } from "@remotion/google-fonts/Playfair Display";

const { fontFamily: bodyFont } = loadFont("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });
const { fontFamily: displayFont } = loadDisplay("normal", { weights: ["700", "900"], subsets: ["latin"] });

const transition = springTiming({ config: { damping: 200 }, durationInFrames: 20 });

export const MainVideo = () => {
  const frame = useCurrentFrame();

  // Persistent animated background
  const bgHue = interpolate(frame, [0, 450], [260, 290]);
  const bg2 = interpolate(frame, [0, 450], [220, 250]);

  return (
    <AbsoluteFill style={{ fontFamily: bodyFont, overflow: "hidden" }}>
      {/* Animated cosmic background */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(170deg, hsl(${bgHue}, 60%, 8%) 0%, hsl(${bg2}, 50%, 12%) 40%, hsl(280, 40%, 6%) 100%)`,
        }}
      />

      {/* Floating orbs */}
      <FloatingOrb frame={frame} x={150} y={400} size={300} hue={270} speed={0.8} opacity={0.15} />
      <FloatingOrb frame={frame} x={800} y={1200} size={250} hue={220} speed={1.2} opacity={0.1} />
      <FloatingOrb frame={frame} x={500} y={800} size={180} hue={300} speed={0.5} opacity={0.12} />

      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={90}>
          <HookScene displayFont={displayFont} bodyFont={bodyFont} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={transition} />

        <TransitionSeries.Sequence durationInFrames={120}>
          <DailyAnalysisScene displayFont={displayFont} bodyFont={bodyFont} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={transition} />

        <TransitionSeries.Sequence durationInFrames={120}>
          <OutfitScene displayFont={displayFont} bodyFont={bodyFont} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={transition} />

        <TransitionSeries.Sequence durationInFrames={110}>
          <ChatScene displayFont={displayFont} bodyFont={bodyFont} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={transition} />

        <TransitionSeries.Sequence durationInFrames={90}>
          <CTAScene displayFont={displayFont} bodyFont={bodyFont} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

const FloatingOrb = ({ frame, x, y, size, hue, speed, opacity }: any) => {
  const offsetX = Math.sin(frame * 0.02 * speed) * 40;
  const offsetY = Math.cos(frame * 0.015 * speed) * 30;
  const scale = 1 + Math.sin(frame * 0.01 * speed) * 0.15;

  return (
    <div
      style={{
        position: "absolute",
        left: x + offsetX,
        top: y + offsetY,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, hsla(${hue}, 70%, 50%, ${opacity}) 0%, transparent 70%)`,
        transform: `scale(${scale})`,
        filter: "blur(40px)",
      }}
    />
  );
};
