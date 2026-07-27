import { Composition } from "remotion";
import { MainComposition } from "./compositions/MainComposition";
import { DEFAULT_CONFIG } from "../shared/VideoConfig";
import type { VideoConfig } from "./types";

// Each composition registers a unique ID that the CLI refers to.
// The `--props` flag passes the user's VideoConfig at render time.
// `calculateMetadata` dynamically reads the actual duration/resolution
// from the props so templates longer than DEFAULT_CONFIG work correctly.
export const Root: React.FC = () => {
  const { canvas } = DEFAULT_CONFIG;

  return (
    <Composition<VideoConfig>
      id="MikeVideo"
      component={MainComposition as React.FC<Record<string, unknown>>}
      durationInFrames={canvas.durationInFrames}
      fps={canvas.fps}
      width={canvas.width}
      height={canvas.height}
      defaultProps={DEFAULT_CONFIG}
      calculateMetadata={({ props }) => ({
        durationInFrames: props.canvas.durationInFrames,
        fps: props.canvas.fps,
        width: props.canvas.width,
        height: props.canvas.height,
      })}
    />
  );
};
