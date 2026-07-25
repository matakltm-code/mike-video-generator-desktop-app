import type { VideoConfig } from "../../../shared/VideoConfig";

interface CanvasSettingsProps {
  canvas: VideoConfig["canvas"];
  onUpdate: (updates: Partial<VideoConfig["canvas"]>) => void;
}

export default function CanvasSettings({ canvas, onUpdate }: CanvasSettingsProps) {
  const durationSec = canvas.durationInFrames / canvas.fps;

  const handleDurationChange = (sec: number) => {
    const clamped = Math.max(1, Math.min(600, sec));
    onUpdate({ durationInFrames: Math.round(clamped * canvas.fps) });
  };

  const applyPreset = () => {
    onUpdate({
      width: 1080,
      height: 1920,
      fps: 30,
      durationInFrames: 450,
      backgroundColor: "#0a0a0a",
    });
  };

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.title}>Canvas Settings</h2>
        <button style={styles.presetBtn} onClick={applyPreset}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
          </svg>
          9:16 Preset
        </button>
      </div>

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

// ─── Styles ───────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
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
