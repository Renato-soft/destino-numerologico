import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";

// TikTok: 1080x1920, 30fps, ~20 seconds
// Scenes: Hook(90) + DailyAnalysis(120) + Outfit(120) + Chat(110) + CTA(90) = 530
// Transitions: 4 × 20 = 80 overlap => 530 - 80 = 450 frames = 15s
export const RemotionRoot = () => (
  <Composition
    id="main"
    component={MainVideo}
    durationInFrames={450}
    fps={30}
    width={1080}
    height={1920}
  />
);
