import { useState, useCallback, useEffect } from "react";
import type { VideoConfig, RenderState, VisualElement, AudioTrack, TextElement, ImageElement } from "../../shared/VideoConfig";
import { DEFAULT_CONFIG } from "../../shared/VideoConfig";
import { useElectron } from "./hooks/useElectron";
import CanvasSettings from "./components/CanvasSettings";
import AssetUploader from "./components/AssetUploader";
import ElementEditor from "./components/ElementEditor";
import RenderControls from "./components/RenderControls";
import TemplateSelector from "./components/TemplateSelector";
import VideoPreview from "./components/VideoPreview";

let elementCounter = 0;
function generateId(prefix: string): string {
  elementCounter++;
  return `${prefix}-${elementCounter}-${Date.now()}`;
}

export default function App() {
  const [config, setConfig] = useState<VideoConfig>(DEFAULT_CONFIG);
  const [renderState, setRenderState] = useState<RenderState>("IDLE");
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderOutputPath, setRenderOutputPath] = useState<string | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"templates" | "settings" | "elements" | "assets">("templates");
  const [showPreview, setShowPreview] = useState(true);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const { selectFile, saveDialog, startRender, cancelRender, setupRenderListeners } = useElectron();

  // ── Render lifecycle listeners ──────────────────────────────────────

  useEffect(() => {
    const cleanup = setupRenderListeners({
      onProgress: (percent) => {
        setRenderProgress(percent);
        // Transition from VALIDATING to RENDERING on first progress event
        setRenderState((prev) => (prev === "VALIDATING" ? "RENDERING" : prev));
        if (percent >= 100) {
          setRenderState("SUCCESS");
        }
      },
      onComplete: (outputPath) => {
        setRenderOutputPath(outputPath);
        setRenderState("SUCCESS");
      },
      onError: (error) => {
        setRenderError(error);
        setRenderState("ERROR");
      },
    });
    return cleanup;
  }, [setupRenderListeners]);

  // ── Template helper ─────────────────────────────────────────────────

  const loadTemplate = useCallback((config: VideoConfig) => {
    setConfig(config);
    setActiveTab("elements");
    elementCounter = 0;
  }, []);

  // ── Canvas helpers ──────────────────────────────────────────────────

  const updateCanvas = useCallback((updates: Partial<VideoConfig["canvas"]>) => {
    setConfig((prev) => ({
      ...prev,
      canvas: { ...prev.canvas, ...updates },
    }));
  }, []);

  // ── Element helpers ─────────────────────────────────────────────────

  const addTextElement = useCallback(() => {
    const newEl: TextElement = {
      id: generateId("text"),
      type: "text",
      text: "Your Headline",
      from: 0,
      durationInFrames: 150,
      position: { x: 100, y: 400 },
      opacity: 1,
      style: {
        fontSize: 72,
        color: "#ffffff",
        fontFamily: "Arial, sans-serif",
        fontWeight: 700,
        textAlign: "center",
      },
      animation: {
        type: "slideUp",
        durationInFrames: 30,
      },
    };
    setConfig((prev) => ({
      ...prev,
      tracks: { ...prev.tracks, elements: [...prev.tracks.elements, newEl] },
    }));
  }, []);

  const addImageElement = useCallback(async () => {
    const src = await selectFile([{ name: "Images", extensions: ["png", "jpg", "jpeg", "gif", "webp"] }]);
    if (!src) return;
    const newEl: ImageElement = {
      id: generateId("image"),
      type: "image",
      src,
      from: 0,
      durationInFrames: 150,
      position: { x: 200, y: 200 },
      opacity: 1,
      size: {
        width: 300,
        objectFit: "contain",
      },
    };
    setConfig((prev) => ({
      ...prev,
      tracks: { ...prev.tracks, elements: [...prev.tracks.elements, newEl] },
    }));
  }, [selectFile]);

  const updateElement = useCallback((id: string, updates: Partial<VisualElement>) => {
    setConfig((prev) => ({
      ...prev,
      tracks: {
        ...prev.tracks,
        elements: prev.tracks.elements.map((el) =>
          el.id === id ? ({ ...el, ...updates } as VisualElement) : el
        ),
      },
    }));
  }, []);

  const removeElement = useCallback((id: string) => {
    setConfig((prev) => ({
      ...prev,
      tracks: {
        ...prev.tracks,
        elements: prev.tracks.elements.filter((el) => el.id !== id),
      },
    }));
  }, []);

  // ── Audio helpers ───────────────────────────────────────────────────

  const addAudioTrack = useCallback(async () => {
    const src = await selectFile([{ name: "Audio", extensions: ["mp3", "wav", "ogg", "m4a", "aac"] }]);
    if (!src) return;
    const newTrack: AudioTrack = {
      id: generateId("audio"),
      src,
      from: 0,
      durationInFrames: config.canvas.durationInFrames,
      volume: 0.7,
      loop: false,
    };
    setConfig((prev) => ({
      ...prev,
      tracks: { ...prev.tracks, audio: [...prev.tracks.audio, newTrack] },
    }));
  }, [selectFile, config.canvas.durationInFrames]);

  const updateAudioTrack = useCallback((id: string, updates: Partial<AudioTrack>) => {
    setConfig((prev) => ({
      ...prev,
      tracks: {
        ...prev.tracks,
        audio: prev.tracks.audio.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      },
    }));
  }, []);

  const removeAudioTrack = useCallback((id: string) => {
    setConfig((prev) => ({
      ...prev,
      tracks: {
        ...prev.tracks,
        audio: prev.tracks.audio.filter((t) => t.id !== id),
      },
    }));
  }, []);

  // ── Render ──────────────────────────────────────────────────────────

  const handleStartRender = useCallback(async () => {
    const outputPath = await saveDialog("mike-video.mp4");
    if (!outputPath) return;

    setRenderState("VALIDATING");
    setRenderProgress(0);
    setRenderError(null);
    setRenderOutputPath(null);

    // Let the VALIDATING state render, then kick off the render
    // The IPC listeners will transition to RENDERING once the
    // main process begins emitting progress events.
    try {
      await startRender(config, outputPath);
      // Promise resolves when render completes (success or error).
      // State is managed by IPC listeners.
    } catch {
      // Error is also handled via the IPC render-error listener.
    }
  }, [config, saveDialog, startRender]);

  const handleCancelRender = useCallback(async () => {
    await cancelRender();
    setRenderState("IDLE");
    setRenderProgress(0);
  }, [cancelRender]);

  // ── Duration helper ─────────────────────────────────────────────────

  const canvasDurationSec = Math.round(config.canvas.durationInFrames / config.canvas.fps);
  const totalElements = config.tracks.elements.length;
  const totalAudio = config.tracks.audio.length;

  // ── Render ──────────────────────────────────────────────────────────

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <Logo />
          <div>
            <h1 style={styles.title}>Mike Video Generator</h1>
            <p style={styles.subtitle}>
              {config.canvas.width}&times;{config.canvas.height} &middot;{" "}
              {canvasDurationSec}s &middot; {totalElements} element{totalElements !== 1 ? "s" : ""}
              {totalAudio > 0 ? ` &middot; ${totalAudio} track${totalAudio !== 1 ? "s" : ""}` : ""}
            </p>
          </div>
        </div>
        <div style={styles.headerCenter} />
        <div style={styles.headerActions}>
          <button
            style={{
              ...styles.previewToggle,
              ...(showPreview ? styles.previewToggleActive : {}),
            }}
            onClick={() => setShowPreview(!showPreview)}
            title={showPreview ? "Hide preview" : "Show preview"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </button>
          <RenderControls
            config={config}
            renderState={renderState}
            renderProgress={renderProgress}
            renderOutputPath={renderOutputPath}
            renderError={renderError}
            onStartRender={handleStartRender}
            onCancelRender={handleCancelRender}
          />
        </div>
      </header>

      {/* Main content */}
      <div style={styles.main}>
        {/* Sidebar Tabs */}
        <aside style={{
          ...styles.sidebar,
          width: sidebarExpanded ? 180 : 56,
        }}>
          <nav style={styles.tabNav}>
            <SidebarTab
              active={activeTab === "templates"}
              expanded={sidebarExpanded}
              label="Templates"
              onClick={() => setActiveTab("templates")}
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </SidebarTab>
            <SidebarTab
              active={activeTab === "settings"}
              expanded={sidebarExpanded}
              label="Canvas"
              onClick={() => setActiveTab("settings")}
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </SidebarTab>
            <SidebarTab
              active={activeTab === "elements"}
              expanded={sidebarExpanded}
              label="Elements"
              onClick={() => setActiveTab("elements")}
            >
              <path d="M4 7V4h16v3" />
              <path d="M9 20h6" />
              <path d="M12 4v16" />
            </SidebarTab>
            <SidebarTab
              active={activeTab === "assets"}
              expanded={sidebarExpanded}
              label="Assets"
              onClick={() => setActiveTab("assets")}
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </SidebarTab>
          </nav>

          {/* Sidebar footer: collapse/expand toggle */}
          <div style={styles.sidebarFooter}>
            <button
              style={{
                ...styles.toggleBtn,
                ...(sidebarExpanded ? styles.toggleBtnRow : {}),
              }}
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              title={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  flexShrink: 0,
                  transform: sidebarExpanded ? "rotate(0deg)" : "rotate(180deg)",
                  transition: "transform var(--transition)",
                }}
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span
                style={{
                  ...styles.toggleLabel,
                  opacity: sidebarExpanded ? 1 : 0,
                  width: sidebarExpanded ? "auto" : 0,
                  overflow: "hidden",
                }}
              >
                Collapse
              </span>
            </button>
          </div>
        </aside>

        {/* Content panel */}
        <section style={styles.content}>
          {activeTab === "templates" && (
            <TemplateSelector onSelectTemplate={loadTemplate} />
          )}

          {activeTab === "settings" && (
            <CanvasSettings
              canvas={config.canvas}
              onUpdate={updateCanvas}
            />
          )}

          {activeTab === "elements" && (
            <ElementEditor
              elements={config.tracks.elements}
              audioTracks={config.tracks.audio}
              onAddText={addTextElement}
              onAddImage={addImageElement}
              onAddAudio={addAudioTrack}
              onUpdateElement={updateElement}
              onRemoveElement={removeElement}
              onUpdateAudioTrack={updateAudioTrack}
              onRemoveAudioTrack={removeAudioTrack}
              fps={config.canvas.fps}
            />
          )}

          {activeTab === "assets" && (
            <AssetUploader
              elements={config.tracks.elements}
              audioTracks={config.tracks.audio}
              onAddImage={addImageElement}
              onAddAudio={addAudioTrack}
              onRemoveElement={removeElement}
              onRemoveAudioTrack={removeAudioTrack}
              onUpdateElement={updateElement}
              onUpdateAudioTrack={updateAudioTrack}
            />
          )}
        </section>

        {/* Video Preview panel */}
        <VideoPreview config={config} visible={showPreview} />
      </div>
    </div>
  );
}

// ─── Sidebar Tab Component ─────────────────────────────────────────────

function SidebarTab({
  active,
  expanded,
  label,
  onClick,
  children,
}: {
  active: boolean;
  expanded: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      style={{
        ...styles.tabButton,
        ...(expanded ? styles.tabButtonRow : {}),
        ...(active ? styles.tabActive : {}),
      }}
      onClick={onClick}
      title={label}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0 }}
      >
        {children}
      </svg>
      <span
        style={{
          ...styles.tabLabel,
          ...(expanded ? styles.tabLabelRow : {}),
        }}
      >
        {label}
      </span>
    </button>
  );
}

// ─── SVG Logo ─────────────────────────────────────────────────────────

function Logo() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect width="36" height="36" rx="10" fill="#6366f1" />
      <polygon points="14,10 26,18 14,26" fill="#ffffff" opacity="0.95" />
      <rect x="9" y="10" width="3" height="16" rx="1.5" fill="#ffffff" opacity="0.6" />
    </svg>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 20px",
    borderBottom: "1px solid var(--border-color)",
    background: "var(--bg-secondary)",
    flexShrink: 0,
    gap: 16,
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  headerCenter: {
    flex: 1,
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  previewToggle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 34,
    height: 34,
    border: "1px solid var(--border-color)",
    borderRadius: "var(--radius-sm)",
    background: "var(--bg-tertiary)",
    color: "var(--text-muted)",
    cursor: "pointer",
    transition: "all var(--transition)",
  },
  previewToggleActive: {
    background: "var(--accent-bg)",
    color: "var(--accent)",
    borderColor: "var(--accent)",
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
    color: "var(--text-primary)",
    letterSpacing: "-0.01em",
  },
  subtitle: {
    fontSize: 12,
    color: "var(--text-muted)",
    marginTop: 1,
  },
  main: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  },
  sidebar: {
    flexShrink: 0,
    background: "var(--bg-secondary)",
    borderRight: "1px solid var(--border-color)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    transition: "width 200ms cubic-bezier(0.4, 0, 0.2, 1)",
  },
  tabNav: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 2,
    width: "100%",
    padding: "8px",
    flex: 1,
  },
  tabButton: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: 3,
    padding: "10px 4px",
    border: "none",
    borderRadius: "var(--radius-sm)",
    background: "transparent",
    color: "var(--text-muted)",
    cursor: "pointer",
    transition: "all 150ms ease",
    fontSize: 10,
    fontWeight: 500,
    width: "100%",
  },
  tabButtonRow: {
    flexDirection: "row" as const,
    gap: 10,
    padding: "10px 12px",
    justifyContent: "flex-start",
  },
  tabActive: {
    background: "var(--accent-bg)",
    color: "var(--accent)",
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.02em",
    textTransform: "none" as const,
    whiteSpace: "nowrap" as const,
    opacity: 0,
    transition: "opacity 200ms ease",
  },
  tabLabelRow: {
    opacity: 1,
  },
  sidebarFooter: {
    padding: "8px",
    borderTop: "1px solid var(--border-color)",
    flexShrink: 0,
  },
  toggleBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "8px 4px",
    border: "none",
    borderRadius: "var(--radius-sm)",
    background: "transparent",
    color: "var(--text-muted)",
    cursor: "pointer",
    transition: "all 150ms ease",
    width: "100%",
    fontSize: 11,
    fontWeight: 500,
  },
  toggleBtnRow: {
    justifyContent: "flex-start",
    padding: "8px 12px",
    gap: 10,
  },
  toggleLabel: {
    fontSize: 11,
    color: "var(--text-muted)",
    whiteSpace: "nowrap" as const,
    transition: "opacity 150ms ease",
  },
  content: {
    flex: 1,
    overflow: "auto",
    padding: "24px 28px",
    background: "var(--bg-primary)",
  },
};
