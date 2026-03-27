import { Composition } from "remotion";
import { ChatTikTokVideo } from "./ChatTikTokVideo";

export const RemotionRoot = () => (
  <Composition
    id="chat-tiktok"
    component={ChatTikTokVideo}
    durationInFrames={520}
    fps={30}
    width={1080}
    height={1920}
  />
);
