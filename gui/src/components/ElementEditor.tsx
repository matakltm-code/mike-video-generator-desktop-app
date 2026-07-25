import { useState } from "react";
import type { VisualElement, AudioTrack, TextElement, ImageElement } from "../../../shared/VideoConfig";

interface ElementEditorProps {
  elements: VisualElement[];
  audioTracks: AudioTrack[];
  onAddText: () => void;
  onAddImage: () => void;
  onAddAudio: () => void;
  onUpdateElement: (id: string, updates: Partial<VisualElement>) => void;
  onRemoveElement: (id: string) => void;
  onUpdateAudioTrack: (id: string, updates: Partial<AudioTrack>) => void;
  onRemoveAudioTrack: (id: string) => void;
  fps: number;
}

export default function ElementEditor({
  elements,
  audioTracks,
  onAddText,
  onAddImage,
  onAddAudio,
  onUpdateElement,
  onRemoveElement,
  onUpdateAudioTrack,
  onRemoveAudioTrack,
  fps,
}: ElementEditorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<"all" | "text" | "image" | "audio">("all");

  const selectedEl = elements.find((e) => e.id === selectedId);
  const selectedAudio = audioTracks.find((t) => t.id === selectedId);
  const filteredElements = filterType === "all" ? elements : elements.filter((e) => e.type === filterType);

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.title}>Elements</h2>
        <div style={styles.actions}>
          <button style={styles.addBtn} onClick={onAddText}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Text
          </button>
          <button style={styles.addBtn} onClick={onAddImage}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Image
          </button>
          <button style={styles.addBtn} onClick={onAddAudio}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Audio
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={styles.filterRow}>
        {(["all", "text", "image", "audio"] as const).map((t) => (
          <button
            key={t}
            style={{
              ...styles.filterChip,
              ...(filterType === t ? styles.filterChipActive : {}),
            }}
            onClick={() => setFilterType(t)}
          >
            {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div style={styles.editorLayout}>
        {/* Element list */}
        <div style={styles.listPanel}>
          {filteredElements.length === 0 && audioTracks.length === 0 && filterType !== "audio" && (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>No elements yet</p>
              <p style={styles.emptySubtext}>Add text, images, or audio to get started</p>
            </div>
          )}

          {filterType !== "audio" && filteredElements.length > 0 && (
            <div style={styles.listGroup}>
              <span style={styles.listGroupLabel}>Visual</span>
              {filteredElements.map((el) => {
                const fromSec = (el.from / fps).toFixed(1);
                const durSec = (el.durationInFrames / fps).toFixed(1);
                return (
                  <div
                    key={el.id}
                    style={{
                      ...styles.listItem,
                      ...(selectedId === el.id ? styles.listItemSelected : {}),
                    }}
                    onClick={() => setSelectedId(el.id)}
                  >
                    <div style={styles.listItemIcon}>
                      {el.type === "text" ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" /></svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                      )}
                    </div>
                    <div style={styles.listItemInfo}>
                      <span style={styles.listItemName}>
                        {el.type === "text" ? (el as TextElement).text : (el as ImageElement).src.split(/[/\\]/).pop()}
                      </span>
                      <span style={styles.listItemMeta}>{fromSec}s &ndash; {(Number(fromSec) + Number(durSec)).toFixed(1)}s</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {(filterType === "all" || filterType === "audio") && audioTracks.length > 0 && (
            <div style={styles.listGroup}>
              <span style={styles.listGroupLabel}>Audio</span>
              {audioTracks.map((track) => (
                <div
                  key={track.id}
                  style={{
                    ...styles.listItem,
                    ...(selectedId === track.id ? styles.listItemSelected : {}),
                  }}
                  onClick={() => setSelectedId(track.id)}
                >
                  <div style={styles.listItemIcon}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
                  </div>
                  <div style={styles.listItemInfo}>
                    <span style={styles.listItemName}>{track.src.split(/[/\\]/).pop()}</span>
                    <span style={styles.listItemMeta}>Vol: {track.volume ?? 0.7} &middot; {track.loop ? "Loop" : "Once"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Properties panel */}
        <div style={styles.propsPanel}>
          {selectedEl?.type === "text" && (
            <TextProperties element={selectedEl as TextElement} onUpdate={onUpdateElement} onRemove={onRemoveElement} fps={fps} />
          )}
          {selectedEl?.type === "image" && (
            <ImageProperties element={selectedEl as ImageElement} onUpdate={onUpdateElement} onRemove={onRemoveElement} fps={fps} />
          )}
          {selectedAudio && (
            <AudioProperties track={selectedAudio} onUpdate={onUpdateAudioTrack} onRemove={onRemoveAudioTrack} fps={fps} />
          )}
          {!selectedEl && !selectedAudio && (
            <div style={styles.propsEmpty}>
              <p style={styles.emptyText}>Select an element</p>
              <p style={styles.emptySubtext}>Click on an element to edit its properties</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Text Properties ──────────────────────────────────────────────────

function TextProperties({
  element,
  onUpdate,
  onRemove,
  fps,
}: {
  element: TextElement;
  onUpdate: (id: string, updates: Partial<VisualElement>) => void;
  onRemove: (id: string) => void;
  fps: number;
}) {
  return (
    <div style={styles.propsForm}>
      <h3 style={styles.propsTitle}>Text Properties</h3>

      <PropField label="Content">
        <textarea
          value={element.text}
          onChange={(e) => onUpdate(element.id, { text: e.target.value })}
          style={styles.textArea}
          rows={2}
        />
      </PropField>

      <div style={styles.propRow}>
        <PropField label="Start (s)">
          <input type="number" min={0} step={0.5} value={(element.from / fps).toFixed(1)}
            onChange={(e) => onUpdate(element.id, { from: Math.round(Number(e.target.value) * fps) })}
            style={styles.propInput}
          />
        </PropField>
        <PropField label="Duration (s)">
          <input type="number" min={0.5} step={0.5} value={(element.durationInFrames / fps).toFixed(1)}
            onChange={(e) => onUpdate(element.id, { durationInFrames: Math.round(Number(e.target.value) * fps) })}
            style={styles.propInput}
          />
        </PropField>
      </div>

      <PropField label="Font Size (px)">
        <input type="number" min={8} max={300} value={element.style.fontSize}
          onChange={(e) => onUpdate(element.id, { style: { ...element.style, fontSize: Number(e.target.value) } })}
          style={styles.propInput}
        />
      </PropField>

      <PropField label="Color">
        <div style={styles.colorRow}>
          <input type="color" value={element.style.color}
            onChange={(e) => onUpdate(element.id, { style: { ...element.style, color: e.target.value } })}
            style={styles.colorPicker}
          />
          <input type="text" value={element.style.color}
            onChange={(e) => onUpdate(element.id, { style: { ...element.style, color: e.target.value } })}
            style={styles.colorInput}
          />
        </div>
      </PropField>

      <PropField label="Alignment">
        <div style={styles.alignRow}>
          {(["left", "center", "right"] as const).map((a) => (
            <button
              key={a}
              style={{
                ...styles.alignBtn,
                ...(element.style.textAlign === a ? styles.alignBtnActive : {}),
              }}
              onClick={() => onUpdate(element.id, { style: { ...element.style, textAlign: a } })}
            >
              {a.charAt(0).toUpperCase() + a.slice(1)}
            </button>
          ))}
        </div>
      </PropField>

      <PropField label="Position">
        <div style={styles.propRow}>
          <input type="number" value={element.position.x}
            onChange={(e) => onUpdate(element.id, { position: { ...element.position, x: Number(e.target.value) } })}
            style={styles.propInput} placeholder="X"
          />
          <input type="number" value={element.position.y}
            onChange={(e) => onUpdate(element.id, { position: { ...element.position, y: Number(e.target.value) } })}
            style={styles.propInput} placeholder="Y"
          />
        </div>
      </PropField>

      <PropField label="Animation">
        <select
          value={element.animation?.type ?? "none"}
          onChange={(e) => {
            if (e.target.value === "none") {
              onUpdate(element.id, { animation: undefined });
            } else {
              onUpdate(element.id, {
                animation: {
                  type: e.target.value as "fadeIn" | "slideUp" | "scaleIn",
                  durationInFrames: element.animation?.durationInFrames ?? 30,
                },
              });
            }
          }}
          style={styles.propSelect}
        >
          <option value="none">None</option>
          <option value="fadeIn">Fade In</option>
          <option value="slideUp">Slide Up</option>
          <option value="scaleIn">Scale In</option>
        </select>
      </PropField>

      {element.animation && (
        <PropField label="Anim Duration (f)">
          <input type="number" min={1} max={120} value={element.animation.durationInFrames}
            onChange={(e) => onUpdate(element.id, { animation: { ...element.animation!, durationInFrames: Number(e.target.value) } })}
            style={styles.propInput}
          />
        </PropField>
      )}

      <PropField label="Opacity">
        <input type="range" min={0} max={1} step={0.05} value={element.opacity ?? 1}
          onChange={(e) => onUpdate(element.id, { opacity: Number(e.target.value) })}
          style={styles.slider}
        />
        <span style={styles.sliderValue}>{((element.opacity ?? 1) * 100).toFixed(0)}%</span>
      </PropField>

      <button style={styles.deleteBtn} onClick={() => onRemove(element.id)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
        Delete Element
      </button>
    </div>
  );
}

// ─── Image Properties ─────────────────────────────────────────────────

function ImageProperties({
  element,
  onUpdate,
  onRemove,
  fps,
}: {
  element: ImageElement;
  onUpdate: (id: string, updates: Partial<VisualElement>) => void;
  onRemove: (id: string) => void;
  fps: number;
}) {
  return (
    <div style={styles.propsForm}>
      <h3 style={styles.propsTitle}>Image Properties</h3>

      <div style={styles.propRow}>
        <PropField label="Start (s)">
          <input type="number" min={0} step={0.5} value={(element.from / fps).toFixed(1)}
            onChange={(e) => onUpdate(element.id, { from: Math.round(Number(e.target.value) * fps) })}
            style={styles.propInput}
          />
        </PropField>
        <PropField label="Duration (s)">
          <input type="number" min={0.5} step={0.5} value={(element.durationInFrames / fps).toFixed(1)}
            onChange={(e) => onUpdate(element.id, { durationInFrames: Math.round(Number(e.target.value) * fps) })}
            style={styles.propInput}
          />
        </PropField>
      </div>

      <PropField label="Position">
        <div style={styles.propRow}>
          <input type="number" value={element.position.x}
            onChange={(e) => onUpdate(element.id, { position: { ...element.position, x: Number(e.target.value) } })}
            style={styles.propInput} placeholder="X"
          />
          <input type="number" value={element.position.y}
            onChange={(e) => onUpdate(element.id, { position: { ...element.position, y: Number(e.target.value) } })}
            style={styles.propInput} placeholder="Y"
          />
        </div>
      </PropField>

      <PropField label="Width (px)">
        <input type="number" min={0} value={element.size?.width ?? ""} placeholder="Auto"
          onChange={(e) => onUpdate(element.id, { size: { ...(element.size || {}), width: Number(e.target.value) || undefined } })}
          style={styles.propInput}
        />
      </PropField>

      <PropField label="Object Fit">
        <select
          value={element.size?.objectFit ?? "contain"}
          onChange={(e) => onUpdate(element.id, { size: { ...(element.size || {}), objectFit: e.target.value as "cover" | "contain" | "fill" } })}
          style={styles.propSelect}
        >
          <option value="contain">Contain</option>
          <option value="cover">Cover</option>
          <option value="fill">Fill</option>
        </select>
      </PropField>

      <PropField label="Opacity">
        <input type="range" min={0} max={1} step={0.05} value={element.opacity ?? 1}
          onChange={(e) => onUpdate(element.id, { opacity: Number(e.target.value) })}
          style={styles.slider}
        />
        <span style={styles.sliderValue}>{((element.opacity ?? 1) * 100).toFixed(0)}%</span>
      </PropField>

      <button style={styles.deleteBtn} onClick={() => onRemove(element.id)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
        Delete Element
      </button>
    </div>
  );
}

// ─── Audio Properties ─────────────────────────────────────────────────

function AudioProperties({
  track,
  onUpdate,
  onRemove,
  fps,
}: {
  track: AudioTrack;
  onUpdate: (id: string, updates: Partial<AudioTrack>) => void;
  onRemove: (id: string) => void;
  fps: number;
}) {
  return (
    <div style={styles.propsForm}>
      <h3 style={styles.propsTitle}>Audio Properties</h3>

      <PropField label="Volume">
        <input type="range" min={0} max={1} step={0.05} value={track.volume ?? 0.7}
          onChange={(e) => onUpdate(track.id, { volume: Number(e.target.value) })}
          style={styles.slider}
        />
        <span style={styles.sliderValue}>{Math.round((track.volume ?? 0.7) * 100)}%</span>
      </PropField>

      <div style={styles.propRow}>
        <PropField label="Start (s)">
          <input type="number" min={0} step={0.5} value={(track.from / fps).toFixed(1)}
            onChange={(e) => onUpdate(track.id, { from: Math.round(Number(e.target.value) * fps) })}
            style={styles.propInput}
          />
        </PropField>
        <PropField label="Duration (s)">
          <input type="number" min={0.5} step={0.5} value={(track.durationInFrames / fps).toFixed(1)}
            onChange={(e) => onUpdate(track.id, { durationInFrames: Math.round(Number(e.target.value) * fps) })}
            style={styles.propInput}
          />
        </PropField>
      </div>

      <label style={styles.checkRow}>
        <input type="checkbox" checked={track.loop ?? false}
          onChange={(e) => onUpdate(track.id, { loop: e.target.checked })}
          style={styles.checkbox}
        />
        <span style={styles.checkLabel}>Loop audio</span>
      </label>

      <button style={styles.deleteBtn} onClick={() => onRemove(track.id)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
        Remove Audio
      </button>
    </div>
  );
}

// ─── Reusable field wrapper ───────────────────────────────────────────

function PropField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={styles.propFieldWrapper}>
      <span style={styles.propFieldLabel}>{label}</span>
      <div style={styles.propFieldValue}>{children}</div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 600,
    color: "var(--text-primary)",
    letterSpacing: "-0.02em",
  },
  actions: {
    display: "flex",
    gap: 8,
  },
  addBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "7px 14px",
    border: "1px solid var(--border-color)",
    borderRadius: "var(--radius-sm)",
    background: "var(--bg-tertiary)",
    color: "var(--text-primary)",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all var(--transition)",
  },
  filterRow: {
    display: "flex",
    gap: 6,
    marginBottom: 16,
  },
  filterChip: {
    padding: "5px 12px",
    border: "1px solid var(--border-color)",
    borderRadius: 999,
    background: "var(--bg-secondary)",
    color: "var(--text-muted)",
    fontSize: 11,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all var(--transition)",
  },
  filterChipActive: {
    background: "var(--accent-bg)",
    borderColor: "var(--accent)",
    color: "var(--accent)",
  },
  editorLayout: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    minHeight: 400,
  },
  listPanel: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  listGroup: {
    marginBottom: 8,
  },
  listGroupLabel: {
    fontSize: 10,
    fontWeight: 600,
    color: "var(--text-muted)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    padding: "4px 8px",
    display: "block",
    marginBottom: 4,
  },
  listItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    borderRadius: "var(--radius-sm)",
    cursor: "pointer",
    transition: "all var(--transition)",
  },
  listItemSelected: {
    background: "var(--accent-bg)",
  },
  listItemIcon: {
    width: 28,
    height: 28,
    borderRadius: "var(--radius-sm)",
    background: "var(--bg-tertiary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--text-muted)",
    flexShrink: 0,
  },
  listItemInfo: {
    flex: 1,
    minWidth: 0,
  },
  listItemName: {
    fontSize: 13,
    color: "var(--text-primary)",
    fontWeight: 500,
    display: "block",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  listItemMeta: {
    fontSize: 11,
    color: "var(--text-muted)",
    marginTop: 1,
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 24px",
    gap: 4,
  },
  emptyText: {
    fontSize: 14,
    color: "var(--text-muted)",
    fontWeight: 500,
  },
  emptySubtext: {
    fontSize: 12,
    color: "var(--text-muted)",
    textAlign: "center" as const,
  },
  propsPanel: {
    background: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    borderRadius: "var(--radius-md)",
    padding: 20,
  },
  propsEmpty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 24px",
    gap: 4,
  },
  propsForm: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  propsTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: "var(--text-primary)",
    marginBottom: 4,
  },
  propRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  propFieldWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  propFieldLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: "var(--text-muted)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  },
  propFieldValue: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  propInput: {
    width: "100%",
    padding: "6px 10px",
    border: "1px solid var(--border-color)",
    borderRadius: "var(--radius-sm)",
    background: "var(--bg-tertiary)",
    color: "var(--text-primary)",
    fontSize: 13,
    outline: "none",
    transition: "border-color var(--transition)",
  },
  propSelect: {
    width: "100%",
    padding: "6px 10px",
    border: "1px solid var(--border-color)",
    borderRadius: "var(--radius-sm)",
    background: "var(--bg-tertiary)",
    color: "var(--text-primary)",
    fontSize: 13,
    outline: "none",
    cursor: "pointer",
  },
  textArea: {
    width: "100%",
    padding: "8px 10px",
    border: "1px solid var(--border-color)",
    borderRadius: "var(--radius-sm)",
    background: "var(--bg-tertiary)",
    color: "var(--text-primary)",
    fontSize: 13,
    outline: "none",
    resize: "vertical" as const,
    minHeight: 40,
    fontFamily: "inherit",
    transition: "border-color var(--transition)",
  },
  colorRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    width: "100%",
  },
  colorPicker: {
    width: 32,
    height: 32,
    border: "1px solid var(--border-color)",
    borderRadius: "var(--radius-sm)",
    background: "none",
    padding: 2,
    cursor: "pointer",
    flexShrink: 0,
  },
  colorInput: {
    flex: 1,
    padding: "6px 10px",
    border: "1px solid var(--border-color)",
    borderRadius: "var(--radius-sm)",
    background: "var(--bg-tertiary)",
    color: "var(--text-primary)",
    fontSize: 13,
    fontFamily: "monospace",
    outline: "none",
    transition: "border-color var(--transition)",
  },
  alignRow: {
    display: "flex",
    gap: 4,
  },
  alignBtn: {
    flex: 1,
    padding: "5px 8px",
    border: "1px solid var(--border-color)",
    borderRadius: "var(--radius-sm)",
    background: "var(--bg-tertiary)",
    color: "var(--text-muted)",
    fontSize: 11,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all var(--transition)",
  },
  alignBtnActive: {
    background: "var(--accent-bg)",
    borderColor: "var(--accent)",
    color: "var(--accent)",
  },
  slider: {
    flex: 1,
    accentColor: "var(--accent)",
    cursor: "pointer",
  },
  sliderValue: {
    fontSize: 12,
    color: "var(--text-muted)",
    fontFamily: "monospace",
    minWidth: 32,
    textAlign: "right" as const,
  },
  checkRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",
  },
  checkbox: {
    accentColor: "var(--accent)",
    width: 16,
    height: 16,
  },
  checkLabel: {
    fontSize: 13,
    color: "var(--text-primary)",
    fontWeight: 500,
  },
  deleteBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 8,
    padding: "8px 16px",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "var(--radius-sm)",
    background: "rgba(239, 68, 68, 0.08)",
    color: "var(--error)",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all var(--transition)",
  },
};
