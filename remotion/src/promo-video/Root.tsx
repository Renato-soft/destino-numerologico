import { Composition } from "remotion";
import { PromoVideo } from "./PromoVideo";

export const PromoVideoRoot = () => (
  <Composition
    id="promo"
    component={PromoVideo}
    durationInFrames={1225}
    fps={30}
    width={1080}
    height={1920}
  />
);
