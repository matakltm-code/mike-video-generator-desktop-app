# Mike Video Generator — Project Plan

A Windows desktop application for composing short-form videos with text overlays, images, and background music, powered by [Remotion](https://remotion.dev) and [Electron](https://www.electronjs.org/).

---

## Table of Contents

1. [Product Requirements](#1-product-requirements)
2. [User Experience & Workflow](#2-user-experience--workflow)
3. [Architecture](#3-architecture)
4. [Configuration Schema](#4-configuration-schema)
5. [Component Reference](#5-component-reference)
6. [Packaging & Distribution](#6-packaging--distribution)
7. [Common Pitfalls & Solutions](#7-common-pitfalls--solutions)

---

## 1. Product Requirements

### 1.1 Scope (MVP)

| In Scope | Cut for MVP |
|---|---|
| Single composition editor (one video at a time) | Multi-project library / save-load projects |
| Canvas: custom width/height, background color, 9:16 preset | Gradient/animated backgrounds |
| Text elements with 3 animation presets (fade, slide-up, scale-in) | Custom keyframe curves / Bézier editors |
| Image overlays with absolute positioning + opacity | Video overlays / green screen |
| Single background music track (loop or trim) | Multi-layer audio mixing / voiceover recording |
| Local MP4 render via Remotion CLI | Real-time timeline scrubbing preview |
| Windows-only packaging via Electron Builder | macOS / Linux builds |
| Asset upload via native file picker | Drag-and-drop from browser / cloud imports |

### 1.2 Core Features

#### A. Canvas Configurator
- Configure width, height, FPS (30 default), duration (seconds), and background hex color
- One-click **9:16 preset** set to 1080×1920, 30fps, 15 seconds

#### B. Dynamic Timeline
- Track-based JSON schema where each element has `from` (frame start), `durationInFrames`, `type`, and `animation` properties
- Remotion's `<Sequence>` and `interpolate()` drive all motion — no custom animation engine needed

#### C. Asset Upload Management
- Electron `dialog.showOpenDialog` selects local files via native file picker
- Main process copies assets into a temporary directory inside the app's user data path
- Remotion references assets via absolute `file://` paths passed through JSON props

#### D. Local Rendering Pipeline
- Electron Main spawns `npx remotion render` as a child process
- CLI stderr is parsed for progress percentages and piped back to the renderer via IPC
- Output MP4 is written to a user-selected directory

---

## 2. User Experience & Workflow

### 2.1 Step-by-Step User Journey

```
LAUNCH APP
└─> Electron window opens. GUI shows "New Video" canvas (1080×1920 black).

STEP 1: CANVAS SETUP
└─> User clicks "9:16 Vertical" preset. Canvas updates to 1080×1920.
└─> User sets duration to 10s (300 frames). Background set to #0a0a0a.

STEP 2: ADD ASSETS
└─> User clicks "Upload Logo" → Native file picker opens.
└─> User selects logo.png. File copied to app assets dir.
└─> Thumbnail appears in asset panel. User positions it (x: 40, y: 40).
└─> User clicks "Add Background Music" → selects beat.mp3.
└─> Music appears in audio track; user checks "Loop" checkbox.

STEP 3: ADD TEXT
└─> User clicks "Add Text". Default text "Your Headline" appears.
└─> User edits text, sets font size (72px), color (#ffffff).
└─> User sets Start Time: 1.0s, Duration: 3.0s.
└─> User selects Animation: "Slide Up".

STEP 4: RENDER
└─> User clicks "Render MP4".
└─> GUI state locks inputs. Progress bar appears at 0%.
└─> Main process spawns Remotion CLI.
└─> Stderr parsed: "Rendered frame 150/300" → Progress bar updates to 50%.
└─> Render completes. "Save File" dialog opens. User saves to Desktop.
└─> Toast notification: "Video saved to C:\Users\Mike\Desktop\video.mp4"
```

### 2.2 UI State Machine

| State | Renderer UI | Main Process |
|---|---|---|
| `IDLE` | All inputs editable. Render button active. | Waiting for IPC. |
| `VALIDATING` | "Preparing assets..." spinner. | Copies files, validates paths, writes JSON. |
| `RENDERING` | Progress bar (0–100%). Cancel button shown. | `spawn` active. Parsing stderr. |
| `SUCCESS` | "Open File" button + path display. | Process exited code 0. |
| `ERROR` | Red toast with stderr tail. | Process exited non-zero. |

---

## 3. Architecture

### 3.1 System Overview

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ELECTRON RENDERER (React GUI)                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ CanvasConfig │  │ AssetPanel   │  │ TimelineForm │  │ RenderControls   │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘  │
│         └──────────────────┴─────────────────┴─────────────────┘            │
│                              │                                               │
│                              ▼ IPC (contextBridge)                           │
│  window.electronAPI.selectFile()   window.electronAPI.startRender(config)    │
│                              │                                               │
└──────────────────────────────┼───────────────────────────────────────────────┘
                               │
┌──────────────────────────────┼───────────────────────────────────────────────┐
│  ELECTRON MAIN (Node.js)     │                                               │
│                              ▼                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  IPC Handlers                                                        │   │
│  │  ├── select-file → dialog.showOpenDialog → copy to appData/assets   │   │
│  │  └── start-render → write config.json → spawn remotion CLI          │   │
│  │                                                                      │   │
│  │  child_process.spawn('npx', ['remotion', 'render', ...])            │   │
│  │       │                                                              │   │
│  │       ▼ stderr                                                       │   │
│  │  Parse "Rendered frame X/Y" → win.webContents.send('render-progress')│   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                              │                                               │
└──────────────────────────────┼───────────────────────────────────────────────┘
                               │
┌──────────────────────────────┼───────────────────────────────────────────────┐
│  REMOTION PROJECT (React)    │                                               │
│                              ▼                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  Root.tsx registers <Composition> with id="MikeVideo"               │   │
│  │                                                                      │   │
│  │  MainComposition.tsx receives props={config} via --props flag        │   │
│  │  ├── Maps config.tracks.elements → <TextElement />, <ImageElement /> │   │
│  │  ├── Maps config.tracks.audio → <Audio /> components                │   │
│  │  └── Background color from config.canvas.backgroundColor            │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                              │                                               │
│                              ▼                                               │
│                    FFmpeg encodes frames → out/video.mp4                     │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 IPC Communication

The preload script exposes a typed API via `contextBridge`:

| Channel | Direction | Purpose |
|---|---|---|
| `select-file` | Renderer → Main | Open native file picker |
| `save-dialog` | Renderer → Main | Open native save dialog (output path) |
| `start-render` | Renderer → Main | Begin video render with config |
| `cancel-render` | Renderer → Main | Kill the active render process |
| `render-progress` | Main → Renderer | Percentage update (0–100) |
| `render-complete` | Main → Renderer | Render finished successfully |
| `render-error` | Main → Renderer | Render failed with error details |

### 3.3 Directory Layout

```
mike-video-generator/
├── electron/
│   ├── main.ts               # Electron main process, IPC handlers
│   ├── preload.ts             # contextBridge API exposure
│   └── vite.config.ts
├── gui/
│   ├── src/
│   │   ├── main.tsx           # React entry point
│   │   ├── App.tsx            # Root component, state management
│   │   ├── components/
│   │   │   ├── CanvasSettings.tsx
│   │   │   ├── ElementEditor.tsx
│   │   │   ├── AssetUploader.tsx
│   │   │   └── RenderControls.tsx
│   │   └── hooks/
│   │       └── useElectron.ts # Typed wrapper for window.electronAPI
│   └── index.html
├── remotion/
│   ├── index.tsx              # registerRoot entry
│   ├── Root.tsx               # Composition registration
│   ├── types.ts               # Re-exports from shared
│   ├── compositions/
│   │   └── MainComposition.tsx # Root composition component
│   └── components/
│       ├── TextElement.tsx     # Animated text overlay
│       ├── ImageElement.tsx    # Image overlay
│       └── AudioTrack.tsx     # Background audio
├── shared/
│   └── VideoConfig.ts          # Single source-of-truth types
├── package.json
├── electron.vite.config.ts
└── remotion.config.ts
```

---

## 4. Configuration Schema

The JSON schema below is the **single source of truth** — the GUI builds it, the Main process writes it to disk, and Remotion consumes it via the `--props` flag.

```typescript
export interface VideoConfig {
  version: "1.0";
  canvas: {
    width: number;            // e.g., 1080
    height: number;           // e.g., 1920
    fps: number;              // e.g., 30
    durationInFrames: number; // fps × durationSeconds
    backgroundColor: string;  // hex, e.g., "#0a0a0a"
  };
  tracks: {
    audio: AudioTrack[];
    elements: VisualElement[];
  };
}

export interface AudioTrack {
  id: string;
  src: string;                // Absolute file path
  from: number;               // Start frame
  durationInFrames: number;
  volume?: number;            // 0.0–1.0
  loop?: boolean;
  trimBefore?: number;        // Frames to trim from start
  trimAfter?: number;         // Frames to trim from end
}

export type VisualElement = TextElement | ImageElement;

interface BaseElement {
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
  src: string;                // Absolute file path
  size?: {
    width?: number;
    height?: number;
    objectFit?: "cover" | "contain" | "fill";
  };
}
```

---

## 5. Component Reference

### 5.1 MainComposition — Root Composition

Dispatches audio and visual elements into Remotion `<Sequence>` wrappers.

```tsx
import { AbsoluteFill, Sequence } from "remotion";
import { Audio } from "@remotion/media";
import { VideoConfig } from "../types";
import { TextElement } from "../components/TextElement";
import { ImageElement } from "../components/ImageElement";

export const MainComposition: React.FC<VideoConfig> = (props) => {
  return (
    <AbsoluteFill style={{ backgroundColor: props.canvas.backgroundColor }}>
      {props.tracks.audio.map((track) => (
        <Audio
          key={track.id}
          src={track.src}
          startFrom={track.trimBefore}
          endAt={track.trimAfter}
          volume={track.volume ?? 1}
        />
      ))}

      {props.tracks.elements.map((el) => (
        <Sequence key={el.id} from={el.from} durationInFrames={el.durationInFrames}>
          {el.type === "text" && <TextElement element={el} fps={props.canvas.fps} />}
          {el.type === "image" && <ImageElement element={el} />}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
```

### 5.2 TextElement — Animated Text Overlay

Supports three animations via `useCurrentFrame` and `interpolate`:

- **fadeIn** — opacity 0→1
- **slideUp** — translateY 50px→0 + opacity 0→1
- **scaleIn** — scale 0.5→1 + opacity 0→1

```tsx
import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion";
import { TextElement as TextElementType } from "../types";

export const TextElement: React.FC<{
  element: TextElementType;
  fps: number;
}> = ({ element }) => {
  const frame = useCurrentFrame();
  const { animation, style, position, opacity = 1 } = element;

  let animatedOpacity = opacity;
  let transform = "translate(0,0) scale(1)";

  if (animation && frame < animation.durationInFrames) {
    const progress = interpolate(
      frame,
      [0, animation.durationInFrames],
      [0, 1],
      { extrapolateRight: "clamp" }
    );

    switch (animation.type) {
      case "fadeIn":
        animatedOpacity = progress * opacity;
        break;
      case "slideUp":
        animatedOpacity = progress * opacity;
        transform = `translateY(${interpolate(progress, [0, 1], [50, 0])}px)`;
        break;
      case "scaleIn":
        animatedOpacity = progress * opacity;
        transform = `scale(${interpolate(progress, [0, 1], [0.5, 1])})`;
        break;
    }
  }

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          position: "absolute",
          left: position.x,
          top: position.y,
          opacity: animatedOpacity,
          transform,
          fontSize: style.fontSize,
          color: style.color,
          fontFamily: style.fontFamily,
          fontWeight: style.fontWeight,
          textAlign: style.textAlign || "left",
          whiteSpace: "nowrap",
        }}
      >
        {element.text}
      </div>
    </AbsoluteFill>
  );
};
```

### 5.3 ImageElement — Image Overlay

Renders a positioned image with configurable sizing.

```tsx
import { Img } from "remotion";
import { ImageElement as ImageElementType } from "../types";

export const ImageElement: React.FC<{ element: ImageElementType }> = ({
  element,
}) => {
  const { position, size, opacity = 1 } = element;

  return (
    <Img
      src={element.src}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        width: size?.width ?? "auto",
        height: size?.height ?? "auto",
        opacity,
        objectFit: size?.objectFit ?? "contain",
      }}
    />
  );
};
```

### 5.4 AudioTrack — Background Audio

```tsx
import { Audio } from "@remotion/media";
import { AudioTrack as AudioTrackType } from "../types";

export const AudioTrack: React.FC<{ track: AudioTrackType }> = ({ track }) => {
  return (
    <Audio
      src={track.src}
      startFrom={track.trimBefore}
      endAt={track.trimAfter}
      volume={track.volume ?? 1}
    />
  );
};
```

### 5.5 Start-Render IPC Handler (Main Process)

The core handler that marshals assets, writes the config JSON, and spawns the Remotion CLI.

```typescript
import { ipcMain } from "electron";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import { VideoConfig } from "../shared/VideoConfig";

ipcMain.handle(
  "start-render",
  async (event, config: VideoConfig, outputPath: string) => {
    const tempDir = path.join(os.tmpdir(), `mike-video-${Date.now()}`);
    fs.mkdirSync(tempDir, { recursive: true });

    const configCopy: VideoConfig = JSON.parse(JSON.stringify(config));

    // Copy assets and rewrite paths to temp dir
    const copyAsset = (srcPath: string): string => {
      const dest = path.join(tempDir, path.basename(srcPath));
      fs.copyFileSync(srcPath, dest);
      return dest;
    };

    configCopy.tracks.audio = configCopy.tracks.audio.map((t) => ({
      ...t,
      src: copyAsset(t.src),
    }));

    configCopy.tracks.elements = configCopy.tracks.elements.map((el) => {
      if (el.type === "image") return { ...el, src: copyAsset(el.src) };
      return el;
    });

    const propsPath = path.join(tempDir, "props.json");
    fs.writeFileSync(propsPath, JSON.stringify(configCopy, null, 2));

    const npxCmd = process.platform === "win32" ? "npx.cmd" : "npx";

    const proc = spawn(npxCmd, [
      "remotion", "render",
      "remotion/index.tsx", "MikeVideo",
      outputPath,
      `--props=${propsPath}`,
      "--log=verbose",
    ], {
      cwd: process.cwd(),
      shell: process.platform === "win32",
    });

    let stderrBuf = "";
    const progressPatterns = [
      /Rendered frame\s+(\d+)\/(\d+)/i,
      /Rendering frame\s+(\d+)\s*\/\s*(\d+)/i,
      /(\d+)\/(\d+)\s*frames rendered/i,
    ];

    proc.stderr.on("data", (data) => {
      const str = data.toString();
      stderrBuf += str;
      for (const line of str.split("\n")) {
        for (const pattern of progressPatterns) {
          const match = line.match(pattern);
          if (match) {
            const current = parseInt(match[1], 10);
            const total = parseInt(match[2], 10);
            event.sender.send("render-progress", Math.round((current / total) * 100));
            break;
          }
        }
      }
    });

    return new Promise((resolve, reject) => {
      proc.on("close", (code) => {
        if (code === 0) {
          event.sender.send("render-complete", outputPath);
          resolve(null);
        } else {
          const errorTail = stderrBuf.split("\n").slice(-10).join("\n");
          event.sender.send("render-error", errorTail);
          reject(new Error(`Render failed with code ${code}`));
        }
      });
    });
  }
);
```

### 5.6 Cancel-Render Handler

```typescript
let activeRender: ReturnType<typeof spawn> | null = null;

// Inside start-render handler:
activeRender = proc;

ipcMain.handle("cancel-render", () => {
  if (activeRender) {
    activeRender.kill("SIGTERM");
    activeRender = null;
  }
});
```

### 5.7 FFmpeg Detection (App Startup)

```typescript
import { execSync } from "child_process";

function checkFFmpeg(): boolean {
  try {
    execSync("ffmpeg -version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

app.on("ready", () => {
  if (!checkFFmpeg()) {
    dialog.showErrorBox(
      "FFmpeg Required",
      "FFmpeg is not found in PATH. Please install it: https://ffmpeg.org/download.html"
    );
    app.quit();
  }
});
```

---

## 6. Packaging & Distribution

### 6.1 Electron Builder Configuration

Add to `package.json`:

```json
{
  "build": {
    "appId": "com.mike.videogenerator",
    "productName": "Mike Video Generator",
    "directories": { "output": "release" },
    "files": [
      "dist-electron/**/*",
      "dist-gui/**/*",
      "remotion/**/*",
      "shared/**/*",
      "node_modules/**/*"
    ],
    "win": { "target": "nsis", "icon": "build/icon.ico" },
    "nsis": { "oneClick": false, "allowToChangeInstallationDirectory": true }
  }
}
```

> **Important:** The `remotion/` and `shared/` directories must be included in `build.files` so the packaged app can find them at runtime.

### 6.2 Build Commands

```bash
npm run dev       # Development mode (hot reload)
npm run build     # Production build
npm run dist      # Package Windows NSIS installer
```

### 6.3 Pre-Release Checklist

- [ ] `remotion.config.ts` exists with `Config.setVideoImageFormat("jpeg")` for faster renders
- [ ] `remotion/index.tsx` is not inside `gui/src/` (it is a separate entry point)
- [ ] `remotion/` and `shared/` are listed in `electron-builder`'s `build.files`
- [ ] `preload.ts` exposes exactly the API the renderer expects
- [ ] `tsconfig.json` has `"moduleResolution": "bundler"` for Vite compatibility

---

## 7. Common Pitfalls & Solutions

| Bug | Root Cause | Prevention |
|---|---|---|
| Remotion can't find assets | Absolute paths with backslashes break JSON or Remotion's URL parser | Always copy assets to temp dir and use `path.join()` (normalizes separators) |
| FFmpeg not found in packaged app | Remotion requires FFmpeg in PATH; users don't have it | Check on startup with FFmpeg detection. Bundle `ffmpeg-static` and set `FFMPEG_PATH` if bundled |
| Renderer can't use `require("child_process")` | Electron security blocks Node modules in renderer | Always use `contextBridge` in preload. Never set `nodeIntegration: true` |
| `npx` not found in packaged app | Packaged Electron apps don't inherit shell PATH on Windows | Use `shell: true` in spawn options on Windows, or use `npm exec` with full path to `node_modules/.bin/remotion` |
| Remotion composition not found | Composition ID mismatch between CLI and `Root.tsx` | Hardcode `"MikeVideo"` everywhere. Register only one composition in `Root.tsx` |
| Progress bar stuck at 0% | Parsing wrong output stream or regex mismatch | Remotion logs progress to **stderr** in verbose mode. Listen to `stderr`, not `stdout` |
| EACCES / permission denied on render | Output path in protected directory (Program Files) | Default save dialog to `app.getPath("desktop")` or `app.getPath("downloads")` |
| White screen after packaging | Vite build paths incorrect in production | Use `__dirname` resolution: `path.join(__dirname, "../dist-gui/index.html")` |
| Audio out of sync / missing | `<Audio>` imported from wrong module | Use `import { Audio } from "@remotion/media"`, NOT from `"remotion"` |
| Images don't appear | Using `staticFile()` for user-uploaded files outside `public/` | Pass absolute `file://` paths directly to `src` prop. Only use `staticFile()` for built-in assets |
