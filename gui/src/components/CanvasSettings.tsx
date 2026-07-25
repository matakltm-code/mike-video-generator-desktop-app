import { useState } from "react";
import type { VideoConfig } from "../../../shared/VideoConfig";

interface CanvasSettingsProps {
  canvas: VideoConfig["canvas"];
  onUpdate: (updates: Partial<VideoConfig["canvas"]>) => void;
}

interface CanvasPreset {
  id: string;
  name: string;
  aspect: string;
  width: number;
  height: number;
  description: string;
  icon: string;
  defaultDuration?: number;
}

const PRESETS: CanvasPreset[] = [
  { id: "vertical", name: "Vertical", aspect: "9:16", width: 1080, height: 1920, description: "TikTok, Reels, Shorts", icon: "▯", defaultDuration: 15 },
  { id: "landscape", name: "Landscape", aspect: "16:9", width: 1920, height: 1080, description: "YouTube, widescreen", icon: "▬", defaultDuration: 30 },
  { id: "square", name: "Square", aspect: "1:1", width: 1080, height: 1080, description: "Instagram feed posts", icon: "⬜", defaultDuration: 15 },
  { id: "portrait", name: "Portrait", aspect: "4:5", width: 1080, height: 1350, description: "Instagram portrait", icon: "▯", defaultDuration: 15 },
  { id: "cinematic", name: "Cinematic", aspect: "21:9", width: 1920, height: 817, description: "Cinema widescreen", icon: "▄", defaultDuration: 30 },
  { id: "standard", name: "Standard", aspect: "4:3", width: 1024, height: 768, description: "Classic / legacy", icon: "▭", defaultDuration: 30 },
  { id: "short", name: "Short HD", aspect: "9:16", width: 720, height: 1280, description: "Lower-res vertical", icon: "▯", defaultDuration: 15 },
];

export default function CanvasSettings({ canvas, onUpdate }: CanvasSettingsProps) {
  const durationSec = canvas.durationInFrames / canvas.fps;
  const [showPresets, setShowPresets] = useState(false);

  const handleDurationChange = (sec: number) => {
    const clamped = Math.max(1, Math.min(600, sec));
    onUpdate({ durationInFrames: Math.round(clamped * canvas.fps) });
  };

  const applyPreset = (preset: CanvasPreset) => {
    onUpdate({
      width: preset.width,
      height: preset.height,
      // Keep current FPS — only change dimensions
      durationInFrames: (preset.defaultDuration ?? 15) * canvas.fps,
    });
    setShowPresets(false);
  };

  const currentPreset = PRESETS.find(
    (p) => p.width === canvas.width && p.height === canvas.height
  );

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.title}>Canvas Settings</h2>
        <button
          style={styles.presetBtn}
          onClick={() => setShowPresets(!showPresets)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
          </svg>
          {currentPreset ? currentPreset.name : "Presets"}
        </button>
      </div>

      {/* Preset grid */}
      {showPresets && (
        <div style={styles.presetGrid}>
          {PRESETS.map((preset) => {
            const isActive = preset.width === canvas.width && preset.height === canvas.height;
            return (
              <PresetCardBtn
                key={preset.id}
                preset={preset}
                isActive={isActive}
                onClick={() => applyPreset(preset)}
              />
            );
          })}
        </div>
      )}

      <div style={styles.card}>
        <div style={styles.grid}>
          <Field label="Width (px)">
            <NumberInput value={canvas.width} min={1} max={7680} onChange={(v) => onUpdate({ width: v })} />
          </Field>
          <Field label="Height (px)">
            <NumberInput value={canvas.height} min={1} max={7680} onChange={(v) => onUpdate({ height: v })} />
          </Field>
          <Field label="FPS">
            <NumberInput value={canvas.fps} min={1} max={120} onChange={(v) => onUpdate({ fps: v })} />
          </Field>
          <Field label="Duration (s)">
            <NumberInput value={durationSec} min={1} max={600} onChange={handleDurationChange} />
          </Field>
        </div>

        <div style={styles.separator} />

        <Field label="Background Color">
          <div style={styles.colorRow}>
            <input
              type="color"
              value={canvas.backgroundColor}
              onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
              style={styles.colorPicker}
            />
            <input
              type="text"
              value={canvas.backgroundColor}
              onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
              style={styles.colorInput}
              placeholder="#000000"
            />
          </div>
        </Field>
      </div>

      <div style={styles.infoBox}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <span style={styles.infoText}>
          <strong>{canvas.durationInFrames}</strong> frames &middot;{" "}
          <strong>{canvas.width}&times;{canvas.height}</strong> @ {canvas.fps}fps
          &middot; {canvas.width > canvas.height ? "Landscape" : canvas.width < canvas.height ? "Portrait" : "Square"}
        </span>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={styles.field}>
      <span style={styles.fieldLabel}>{label}</span>
      {children}
    </label>
  );
}

function NumberInput({
  value,
  min,
  max,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      onChange={(e) => onChange(Number(e.target.value))}
      style={styles.input}
    />
  );
}

// ─── Hover-aware preset card ──────────────────────────────────────────

function PresetCardBtn({
  preset,
  isActive,
  onClick,
}: {
  preset: CanvasPreset;
  isActive: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      style={{
        ...styles.presetCard,
        ...(isActive ? styles.presetCardActive : {}),
        ...(hovered && !isActive ? { borderColor: "var(--accent)" as string } : {}),
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={styles.presetIcon}>{preset.icon}</span>
      <div style={styles.presetInfo}>
        <span style={styles.presetName}>{preset.name}</span>
        <span style={styles.presetAspect}>{preset.aspect}</span>
      </div>
      <span style={styles.presetRes}>
        {preset.width}&times;{preset.height}
      </span>
      <span style={styles.presetDesc}>{preset.description}</span>
    </button>
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
  presetBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 16px",
    border: "1px solid var(--border-color)",
    borderRadius: "var(--radius-sm)",
    background: "var(--bg-tertiary)",
    color: "var(--accent)",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all var(--transition)",
  },
  presetGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: 10,
    marginBottom: 20,
  },
  presetCard: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    padding: "14px 16px",
    border: "1px solid var(--border-color)",
    borderRadius: "var(--radius-md)",
    background: "var(--bg-secondary)",
    cursor: "pointer",
    transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
    textAlign: "left" as const,
    alignItems: "flex-start",
  },
  presetCardActive: {
    borderColor: "var(--accent)",
    background: "var(--accent-bg)",
  },
  presetIcon: {
    fontSize: 20,
    color: "var(--text-muted)",
    marginBottom: 4,
  },
  presetInfo: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    width: "100%",
  },
  presetName: {
    fontSize: 14,
    fontWeight: 600,
    color: "var(--text-primary)",
  },
  presetAspect: {
    fontSize: 11,
    fontWeight: 600,
    color: "var(--accent)",
    padding: "1px 8px",
    borderRadius: 999,
    background: "var(--accent-bg)",
  },
  presetRes: {
    fontSize: 12,
    color: "var(--text-muted)",
    fontFamily: "monospace",
  },
  presetDesc: {
    fontSize: 11,
    color: "var(--text-muted)",
    marginTop: 2,
  },
  card: {
    background: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    borderRadius: "var(--radius-md)",
    padding: 24,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
  },
  separator: {
    height: 1,
    background: "var(--border-color)",
    margin: "20px 0",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: "var(--text-secondary)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  },
  input: {
    padding: "8px 12px",
    border: "1px solid var(--border-color)",
    borderRadius: "var(--radius-sm)",
    background: "var(--bg-tertiary)",
    color: "var(--text-primary)",
    fontSize: 14,
    outline: "none",
    transition: "border-color var(--transition)",
    width: "100%",
  },
  colorRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  colorPicker: {
    width: 40,
    height: 40,
    border: "1px solid var(--border-color)",
    borderRadius: "var(--radius-sm)",
    background: "none",
    padding: 2,
    cursor: "pointer",
  },
  colorInput: {
    flex: 1,
    padding: "8px 12px",
    border: "1px solid var(--border-color)",
    borderRadius: "var(--radius-sm)",
    background: "var(--bg-tertiary)",
    color: "var(--text-primary)",
    fontSize: 14,
    fontFamily: "monospace",
    outline: "none",
    transition: "border-color var(--transition)",
  },
  infoBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginTop: 16,
    padding: "12px 16px",
    background: "var(--accent-bg)",
    borderRadius: "var(--radius-sm)",
    color: "var(--accent)",
    fontSize: 13,
  },
  infoText: {
    color: "var(--text-secondary)",
  },
};
