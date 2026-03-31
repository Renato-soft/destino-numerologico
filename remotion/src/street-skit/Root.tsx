import { Composition } from "remotion";
import { StreetSkitVideo } from "./StreetSkitVideo";

export const StreetSkitRoot = () => (
  <Composition
    id="street-skit"
    component={StreetSkitVideo}
    durationInFrames={600}
    fps={30}
    width={1080}
    height={1920}
  />
);
