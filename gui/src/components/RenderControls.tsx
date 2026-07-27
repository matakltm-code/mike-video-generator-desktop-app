import { useState, useCallback } from "react";
import type { VideoConfig, RenderState } from "../../../shared/VideoConfig";

interface RenderControlsProps {
  config: VideoConfig;
  renderState: RenderState;
  renderProgress: number;
  renderOutputPath: string | null;
  renderError: string | null;
  onStartRender: () => void;
  onCancelRender: () => void;
}

export default function RenderControls({
  config,
  renderState,
  renderProgress,
  renderOutputPath,
  renderError,
  onStartRender,
  onCancelRender,
}: RenderControlsProps) {
  const hasElements = config.tracks.elements.length > 0;
  const hasAudio = config.tracks.audio.length > 0;

  return (
    <div style={styles.container}>
      {/* Status indicator */}
      {renderState !== "IDLE" && (
        <div style={styles.statusArea}>
          {renderState === "VALIDATING" && (
            <div style={styles.statusMsg}>
              <Spinner />
              <span>Preparing assets...</span>
            </div>
          )}

          {renderState === "RENDERING" && (
            <div style={styles.progressArea}>
              <div style={styles.progressHeader}>
                <Spinner />
                <span style={styles.progressLabel}>
                  {renderProgress < 10 ? "Bundling & Rendering..." : "Rendering..."}
                </span>
                <span style={styles.progressPct}>{renderProgress}%</span>
              </div>
              <div style={styles.progressTrack}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${renderProgress}%`,
                    transition: "width 300ms cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />
              </div>
              {renderProgress > 0 && (
                <div style={styles.progressFrameInfo}>
                  {renderProgress < 100
                    ? `${renderProgress}% complete`
                    : "Finalizing..."}
                </div>
              )}
            </div>
          )}

          {renderState === "SUCCESS" && (
            <div style={styles.successMsg}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span style={styles.successText}>Saved</span>
            </div>
          )}

          {renderState === "ERROR" && (
            <div style={styles.errorMsg}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              <span style={styles.errorText}>Failed</span>
            </div>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div style={styles.actions}>
        {(renderState === "IDLE" || renderState === "ERROR" || renderState === "SUCCESS") && (
          <button
            style={{
              ...styles.renderBtn,
              ...(!hasElements ? styles.renderBtnDisabled : {}),
            }}
            disabled={!hasElements}
            onClick={onStartRender}
            title={!hasElements ? "Add at least one element to render" : "Render video"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            {renderState === "SUCCESS" ? "Render Again" : "Render MP4"}
          </button>
        )}

        {renderState === "RENDERING" && (
          <button style={styles.cancelBtn} onClick={onCancelRender}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
            Cancel
          </button>
        )}

        {renderState === "SUCCESS" && renderOutputPath && (
          <span style={styles.pathLabel} title={renderOutputPath}>
            {renderOutputPath.split(/[/\\]/).pop()}
          </span>
        )}
      </div>

      {/* Error detail panel */}
      {renderState === "ERROR" && renderError && (
        <ErrorDetail error={renderError} />
      )}
    </div>
  );
}

// ─── Error Detail Panel ──────────────────────────────────────────────

function ErrorDetail({ error }: { error: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(error).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [error]);

  return (
    <div style={styles.errorDetail}>
      <div style={styles.errorDetailHeader}>
        <span style={styles.errorDetailTitle}>Render Error</span>
        <button style={styles.copyBtn} onClick={handleCopy} title="Copy error message">
          {copied ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
          )}
          <span style={styles.copyLabel}>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <div style={styles.errorDetailBody}>
        <pre style={styles.errorDetailText}>{error}</pre>
      </div>
    </div>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 1s linear infinite" }}>
      <circle cx="12" cy="12" r="10" strokeDasharray="31.42" strokeDashoffset="10" strokeLinecap="round" />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexShrink: 0,
    position: "relative" as const,
  },
  statusArea: {
    display: "flex",
    alignItems: "center",
  },
  statusMsg: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 12,
    color: "var(--text-muted)",
  },
  progressArea: {
    minWidth: 180,
  },
  progressHeader: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: "var(--text-muted)",
  },
  progressPct: {
    fontSize: 12,
    fontWeight: 600,
    color: "var(--accent)",
    fontFamily: "monospace",
    marginLeft: "auto",
  },
  progressFrameInfo: {
    fontSize: 10,
    color: "var(--text-muted)",
    marginTop: 2,
    textAlign: "right" as const,
  },
  progressTrack: {
    height: 4,
    background: "var(--bg-tertiary)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "var(--accent)",
    borderRadius: 2,
  },
  successMsg: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: "var(--success)",
    fontSize: 12,
    fontWeight: 600,
  },
  successText: {
    color: "var(--success)",
  },
  errorMsg: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: "var(--error)",
    fontSize: 12,
    fontWeight: 600,
  },
  errorText: {
    color: "var(--error)",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  renderBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "9px 18px",
    border: "none",
    borderRadius: "var(--radius-sm)",
    background: "var(--accent)",
    color: "#ffffff",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all var(--transition)",
    whiteSpace: "nowrap" as const,
  },
  renderBtnDisabled: {
    opacity: 0.4,
    cursor: "not-allowed",
  },
  cancelBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "9px 18px",
    border: "1px solid var(--border-color)",
    borderRadius: "var(--radius-sm)",
    background: "var(--bg-tertiary)",
    color: "var(--text-primary)",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all var(--transition)",
    whiteSpace: "nowrap" as const,
  },
  pathLabel: {
    fontSize: 11,
    color: "var(--text-muted)",
    fontFamily: "monospace",
    maxWidth: 140,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  },
  errorDetail: {
    position: "fixed" as const,
    top: "80px",
    right: 16,
    width: "min(40vw, 640px)",
    maxWidth: 640,
    minWidth: 320,
    background: "rgba(25, 5, 5, 0.95)",
    border: "1px solid rgba(239, 68, 68, 0.4)",
    borderRadius: "var(--radius-md)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
    overflow: "hidden",
    backdropFilter: "blur(12px)",
  },
  errorDetailHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 14px",
    borderBottom: "1px solid rgba(239, 68, 68, 0.2)",
    background: "rgba(239, 68, 68, 0.08)",
  },
  errorDetailTitle: {
    fontSize: 11,
    fontWeight: 600,
    color: "var(--error)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
  },
  copyBtn: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    padding: "4px 10px",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "var(--radius-sm)",
    background: "rgba(239, 68, 68, 0.1)",
    color: "var(--error)",
    fontSize: 11,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all var(--transition)",
  },
  copyLabel: {
    fontSize: 11,
    fontWeight: 500,
  },
  errorDetailBody: {
    maxHeight: "calc(100vh - 160px)",
    overflow: "auto",
    padding: "12px 14px",
  },
  errorDetailText: {
    fontSize: 11,
    color: "#fbb",
    fontFamily: "'Cascadia Code', 'Fira Code', 'JetBrains Mono', Consolas, monospace",
    whiteSpace: "pre-wrap" as const,
    wordBreak: "break-all" as const,
    lineHeight: 1.5,
    margin: 0,
  },
};
