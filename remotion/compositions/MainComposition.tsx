import { AbsoluteFill, Sequence } from "remotion";
import type { AudioTrack as AudioTrackType, VideoConfig, VisualElement } from "../types";
import { TextElement } from "../components/TextElement";
import { ImageElement } from "../components/ImageElement";
import { AudioTrackComponent } from "../components/AudioTrack";

export const MainComposition: React.FC<VideoConfig> = (props) => {
  const { canvas, tracks } = props;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: canvas.backgroundColor,
      }}
    >
      {/* Audio Tracks — render outside Sequences so they span the whole composition */}
      {tracks.audio.map((track: AudioTrackType) => (
        <AudioTrackComponent key={track.id} track={track} />
      ))}

      {/* Visual Elements — each wrapped in a Sequence for time-slicing */}
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
