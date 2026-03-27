import { Composition } from "remotion";
import { EnPromoVideo } from "./EnPromoVideo";

export const EnPromoRoot = () => (
  <Composition
    id="en-promo"
    component={EnPromoVideo}
    durationInFrames={1885}
    fps={30}
    width={1080}
    height={1920}
  />
);
