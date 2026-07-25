import { useState, useCallback, useEffect } from "react";
import type { VideoConfig, RenderState, VisualElement, AudioTrack, TextElement, ImageElement } from "../../shared/VideoConfig";
import { DEFAULT_CONFIG } from "../../shared/VideoConfig";
import { useElectron } from "./hooks/useElectron";
import CanvasSettings from "./components/CanvasSettings";
import AssetUploader from "./components/AssetUploader";
import ElementEditor from "./components/ElementEditor";
import RenderControls from "./components/RenderControls";

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
  const [activeTab, setActiveTab] = useState<"settings" | "elements" | "assets">("settings");

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
        <RenderControls
          config={config}
          renderState={renderState}
          renderProgress={renderProgress}
          renderOutputPath={renderOutputPath}
          renderError={renderError}
          onStartRender={handleStartRender}
          onCancelRender={handleCancelRender}
        />
      </header>

      {/* Main content */}
      <div style={styles.main}>
        {/* Sidebar Tabs */}
        <aside style={styles.sidebar}>
          <nav style={styles.tabNav}>
            <button
              style={{
                ...styles.tabButton,
                ...(activeTab === "settings" ? styles.tabActive : {}),
              }}
              onClick={() => setActiveTab("settings")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
              </svg>
              <span style={styles.tabLabel}>Canvas</span>
            </button>
            <button
              style={{
                ...styles.tabButton,
                ...(activeTab === "elements" ? styles.tabActive : {}),
              }}
              onClick={() => setActiveTab("elements")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 7V4h16v3" /><path d="M9 20h6" /><path d="M12 4v16" />
              </svg>
              <span style={styles.tabLabel}>Elements</span>
            </button>
            <button
              style={{
                ...styles.tabButton,
                ...(activeTab === "assets" ? styles.tabActive : {}),
              }}
              onClick={() => setActiveTab("assets")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span style={styles.tabLabel}>Assets</span>
            </button>
          </nav>
        </aside>

        {/* Content panel */}
        <section style={styles.content}>
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
      </div>
    </div>
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
    width: 56,
    flexShrink: 0,
    background: "var(--bg-secondary)",
    borderRight: "1px solid var(--border-color)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 8,
  },
  tabNav: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    width: "100%",
    padding: "0 4px",
  },
  tabButton: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    padding: "10px 4px",
    border: "none",
    borderRadius: "var(--radius-sm)",
    background: "transparent",
    color: "var(--text-muted)",
    cursor: "pointer",
    transition: "all var(--transition)",
    fontSize: 10,
    fontWeight: 500,
    letterSpacing: "0.02em",
  },
  tabActive: {
    background: "var(--accent-bg)",
    color: "var(--accent)",
  },
  tabLabel: {
    fontSize: 10,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  },
  content: {
    flex: 1,
    overflow: "auto",
    padding: "24px 28px",
    background: "var(--bg-primary)",
  },
};
