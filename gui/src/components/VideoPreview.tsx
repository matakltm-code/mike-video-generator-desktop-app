import { Player } from "@remotion/player";
import type { VideoConfig } from "../../../shared/VideoConfig";
import { MainComposition } from "../../../remotion/compositions/MainComposition";

interface VideoPreviewProps {
  config: VideoConfig;
  visible: boolean;
}

export default function VideoPreview({ config, visible }: VideoPreviewProps) {
  if (!visible) return null;

  const { canvas } = config;
  const aspectRatio = canvas.width / canvas.height;

  return (
    <div style={styles.panel}>
      {/* Header */}
      <div style={styles.panelHeader}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
        <span style={styles.panelTitle}>Preview</span>
        <span style={styles.panelBadge}>
          {canvas.width}&times;{canvas.height}
        </span>
      </div>

      {/* Player container */}
      <div style={styles.playerContainer}>
        <div
          style={{
            ...styles.playerWrapper,
            maxWidth: aspectRatio >= 1 ? "100%" : "70%",
            aspectRatio: `${canvas.width} / ${canvas.height}`,
          }}
        >
          <Player
            component={MainComposition}
            durationInFrames={canvas.durationInFrames}
            compositionWidth={canvas.width}
            compositionHeight={canvas.height}
            fps={canvas.fps}
            inputProps={config}
            controls
            autoPlay={false}
            loop
            style={styles.player}
          />
        </div>
      </div>

      {/* Timeline info */}
      <div style={styles.infoBar}>
        <span style={styles.infoText}>
          {canvas.durationInFrames} frames @ {canvas.fps}fps
        </span>
        <span style={styles.infoText}>
          {(canvas.durationInFrames / canvas.fps).toFixed(1)}s
        </span>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  panel: {
    width: 340,
    flexShrink: 0,
    background: "var(--bg-secondary)",
    borderLeft: "1px solid var(--border-color)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  panelHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 14px",
    borderBottom: "1px solid var(--border-color)",
    color: "var(--text-muted)",
    flexShrink: 0,
  },
  panelTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: "var(--text-primary)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
  },
  panelBadge: {
    marginLeft: "auto",
    fontSize: 10,
    fontWeight: 600,
    color: "var(--accent)",
    padding: "2px 8px",
    borderRadius: 999,
    background: "var(--accent-bg)",
    fontFamily: "monospace",
  },
  playerContainer: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    overflow: "hidden",
    background: "#08080a",
  },
  playerWrapper: {
    width: "100%",
    borderRadius: "var(--radius-md)",
    overflow: "hidden",
    boxShadow: "0 4px 24px rgba(0, 0, 0, 0.5)",
  },
  player: {
    width: "100%",
    height: "auto",
  },
  infoBar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 14px",
    borderTop: "1px solid var(--border-color)",
    flexShrink: 0,
  },
  infoText: {
    fontSize: 10,
    color: "var(--text-muted)",
    fontFamily: "monospace",
  },
};
