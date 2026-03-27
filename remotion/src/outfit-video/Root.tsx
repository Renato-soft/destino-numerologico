import { Composition } from "remotion";
import { OutfitVideo } from "./OutfitVideo";

export const OutfitVideoRoot = () => (
  <Composition
    id="outfit"
    component={OutfitVideo}
    durationInFrames={540}
    fps={30}
    width={1080}
    height={1920}
  />
);
