import { useState } from "react";
import { TEMPLATES } from "../templates/index";
import type { VideoTemplate } from "../templates/index";
import type { VideoConfig } from "../../../shared/VideoConfig";

interface TemplateSelectorProps {
  onSelectTemplate: (config: VideoConfig) => void;
}

export default function TemplateSelector({ onSelectTemplate }: TemplateSelectorProps) {
  const categories = Array.from(new Set(TEMPLATES.map((t) => t.category)));
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filtered =
    activeCategory === "All"
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === activeCategory);

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.title}>Video Templates</h2>
        <p style={styles.desc}>
          Choose a professionally-designed template to get started. All text is fully editable after selection.
        </p>
      </div>

      {/* Category filter */}
      <div style={styles.filterRow}>
        {["All", ...categories].map((cat) => (
          <button
            key={cat}
            style={{
              ...styles.filterChip,
              ...(activeCategory === cat ? styles.filterChipActive : {}),
            }}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Template cards */}
      <div style={styles.grid}>
        {filtered.map((tmpl) => (
          <TemplateCard
            key={tmpl.id}
            template={tmpl}
            onSelect={onSelectTemplate}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>No templates in this category</p>
        </div>
      )}
    </div>
  );
}

// ─── Individual Template Card ─────────────────────────────────────────

function TemplateCard({
  template,
  onSelect,
}: {
  template: VideoTemplate;
  onSelect: (config: VideoConfig) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.card,
        ...(hovered ? styles.cardHovered : {}),
        borderColor: hovered ? template.color : undefined,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(template.generate())}
    >
      {/* Preview strip */}
      <div
        style={{
          ...styles.previewStrip,
          background: `linear-gradient(135deg, ${template.color}, ${adjustColor(template.color, 20)})`,
        }}
      >
        <span style={styles.cardIcon}>{template.icon}</span>
      </div>

      {/* Body */}
      <div style={styles.cardBody}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>{template.name}</h3>
          <span style={styles.cardBadge}>{template.duration}s</span>
        </div>
        <p style={styles.cardDesc}>{template.description}</p>
        <div style={styles.cardMeta}>
          <span style={styles.cardCategory}>{template.category}</span>
          <span style={styles.cardAction}>
            {hovered ? "Use Template →" : "Apply"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Color utilities ──────────────────────────────────────────────────

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// ─── Styles ───────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 600,
    color: "var(--text-primary)",
    letterSpacing: "-0.02em",
    marginBottom: 6,
  },
  desc: {
    fontSize: 13,
    color: "var(--text-muted)",
    lineHeight: 1.5,
    maxWidth: 560,
  },
  filterRow: {
    display: "flex",
    gap: 6,
    marginBottom: 20,
    flexWrap: "wrap" as const,
  },
  filterChip: {
    padding: "6px 16px",
    border: "1px solid var(--border-color)",
    borderRadius: 999,
    background: "var(--bg-secondary)",
    color: "var(--text-muted)",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all var(--transition)",
  },
  filterChipActive: {
    background: "var(--accent-bg)",
    borderColor: "var(--accent)",
    color: "var(--accent)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: 16,
  },
  card: {
    background: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    borderRadius: "var(--radius-lg)",
    overflow: "hidden",
    cursor: "pointer",
    transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
  },
  cardHovered: {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4)",
  },
  previewStrip: {
    height: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardIcon: {
    fontSize: 40,
    filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))",
  },
  cardBody: {
    padding: "16px 18px 18px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "var(--text-primary)",
  },
  cardBadge: {
    padding: "2px 10px",
    borderRadius: 999,
    background: "var(--bg-tertiary)",
    color: "var(--text-muted)",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.03em",
  },
  cardDesc: {
    fontSize: 12,
    color: "var(--text-secondary)",
    lineHeight: 1.5,
    marginBottom: 12,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical" as const,
    overflow: "hidden",
  },
  cardMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardCategory: {
    padding: "3px 10px",
    borderRadius: 999,
    background: "var(--accent-bg)",
    color: "var(--accent)",
    fontSize: 10,
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
  },
  cardAction: {
    fontSize: 12,
    fontWeight: 600,
    color: "var(--accent)",
    transition: "all var(--transition)",
  },
  emptyState: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px",
  },
  emptyText: {
    fontSize: 14,
    color: "var(--text-muted)",
  },
};
