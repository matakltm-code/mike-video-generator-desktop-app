I'll research the latest Remotion APIs and Electron integration patterns to ensure this blueprint is fully current and accurate
Here is your production-grade, end-to-end blueprint for **Mike Video Generator**. Every section contains concrete file structures, code patterns, and copy-pasteable prompts optimized for AI-assisted development.

---

# 1. PRODUCT REQUIREMENTS DOCUMENT (PRD) SUMMARY

## Scope & Boundaries (4-Hour MVP)

| **IN SCOPE** | **CUT FOR MVP** |
|---|---|
| Single composition editor (one video at a time) | Multi-project library / save/load projects |
| Canvas: custom width/height, background color, 9:16 preset | Gradient/animated backgrounds |
| Text elements with 3 animation presets (fade, slide-up, scale-in) | Custom keyframe curves / Bézier editors |
| Image overlays with absolute positioning + opacity | Video overlays / green screen |
| Single background music track (loop or trim) | Multi-layer audio mixing / voiceover recording |
| Local MP4 render via Remotion CLI | Real-time timeline scrubbing preview |
| Windows-only packaging via Electron Builder | macOS / Linux builds |
| Asset upload via native file picker | Drag-and-drop from browser / cloud imports |

## Core Features

### A. Settings Input
- **Canvas Configurator**: Width, Height, FPS (30 default), Duration (seconds), Background Hex Color.
- **9:16 Quick Preset**: One-click set to 1080×1920, 30fps, 15 seconds.

### B. Dynamic Timeline Generation
- **Track-based JSON schema** (see Section 3) where each element has `from` (frame start), `durationInFrames`, `type`, and `animation` properties.
- Remotion's `<Sequence>` and `interpolate()` drive all motion. No custom animation engine.

### C. Asset Upload Management
- Electron `dialog.showOpenDialog` selects local files.
- Main process **copies** assets into a temporary `assets/` subdirectory inside the app's user data path.
- Remotion references assets via absolute `file://` paths passed through JSON props.

### D. Local Rendering Pipeline
- Electron Main spawns `npx remotion render` as a `child_process`.
- CLI stdout/stderr is parsed for progress percentages and piped back to the renderer via IPC.
- Output MP4 is written to a user-selected directory.

---

# 2. USER EXPERIENCE & WORKFLOW

### Step-by-Step User Journey

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  LAUNCH APP                                                                 │
│  └─> Electron window opens. GUI shows "New Video" canvas (1080×1920 black). │
│                                                                               │
│  STEP 1: CANVAS SETUP                                                         │
│  └─> User clicks "9:16 Vertical" preset. Canvas updates to 1080×1920.        │
│  └─> User sets duration to 10s (300 frames). Background set to #0a0a0a.     │
│                                                                               │
│  STEP 2: ADD ASSETS                                                           │
│  └─> User clicks "Upload Logo" → Native file picker opens.                    │
│  └─> User selects `logo.png`. File copied to app assets dir.                 │
│  └─> Thumbnail appears in asset panel. User drags to position (x: 40, y: 40). │
│  └─> User clicks "Add Background Music" → selects `beat.mp3`.               │
│  └─> Music appears in audio track; user checks "Loop" checkbox.              │
│                                                                               │
│  STEP 3: ADD TEXT                                                             │
│  └─> User clicks "Add Text". Default text "Your Headline" appears.           │
│  └─> User edits text, sets font size (72px), color (#ffffff).               │
│  └─> User sets Start Time: 1.0s, Duration: 3.0s.                            │
│  └─> User selects Animation: "Slide Up".                                      │
│                                                                               │
│  STEP 4: RENDER                                                               │
│  └─> User clicks "Render MP4".                                                │
│  └─> GUI state locks inputs. Progress bar appears at 0%.                       │
│  └─> Main process spawns Remotion CLI.                                        │
│  └─> Stdout parsed: "Rendered frame 150/300" → Progress bar updates to 50%. │
│  └─> Render completes. "Save File" dialog opens. User saves to Desktop.      │
│  └─> Toast notification: "Video saved to C:\Users\Mike\Desktop\video.mp4"   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### UI State Machine

| State | Renderer UI | Main Process |
|---|---|---|
| `IDLE` | All inputs editable. Render button active. | Waiting for IPC. |
| `VALIDATING` | "Preparing assets..." spinner. | Copies files, validates paths, writes JSON. |
| `RENDERING` | Progress bar (0-100%). Cancel button shown. | `spawn` active. Parsing stdout. |
| `SUCCESS` | "Open File" button + path display. | Process exited code 0. |
| `ERROR` | Red toast with stderr tail. | Process exited non-zero. |

---

# 3. ARCHITECTURE & INTER-PROCESS DATA FLOW

## System Diagram

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
│  │                                                                     │   │
│  │  child_process.spawn('npx', ['remotion', 'render', ...])          │   │
│  │       │                                                             │   │
│  │       ▼ stdout/stderr                                               │   │
│  │  Parse "Rendered frame X/Y" → win.webContents.send('render-progress', pct)│
│  └──────────────────────────────────────────────────────────────────────┘   │
│                              │                                               │
└──────────────────────────────┼───────────────────────────────────────────────┘
                               │
┌──────────────────────────────┼───────────────────────────────────────────────┐
│  REMOTION PROJECT (React/Node)│                                               │
│                              ▼                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  Root.tsx registers <Composition> with id="MikeVideo"               │   │
│  │                                                                     │   │
│  │  MainComposition.tsx receives props={config} via --props flag      │   │
│  │  ├── Maps config.tracks.elements → <TextElement />, <ImageElement />│   │
│  │  ├── Maps config.tracks.audio → <Audio /> components                  │   │
│  │  └── Background color from config.canvas.backgroundColor             │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                              │                                               │
│                              ▼                                               │
│                    FFmpeg encodes frames → out/video.mp4                     │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Production-Ready JSON Configuration Schema

This schema is the **single source of truth**. The GUI builds it; Main writes it; Remotion consumes it.

```typescript
// types/VideoConfig.ts
export interface VideoConfig {
  version: "1.0";
  canvas: {
    width: number;        // e.g., 1080
    height: number;       // e.g., 1920
    fps: number;          // e.g., 30
    durationInFrames: number; // fps * durationSeconds
    backgroundColor: string;   // hex, e.g., "#0a0a0a"
  };
  tracks: {
    audio: AudioTrack[];
    elements: VisualElement[];
  };
}

export interface AudioTrack {
  id: string;
  src: string;           // Absolute file path (Windows: C:\\... or file://...)
  from: number;          // Start frame
  durationInFrames: number;
  volume?: number;      // 0.0 - 1.0
  loop?: boolean;
  trimBefore?: number;  // Frames to trim from start of file
  trimAfter?: number;   // Frames to trim from end of file
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
  src: string;           // Absolute file path
  size?: {
    width?: number;
    height?: number;
    objectFit?: "cover" | "contain" | "fill";
  };
}
```

---

# 4. 4-HOUR AI-ASSISTED IMPLEMENTATION SPRINT PLAN

## Pre-Sprint Setup (Do This Once Before Hour 1)
Create a folder `mike-video-generator/` and open it in Cursor/Antigravity.

---

## HOUR 1: Environment, Scaffolding & Types

### Minute 0-15: Initialize Project Structure
Run these terminal commands exactly:

```bash
# Create project
mkdir mike-video-generator && cd mike-video-generator
npm init -y

# Install Electron + Vite tooling
npm install electron electron-vite @vitejs/plugin-react
npm install -D typescript @types/node @types/react @types/react-dom

# Install Remotion
npm install remotion @remotion/cli @remotion/media
npm install -D @remotion/tailwind

# Install utilities
npm install zod uuid
npm install -D @types/uuid
```

### Minute 15-30: Create File Tree
Create these empty files (AI will fill them):

```
mike-video-generator/
├── electron/
│   ├── main.ts
│   ├── preload.ts
│   └── vite.config.ts
├── gui/
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── CanvasSettings.tsx
│   │   │   ├── ElementEditor.tsx
│   │   │   ├── AssetUploader.tsx
│   │   │   └── RenderControls.tsx
│   │   └── hooks/
│   │       └── useElectron.ts
│   └── index.html
├── remotion/
│   ├── index.tsx
│   ├── Root.tsx
│   ├── compositions/
│   │   └── MainComposition.tsx
│   ├── components/
│   │   ├── TextElement.tsx
│   │   ├── ImageElement.tsx
│   │   └── AudioTrack.tsx
│   └── types.ts
├── shared/
│   └── VideoConfig.ts
├── package.json
└── electron.vite.config.ts
```

### Minute 30-60: AI Prompt — Scaffold & Types
**Copy-paste this into Cursor Composer / Antigravity:**

```
Generate the complete boilerplate for an Electron + Remotion desktop app called "Mike Video Generator".

1. Create `shared/VideoConfig.ts` with the exact TypeScript interfaces I provide:
   - VideoConfig with canvas (width, height, fps, durationInFrames, backgroundColor)
   - AudioTrack with id, src, from, durationInFrames, volume, loop, trimBefore, trimAfter
   - VisualElement union of TextElement and ImageElement
   - TextElement with type "text", text, style (fontSize, color, fontFamily, fontWeight, textAlign), animation (type: "fadeIn"|"slideUp"|"scaleIn", durationInFrames)
   - ImageElement with type "image", src, size (width, height, objectFit)
   - BaseElement with id, from, durationInFrames, position (x,y), opacity

2. Create `electron/preload.ts` exposing a contextBridge API with:
   - selectFile(options: {filters: {name, extensions}[]}) => Promise<string[]>
   - startRender(config: VideoConfig, outputPath: string) => Promise<void>
   - onRenderProgress(callback: (progress: number) => void)
   - onRenderComplete(callback: (outputPath: string) => void)
   - onRenderError(callback: (error: string) => void)

3. Create `electron/main.ts` with:
   - A BrowserWindow with preload script, nodeIntegration false, contextIsolation true
   - IPC handlers for select-file (using dialog.showOpenDialog), start-render
   - For start-render: write config to temp JSON, spawn `npx remotion render remotion/index.tsx MikeVideo outputPath --props=configPath`
   - Parse stdout for "Rendered frame X/Y" pattern and send progress to renderer
   - Handle process exit codes

4. Create `package.json` scripts:
   - "dev": "electron-vite dev"
   - "build": "electron-vite build"
   - "preview": "electron-vite preview"
   - "dist": "electron-builder"

Use TypeScript. Use ES modules. Ensure all types are strictly defined.
```

### Minute 60-60: Validate
Run `npm run dev`. You should see a blank Electron window. If it fails, fix the `electron.vite.config.ts` path aliases.

---

## HOUR 2: Remotion Video Engine

### AI Prompt — Remotion Core

```
In the `remotion/` directory, build the complete Remotion video engine for Mike Video Generator.

1. `remotion/types.ts` should re-export from `../shared/VideoConfig.ts`.

2. `remotion/index.tsx`:
   - Import {registerRoot} from 'remotion'
   - Import Root from './Root'
   - registerRoot(Root)

3. `remotion/Root.tsx`:
   - Import {Composition} from 'remotion'
   - Register ONE composition with id="MikeVideo"
   - Width, height, fps, durationInFrames come from DEFAULT_CONFIG (a fallback VideoConfig)
   - The component prop is MainComposition
   - Pass defaultProps={DEFAULT_CONFIG}

4. `remotion/compositions/MainComposition.tsx`:
   - Accept props: VideoConfig
   - Return <AbsoluteFill> with style={{backgroundColor: props.canvas.backgroundColor}}
   - Render all props.tracks.audio using <Audio> from '@remotion/media' with absolute src paths
   - Render all props.tracks.elements:
     - If type "text", render <TextElement>
     - If type "image", render <ImageElement>
   - Wrap each element in a <Sequence from={el.from} durationInFrames={el.durationInFrames}>

5. `remotion/components/TextElement.tsx`:
   - Props: {element: TextElement, fps: number}
   - Use useCurrentFrame()
   - Implement three animations using interpolate():
     - fadeIn: opacity 0->1 over animation.durationInFrames
     - slideUp: translateY 50px->0 + opacity 0->1
     - scaleIn: scale 0.5->1 + opacity 0->1
   - Apply animation only for frames < element.from + animation.durationInFrames
   - Use <AbsoluteFill> or absolute positioning with left/top from element.position
   - Style: fontSize, color, fontFamily, fontWeight, textAlign

6. `remotion/components/ImageElement.tsx`:
   - Props: {element: ImageElement}
   - Use <Img> from 'remotion' with src={element.src}
   - Apply absolute positioning, width/height from element.size
   - Use objectFit style mapping

7. `remotion/components/AudioTrack.tsx`:
   - Props: {track: AudioTrack}
   - Use <Audio> from '@remotion/media'
   - Pass src, from, durationInFrames, volume
   - If track.loop is true and track.durationInFrames is longer than native audio duration, wrap in a loop logic using multiple <Audio> instances or document that Remotion handles looping via repeat logic in parent

Use strict TypeScript. Ensure all Remotion imports are correct for v4.x. Use staticFile() only for files in public/; for user-selected files use absolute paths directly in src props.
```

### Critical Code Patterns (Verify These Post-Generation)

**`MainComposition.tsx` skeleton:**
```tsx
import { AbsoluteFill, Sequence } from 'remotion';
import { Audio } from '@remotion/media';
import { VideoConfig } from '../types';
import { TextElement } from '../components/TextElement';
import { ImageElement } from '../components/ImageElement';

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
          {el.type === 'text' && <TextElement element={el} fps={props.canvas.fps} />}
          {el.type === 'image' && <ImageElement element={el} />}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
```

**`TextElement.tsx` animation pattern:**
```tsx
import { useCurrentFrame, interpolate, AbsoluteFill } from 'remotion';
import { TextElement as TextElementType } from '../types';

export const TextElement: React.FC<{element: TextElementType; fps: number}> = ({element}) => {
  const frame = useCurrentFrame();
  const { animation, style, position, opacity = 1 } = element;
  
  let animatedOpacity = opacity;
  let transform = 'translate(0,0) scale(1)';
  
  if (animation && frame < animation.durationInFrames) {
    const progress = interpolate(frame, [0, animation.durationInFrames], [0, 1], {
      extrapolateRight: 'clamp',
    });
    
    switch (animation.type) {
      case 'fadeIn':
        animatedOpacity = progress * opacity;
        break;
      case 'slideUp':
        animatedOpacity = progress * opacity;
        const y = interpolate(progress, [0, 1], [50, 0]);
        transform = `translateY(${y}px)`;
        break;
      case 'scaleIn':
        animatedOpacity = progress * opacity;
        const scale = interpolate(progress, [0, 1], [0.5, 1]);
        transform = `scale(${scale})`;
        break;
    }
  }
  
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        opacity: animatedOpacity,
        transform,
        fontSize: style.fontSize,
        color: style.color,
        fontFamily: style.fontFamily,
        fontWeight: style.fontWeight,
        textAlign: style.textAlign || 'left',
        whiteSpace: 'nowrap',
      }}>
        {element.text}
      </div>
    </AbsoluteFill>
  );
};
```

### Test
Run `npx remotion studio remotion/index.tsx`. You should see the default composition. If not, fix imports.

---

## HOUR 3: Electron IPC & Render Pipeline

### AI Prompt — IPC & Main Process Render Integration

```
Complete the Electron Main process and GUI integration for Mike Video Generator.

1. In `electron/main.ts`, implement the start-render IPC handler:
   - Accept config: VideoConfig and outputPath: string
   - Create a temp directory using os.tmpdir() + '/mike-video-' + Date.now()
   - Copy all asset src paths (audio and image) into this temp dir, rewriting paths in config to point to temp copies
   - Write the modified config to tempDir + '/props.json'
   - Spawn: `npx remotion render remotion/index.tsx MikeVideo outputPath --props=tempDir/props.json --log=verbose`
   - Use spawn with shell: true on Windows
   - Parse stderr/stdout for progress. Remotion outputs lines like "Rendered frame 120/300". Extract X and Y, calculate percentage = (X/Y)*100
   - Send 'render-progress' events to renderer
   - On exit code 0, send 'render-complete' with outputPath
   - On non-zero, send 'render-error' with last 5 lines of stderr

2. In `gui/src/App.tsx`, build the GUI:
   - React state for VideoConfig initialized with DEFAULT_CONFIG (1080x1920, 15s, 30fps, black bg)
   - Form sections:
     - Canvas: inputs for width, height, fps, duration (seconds), color picker for background
     - "Add Text" button → appends text element to tracks.elements
     - "Add Image" button → calls window.electronAPI.selectFile({filters:[{name:'Images',extensions:['png','jpg']}]}) → appends image element
     - "Add Music" button → calls selectFile with audio filters → appends audio track
   - List all elements with editable fields: start time (seconds), duration (seconds), position x/y, opacity
   - For text elements: editable text content, font size, color, animation dropdown
   - "Render" button → calls window.electronAPI.startRender(config, outputPath) where outputPath comes from a save dialog (use IPC for save dialog too, or hardcode to desktop for MVP)
   - Progress bar component listening to onRenderProgress
   - Toast/alert for complete/error

3. In `gui/src/hooks/useElectron.ts`, create a typed hook that wraps window.electronAPI.

4. Ensure all IPC communication is strictly typed using the shared VideoConfig interface.

Use React functional components with hooks. Use inline styles or plain CSS (no Tailwind required). Keep the UI functional, not beautiful.
```

### Critical Main Process Code (Verify This)

```typescript
// electron/main.ts — start-render handler
import { ipcMain, dialog } from 'electron';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { VideoConfig } from '../shared/VideoConfig';

ipcMain.handle('start-render', async (event, config: VideoConfig, outputPath: string) => {
  const tempDir = path.join(os.tmpdir(), `mike-video-${Date.now()}`);
  fs.mkdirSync(tempDir, { recursive: true });
  
  const configCopy: VideoConfig = JSON.parse(JSON.stringify(config));
  
  // Copy assets and rewrite paths
  const copyAsset = (srcPath: string): string => {
    const fileName = path.basename(srcPath);
    const dest = path.join(tempDir, fileName);
    fs.copyFileSync(srcPath, dest);
    return dest; // Absolute path works with Remotion src props
  };
  
  configCopy.tracks.audio = configCopy.tracks.audio.map(t => ({
    ...t,
    src: copyAsset(t.src),
  }));
  
  configCopy.tracks.elements = configCopy.tracks.elements.map(el => {
    if (el.type === 'image') {
      return { ...el, src: copyAsset(el.src) };
    }
    return el;
  });
  
  const propsPath = path.join(tempDir, 'props.json');
  fs.writeFileSync(propsPath, JSON.stringify(configCopy, null, 2));
  
  // Determine correct npx path
  const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  
  const remotionProcess = spawn(npxCmd, [
    'remotion', 'render',
    'remotion/index.tsx',
    'MikeVideo',
    outputPath,
    `--props=${propsPath}`,
    '--log=verbose',
  ], {
    cwd: process.cwd(),
    shell: process.platform === 'win32',
    env: { ...process.env, FORCE_COLOR: '0' },
  });
  
  let stderrBuffer = '';
  
  remotionProcess.stderr.on('data', (data) => {
    const str = data.toString();
    stderrBuffer += str;
    const lines = str.split('\n');
    
    for (const line of lines) {
      // Match patterns like "Rendered frame 120/300" or "Rendering frame 120 / 300"
      const match = line.match(/Rendered frame\s+(\d+)\/(\d+)/i) || 
                    line.match(/Rendering frame\s+(\d+)\s*\/\s*(\d+)/i);
      if (match) {
        const current = parseInt(match[1], 10);
        const total = parseInt(match[2], 10);
        const pct = Math.round((current / total) * 100);
        event.sender.send('render-progress', pct);
      }
    }
  });
  
  return new Promise((resolve, reject) => {
    remotionProcess.on('close', (code) => {
      if (code === 0) {
        event.sender.send('render-complete', outputPath);
        resolve(null);
      } else {
        const errorTail = stderrBuffer.split('\n').slice(-10).join('\n');
        event.sender.send('render-error', errorTail);
        reject(new Error(`Render failed with code ${code}`));
      }
    });
  });
});
```

---

## HOUR 4: Assets, Progress, Packaging

### Minute 0-30: Asset Path Hardening & Progress UI

**Fix these specific issues immediately:**

1. **Windows Path Escaping**: In the renderer, when displaying paths, always use `path.normalize`. In JSON passed to Remotion, absolute paths with backslashes must be properly JSON-escaped (they will be if you use `JSON.stringify`).

2. **FFmpeg Detection**: Add this check in `electron/main.ts` at app startup:
```typescript
import { execSync } from 'child_process';

function checkFFmpeg(): boolean {
  try {
    execSync('ffmpeg -version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

app.on('ready', () => {
  if (!checkFFmpeg()) {
    dialog.showErrorBox('FFmpeg Required', 
      'FFmpeg is not found in PATH. Please install it: https://ffmpeg.org/download.html');
    app.quit();
  }
});
```

3. **Progress Parsing Robustness**: Remotion's progress output format can vary. Add multiple regex patterns:
```typescript
const progressPatterns = [
  /Rendered frame\s+(\d+)\/(\d+)/i,
  /Rendering frame\s+(\d+)\s*\/\s*(\d+)/i,
  /(\d+)\/(\d+)\s*frames rendered/i,
];

for (const pattern of progressPatterns) {
  const match = line.match(pattern);
  if (match) { /* ... */ break; }
}
```

4. **Cancel Render**: Add a kill switch.
```typescript
// In main.ts, store reference globally
let activeRender: ReturnType<typeof spawn> | null = null;

// In start-render handler:
activeRender = remotionProcess;

// IPC handler for cancel:
ipcMain.handle('cancel-render', () => {
  if (activeRender) {
    activeRender.kill('SIGTERM');
    activeRender = null;
  }
});
```

### Minute 30-45: Electron Builder Configuration

Add to `package.json`:
```json
{
  "build": {
    "appId": "com.mike.videogenerator",
    "productName": "Mike Video Generator",
    "directories": {
      "output": "release"
    },
    "files": [
      "dist-electron/**/*",
      "dist-gui/**/*",
      "remotion/**/*",
      "shared/**/*",
      "node_modules/**/*"
    ],
    "win": {
      "target": "nsis",
      "icon": "build/icon.ico"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true
    }
  }
}
```

**Critical**: Ensure `remotion/` and `shared/` are included in the `files` array so the packaged app can find them.

### Minute 45-60: Final Integration Test

Run this checklist:
1. `npm run dev` → App opens.
2. Set canvas to 1080×1920, 5 seconds.
3. Add text "Hello", position (100, 500), animation "slideUp", start 0s, duration 3s.
4. Add image (select PNG), position (40, 40), size 200×auto.
5. Add audio MP3, loop checked.
6. Click Render → Select Desktop → Save.
7. Verify MP4 plays correctly in VLC/Windows Media Player.
8. Run `npm run dist` → Installer builds in `release/`.

---

# 5. RAILS FOR AN AI WORKFLOW (PROMPTS & BUG PREVENTIONS)

## Exact Prompt Templates

### Prompt A: Scaffold (Hour 1)
```
Create a TypeScript Electron app with Vite that wraps a Remotion video renderer.
Project name: mike-video-generator.

Requirements:
- Use electron-vite for build orchestration
- Two TypeScript source roots: `gui/src/` (React GUI) and `remotion/` (Remotion components)
- Shared types in `shared/VideoConfig.ts`
- Electron main process in `electron/main.ts` with secure preload script
- Preload must expose: selectFile, startRender, onRenderProgress, onRenderComplete, onRenderError
- package.json scripts: dev, build, preview, dist
- Use ES modules (type: module)
- No test files. No storybook. No unnecessary devDependencies.

Generate all config files (tsconfig.json, vite configs, package.json) and empty source files with correct imports.
```

### Prompt B: Remotion Engine (Hour 2)
```
In `remotion/`, build a Remotion v4 composition called "MikeVideo" that renders a video from a JSON config.

The config interface (import from ../shared/VideoConfig.ts) contains:
- canvas: width, height, fps, durationInFrames, backgroundColor
- tracks.audio: array with src (absolute path), from, durationInFrames, volume, loop, trimBefore, trimAfter
- tracks.elements: array of TextElement and ImageElement

Components to create:
1. MainComposition.tsx: Root component. Sets background color. Maps audio to <Audio> from @remotion/media. Maps elements to <Sequence> wrappers.
2. TextElement.tsx: Renders text with absolute positioning. Supports three animations via useCurrentFrame + interpolate: fadeIn, slideUp, scaleIn.
3. ImageElement.tsx: Renders <Img> with absolute positioning, width/height, objectFit.
4. AudioTrack.tsx: Renders <Audio> with proper timing.

Use AbsoluteFill and Sequence from remotion. Use useCurrentFrame and interpolate for animations. All props strictly typed.
```

### Prompt C: GUI & IPC (Hour 3)
```
Build the React GUI in `gui/src/App.tsx` for Mike Video Generator.

Features:
1. Canvas Settings form: width, height, fps, duration (seconds), background color picker. "9:16 Preset" button sets 1080x1920.
2. Asset Manager:
   - "Add Image" button → calls window.electronAPI.selectFile({filters:[{name:'Images',extensions:['png','jpg','jpeg']}]}). Appends ImageElement to config.
   - "Add Audio" button → same but for mp3/wav. Appends AudioTrack.
3. Element List: Show all elements. Editable fields: start time (sec), duration (sec), x, y, opacity. For text: also text content, fontSize, color, animation type dropdown. For images: width, height.
4. Render Section: "Choose Output" button (calls IPC save dialog), then "Render MP4" button. Shows progress bar. Shows "Open File" on complete. Shows error message on failure.

Use useState for VideoConfig. Use the useElectron hook for all IPC calls. Keep styling minimal but functional.
```

### Prompt D: Main Process & Packaging (Hour 4)
```
Complete `electron/main.ts` for Mike Video Generator with these exact behaviors:

1. IPC 'select-file': Open dialog.showOpenDialog. Return first selected path.
2. IPC 'save-dialog': Open dialog.showSaveDialog with defaultPath ending in .mp4. Return path.
3. IPC 'start-render':
   - Create temp dir in os.tmpdir()
   - Copy all audio and image assets from config into temp dir
   - Rewrite config src paths to temp copies
   - Write props.json
   - Spawn: npx remotion render remotion/index.tsx MikeVideo <outputPath> --props=<propsPath> --log=verbose
   - On Windows use shell: true and npx.cmd
   - Parse stderr for "Rendered frame X/Y" and send 'render-progress' to renderer
   - On close code 0, send 'render-complete'
   - On error, send last 10 stderr lines as 'render-error'
4. App startup: Check if ffmpeg is in PATH. If not, show error dialog and quit.
5. Window size: 1400x900, minWidth 1200, minHeight 700.

Also update package.json build config for electron-builder to include remotion/, shared/, and node_modules in packaged app. Windows NSIS target.
```

## Common Breaking Bugs & Immediate Preventions

| **Bug** | **Root Cause** | **Prevention Code** |
|---|---|---|
| **Remotion can't find assets** | Absolute paths with backslashes break JSON or Remotion's URL parser. | Always copy assets to temp dir and use `path.join()` which normalizes separators. |
| **FFmpeg not found in packaged app** | Remotion requires FFmpeg in PATH. Users don't have it. | Check on startup (see Hour 4). Bundle `ffmpeg-static` as dep and set `FFMPEG_PATH` env var if bundled. |
| **Renderer can't use `require('child_process')`** | Electron security blocks Node modules in renderer. | **Always** use `contextBridge` in preload. Never set `nodeIntegration: true`. |
| **`npx` not found in packaged app** | Packaged Electron apps don't inherit shell PATH on Windows. | Use `shell: true` in spawn options on Windows. Or use `npm exec` with full path to `node_modules/.bin/remotion`. |
| **Remotion composition not found** | Composition ID mismatch between CLI and Root.tsx. | Hardcode `"MikeVideo"` everywhere. Register only one composition in Root.tsx. |
| **Progress bar stuck at 0%** | Parsing wrong output stream or regex mismatch. | Remotion logs progress to **stderr** in verbose mode. Listen to `stderr`, not just `stdout`. |
| **EACCES or permission denied on render** | Output path in protected directory (Program Files). | Default save dialog to `app.getPath('desktop')` or `app.getPath('downloads')`. |
| **White screen after packaging** | Vite build paths incorrect in production. | Use `__dirname` resolution in main.ts: `path.join(__dirname, '../dist-gui/index.html')`. |
| **Audio out of sync / missing** | `<Audio>` component not imported from `@remotion/media` in v4. | Use `import {Audio} from '@remotion/media'` NOT from `'remotion'`. |
| **Images don't appear** | Using `staticFile()` for user-uploaded files outside `public/`. | Pass absolute file paths directly to `src` prop. Only use `staticFile()` for built-in assets. |

## Final Packaging Checklist

Before running `npm run dist`:
- [ ] `remotion.config.ts` exists with `Config.setVideoImageFormat('jpeg')` for faster renders.
- [ ] `remotion/index.tsx` is not inside `gui/src/` (separate entry point).
- [ ] `electron-builder` includes `remotion/`, `shared/`, `node_modules/@remotion/` in `build.files`.
- [ ] `preload.ts` exposes exactly the API the renderer expects.
- [ ] `tsconfig.json` has `"moduleResolution": "bundler"` for Vite compatibility.

---

## Quick-Start Command Reference

```bash
# 1. Clone/scaffold and enter directory
cd mike-video-generator

# 2. Install everything
npm install

# 3. Dev mode (hot reload GUI + main)
npm run dev

# 4. Test render via CLI (without Electron)
npx remotion render remotion/index.tsx MikeVideo test.mp4 --props=shared/default-config.json

# 5. Build for production
npm run build

# 6. Package Windows installer
npm run dist
```

This blueprint gives you a **fully deterministic path** from zero to a packaged Windows desktop video generator. The architecture is intentionally flat (no microservices, no cloud APIs, no complex state management) so that AI tools can generate each file in a single prompt without hallucinating glue code. Stick to the schema, stick to the IPC channels, and you will ship in 4 hours.