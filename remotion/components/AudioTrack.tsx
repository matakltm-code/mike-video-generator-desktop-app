import { Audio } from "remotion";
import type { AudioTrack as AudioTrackType } from "../types";

interface AudioTrackProps {
  track: AudioTrackType;
}

export const AudioTrackComponent: React.FC<AudioTrackProps> = ({ track }) => {
  return (
    <Audio
      src={track.src}
      startFrom={track.trimBefore ?? 0}
      endAt={track.trimAfter ?? track.durationInFrames}
      volume={track.volume ?? 1}
    />
  );
};
