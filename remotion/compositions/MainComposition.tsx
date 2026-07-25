import { AbsoluteFill, Sequence } from "remotion";
import type { AudioTrack as AudioTrackType, VideoConfig, VisualElement, SceneBackground } from "../types";
import { TextElement } from "../components/TextElement";
import { ImageElement } from "../components/ImageElement";
import { AudioTrackComponent } from "../components/AudioTrack";

export const MainComposition: React.FC<VideoConfig> = (props) => {
  const { canvas, tracks } = props;

  return (
    <AbsoluteFill>
      {/* Scene backgrounds — each scene is a colored fullscreen div */}
      {renderScenes(canvas.scenes, canvas.backgroundColor, canvas.durationInFrames)}

      {/* Audio Tracks */}
      {tracks.audio.map((track: AudioTrackType) => (
        <AudioTrackComponent key={track.id} track={track} />
      ))}

      {/* Visual Elements */}
      {tracks.elements.map((el: VisualElement) => (
        <Sequence
          key={el.id}
          from={el.from}
          durationInFrames={el.durationInFrames}
        >
          {el.type === "text" && (
            <TextElement element={el} fps={canvas.fps} />
          )}
          {el.type === "image" && (
            <ImageElement element={el} />
          )}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

/**
 * Renders scene-based backgrounds or falls back to a single solid color.
 * Each scene is a full-screen AbsoluteFill wrapped in a Sequence so backgrounds
 * transition automatically at the specified frame boundaries.
 */
function renderScenes(
  scenes: SceneBackground[] | undefined,
  fallbackColor: string,
  totalDuration: number
): React.ReactNode {
  if (!scenes || scenes.length === 0) {
    return (
      <AbsoluteFill style={{ backgroundColor: fallbackColor }} />
    );
  }

  // Build intervals: (from, untilNextFrom, color)
  const intervals: { from: number; durationInFrames: number; color: string }[] = [];
  for (let i = 0; i < scenes.length; i++) {
    const current = scenes[i];
    const next = scenes[i + 1];
    intervals.push({
      from: current.from,
      durationInFrames: next ? next.from - current.from : totalDuration - current.from,
      color: current.color,
    });
  }

  return (
    <>
      {intervals.map((interval, idx) => (
        <Sequence
          key={`scene-${idx}`}
          from={interval.from}
          durationInFrames={interval.durationInFrames}
        >
          <AbsoluteFill style={{ backgroundColor: interval.color }} />
        </Sequence>
      ))}
    </>
  );
}
