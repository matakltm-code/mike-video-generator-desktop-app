import type { VisualElement, AudioTrack, ImageElement } from "../../../shared/VideoConfig";

interface AssetUploaderProps {
  elements: VisualElement[];
  audioTracks: AudioTrack[];
  onAddImage: () => void;
  onAddAudio: () => void;
  onRemoveElement: (id: string) => void;
  onRemoveAudioTrack: (id: string) => void;
  onUpdateElement: (id: string, updates: Partial<VisualElement>) => void;
  onUpdateAudioTrack?: (id: string, updates: Partial<AudioTrack>) => void;
}

export default function AssetUploader({
  elements,
  audioTracks,
  onAddImage,
  onAddAudio,
  onRemoveElement,
  onRemoveAudioTrack,
  onUpdateElement,
  onUpdateAudioTrack,
}: AssetUploaderProps) {
  const images = elements.filter((el): el is ImageElement => el.type === "image");

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.title}>Assets</h2>
      </div>

      {/* Images */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>Images</h3>
          <button style={styles.addBtn} onClick={onAddImage}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Upload Image
          </button>
        </div>

        {images.length === 0 ? (
          <div style={styles.emptyState}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
              <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
            </svg>
            <p style={styles.emptyText}>No images uploaded yet</p>
            <p style={styles.emptySubtext}>Upload images to overlay on your video</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {images.map((img) => (
              <div key={img.id} style={styles.assetCard}>
                <div style={styles.thumbnail}>
                  <img
                    src={img.src}
                    alt="Uploaded"
                    style={styles.thumbImg}
                  />
                </div>
                <div style={styles.assetInfo}>
                  <span style={styles.assetName}>{img.src.split(/[/\\]/).pop()}</span>
                  <div style={styles.assetControls}>
                    <label style={styles.smallField}>
                      <span style={styles.smallLabel}>X</span>
                      <input
                        type="number"
                        value={img.position.x}
                        onChange={(e) => onUpdateElement(img.id, { position: { ...img.position, x: Number(e.target.value) } })}
                        style={styles.smallInput}
                      />
                    </label>
                    <label style={styles.smallField}>
                      <span style={styles.smallLabel}>Y</span>
                      <input
                        type="number"
                        value={img.position.y}
                        onChange={(e) => onUpdateElement(img.id, { position: { ...img.position, y: Number(e.target.value) } })}
                        style={styles.smallInput}
                      />
                    </label>
                    <label style={styles.smallField}>
                      <span style={styles.smallLabel}>W</span>
                      <input
                        type="number"
                        value={img.size?.width ?? "auto"}
                        onChange={(e) => onUpdateElement(img.id, { size: { ...(img.size || {}), width: Number(e.target.value) } })}
                        style={styles.smallInput}
                      />
                    </label>
                  </div>
                </div>
                <button
                  style={styles.removeBtn}
                  onClick={() => onRemoveElement(img.id)}
                  title="Remove image"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Audio */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>Audio</h3>
          <button style={styles.addBtn} onClick={onAddAudio}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Music
          </button>
        </div>

        {audioTracks.length === 0 ? (
          <div style={styles.emptyState}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
              <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
            </svg>
            <p style={styles.emptyText}>No audio tracks yet</p>
            <p style={styles.emptySubtext}>Add background music to your video</p>
          </div>
        ) : (
          <div style={styles.audioList}>
            {audioTracks.map((track) => (
              <div key={track.id} style={styles.audioCard}>
                <div style={styles.audioIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                  </svg>
                </div>
                <div style={styles.audioInfo}>
                  <span style={styles.assetName}>{track.src.split(/[/\\]/).pop()}</span>
                  <div style={styles.audioControls}>
                    <label style={styles.smallField}>
                      <span style={styles.smallLabel}>Vol</span>
                      <input
                        type="number"
                        min={0}
                        max={1}
                        step={0.1}
                        value={track.volume ?? 0.7}
                        onChange={(e) => onUpdateAudioTrack?.(track.id, { volume: Number(e.target.value) })}
                        style={styles.smallInput}
                      />
                    </label>
                    <label style={styles.checkLabel}>
                      <input
                        type="checkbox"
                        checked={track.loop ?? false}
                        onChange={(e) => onUpdateAudioTrack?.(track.id, { loop: e.target.checked })}
                        style={styles.checkbox}
                      />
                      <span style={styles.checkText}>Loop</span>
                    </label>
                  </div>
                </div>
                <button
                  style={styles.removeBtn}
                  onClick={() => onRemoveAudioTrack(track.id)}
                  title="Remove audio"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 600,
    color: "var(--text-primary)",
    letterSpacing: "-0.02em",
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: "var(--text-secondary)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  },
  addBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 12px",
    border: "1px solid var(--border-color)",
    borderRadius: "var(--radius-sm)",
    background: "var(--bg-tertiary)",
    color: "var(--text-primary)",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all var(--transition)",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 24px",
    background: "var(--bg-secondary)",
    border: "1px dashed var(--border-color)",
    borderRadius: "var(--radius-md)",
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "var(--text-muted)",
    fontWeight: 500,
  },
  emptySubtext: {
    fontSize: 12,
    color: "var(--text-muted)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 12,
  },
  assetCard: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: 12,
    background: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    borderRadius: "var(--radius-md)",
    transition: "border-color var(--transition)",
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: "var(--radius-sm)",
    overflow: "hidden",
    flexShrink: 0,
    background: "var(--bg-tertiary)",
  },
  thumbImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  assetInfo: {
    flex: 1,
    minWidth: 0,
  },
  assetName: {
    fontSize: 12,
    color: "var(--text-primary)",
    fontWeight: 500,
    display: "block",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    marginBottom: 6,
  },
  assetControls: {
    display: "flex",
    gap: 8,
  },
  smallField: {
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  smallLabel: {
    fontSize: 10,
    fontWeight: 600,
    color: "var(--text-muted)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  },
  smallInput: {
    width: 48,
    padding: "3px 6px",
    border: "1px solid var(--border-color)",
    borderRadius: "4px",
    background: "var(--bg-tertiary)",
    color: "var(--text-primary)",
    fontSize: 12,
    outline: "none",
    textAlign: "center" as const,
  },
  removeBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    border: "none",
    borderRadius: "var(--radius-sm)",
    background: "transparent",
    color: "var(--text-muted)",
    cursor: "pointer",
    transition: "all var(--transition)",
    flexShrink: 0,
  },
  audioList: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  audioCard: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 12px",
    background: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    borderRadius: "var(--radius-md)",
  },
  audioIcon: {
    color: "var(--accent)",
    flexShrink: 0,
  },
  audioInfo: {
    flex: 1,
    minWidth: 0,
  },
  audioControls: {
    display: "flex",
    gap: 12,
    marginTop: 4,
  },
  checkLabel: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    cursor: "pointer",
  },
  checkbox: {
    accentColor: "var(--accent)",
  },
  checkText: {
    fontSize: 11,
    color: "var(--text-muted)",
    fontWeight: 500,
  },
};
