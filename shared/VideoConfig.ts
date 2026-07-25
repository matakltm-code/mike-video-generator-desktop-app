// ─── Video Config — Single Source of Truth ────────────────────────────
// The GUI builds this, Main writes it to disk, and Remotion consumes it.

export interface VideoConfig {
  version: "1.0";
  canvas: {
    width: number;
    height: number;
    fps: number;
    durationInFrames: number;
    backgroundColor: string;
    /**
     * Optional scene backgrounds for multi-scene templates.
     * When present, the composition renders each scene as a colored
     * fullscreen div wrapped in a <Sequence>. The first scene starts
     * at frame 0. The final scene extends to `durationInFrames`.
     */
    scenes?: SceneBackground[];
  };
  tracks: {
    audio: AudioTrack[];
    elements: VisualElement[];
  };
}

export interface SceneBackground {
  from: number;
  color: string;
}

export interface AudioTrack {
  id: string;
  src: string;
  from: number;
  durationInFrames: number;
  volume?: number;
  loop?: boolean;
  trimBefore?: number;
  trimAfter?: number;
}

export type VisualElement = TextElement | ImageElement;

export interface BaseElement {
  id: string;
  from: number;
  durationInFrames: number;
  position: { x: number; y: number };
  opacity?: number;
}

export interface TextElement extends BaseElement {
  type: "text";
  text: string;
  style: {
    fontSize: number;
    color: string;
    fontFamily: string;
    fontWeight?: number;
    textAlign?: "left" | "center" | "right";
  };
  animation?: {
    type: "fadeIn" | "slideUp" | "scaleIn";
    durationInFrames: number;
  };
}

export interface ImageElement extends BaseElement {
  type: "image";
  src: string;
  size?: {
    width?: number;
    height?: number;
    objectFit?: "cover" | "contain" | "fill";
  };
}

// ─── Electron API types ───────────────────────────────────────────────

export interface ElectronAPI {
  selectFile: (filters?: FileFilter[]) => Promise<string | null>;
  saveDialog: (defaultName?: string) => Promise<string | null>;
  startRender: (config: VideoConfig, outputPath: string) => Promise<void>;
  cancelRender: () => Promise<void>;
  onRenderProgress: (callback: (percent: number) => void) => void;
  onRenderComplete: (callback: (outputPath: string) => void) => void;
  onRenderError: (callback: (error: string) => void) => void;
  removeAllListeners: (channel: string) => void;
}

export interface FileFilter {
  name: string;
  extensions: string[];
}

// ─── UI State ─────────────────────────────────────────────────────────

export type RenderState = "IDLE" | "VALIDATING" | "RENDERING" | "SUCCESS" | "ERROR";

// ─── Default config preset ────────────────────────────────────────────

export const DEFAULT_CONFIG: VideoConfig = {
  version: "1.0",
  canvas: {
    width: 1080,
    height: 1920,
    fps: 30,
    durationInFrames: 450,
    backgroundColor: "#0a0a0a",
  },
  tracks: {
    audio: [],
    elements: [],
  },
};

// ─── Template definition ──────────────────────────────────────────────

export interface VideoTemplate {
  id: string;
  name: string;
  description: string;
  duration: number; // seconds
  category: "Branding" | "Product" | "Social" | "Educational";
  color: string; // preview color
  icon: string; // emoji icon for the card
  generate: (overrides?: Record<string, string>) => VideoConfig;
}
