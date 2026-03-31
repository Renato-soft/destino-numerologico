import { AbsoluteFill, useCurrentFrame, interpolate, Img, staticFile } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { loadFont } from "@remotion/google-fonts/Poppins";
import { loadFont as loadDisplay } from "@remotion/google-fonts/PlayfairDisplay";
import { WalkingScene } from "./scenes/WalkingScene";
import { OutfitTalkScene } from "./scenes/OutfitTalkScene";
import { EncounterScene } from "./scenes/EncounterScene";
import { DialogueScene } from "./scenes/DialogueScene";
import { SkitCTAScene } from "./scenes/SkitCTAScene";

const { fontFamily: body } = loadFont("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });
const { fontFamily: display } = loadDisplay("normal", { weights: ["700", "900"], subsets: ["latin"] });

const t = springTiming({ config: { damping: 200 }, durationInFrames: 20 });

export const StreetSkitVideo = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ fontFamily: body, overflow: "hidden", background: "#0a0a0a" }}>
      {/* Persistent warm overlay */}
      <AbsoluteFill style={{
        background: `linear-gradient(170deg, hsla(35,40%,8%,1) 0%, hsla(25,30%,5%,1) 100%)`,
      }} />

      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={110}>
          <WalkingScene d={display} b={body} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />

        <TransitionSeries.Sequence durationInFrames={130}>
          <OutfitTalkScene d={display} b={body} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={t} />

        <TransitionSeries.Sequence durationInFrames={110}>
          <EncounterScene d={display} b={body} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />

        <TransitionSeries.Sequence durationInFrames={150}>
          <DialogueScene d={display} b={body} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={t} />

        <TransitionSeries.Sequence durationInFrames={160}>
          <SkitCTAScene d={display} b={body} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
