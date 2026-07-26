# Mike Video Generator

A Windows desktop application for composing short-form videos with **templates**, **text overlays**, **images**, **background music**, and a **live preview** — powered by [Remotion](https://remotion.dev) and [Electron](https://www.electronjs.org/).

## Features

### 📦 10 Video Templates
Get started instantly with professionally designed templates across four categories:

| Category | Templates |
|---|---|
| **Branding** | Brand Story, Team Introduction, Year in Review |
| **Product** | Feature Showcase, Sales Pitch |
| **Social** | Quick Announcement, Event Countdown, Holiday Greeting |
| **Educational** | Tips & Listicle, How-To Tutorial |

Each template generates a multi-scene video with placeholder text, scene transitions, and configurable overrides. Duration ranges from 30 seconds to 90 seconds.

### 🎨 Canvas Presets
Choose from **7 format presets** or set custom dimensions:

| Preset | Aspect | Resolution | Use Case |
|---|---|---|---|
| Vertical | 9:16 | 1080×1920 | TikTok, Reels |
| Landscape | 16:9 | 1920×1080 | YouTube |
| Square | 1:1 | 1080×1080 | Instagram |
| Portrait | 4:5 | 1080×1350 | Instagram feed |
| Cinematic | 21:9 | 1920×817 | Widescreen |
| Standard | 4:3 | 1024×768 | Classic |
| Short HD | 9:16 | 720×1280 | Lower-res |

Customize FPS, duration, and background color — all presets preserve your custom settings.

### ▶️ Live Video Preview
See your edits in real-time with the built-in Remotion Player panel — play/pause, seek, and loop through your video without rendering. Toggle visibility with the play button in the header.

### 🎬 Text Elements
Add animated text with three motion presets:
- **Fade In** — opacity 0 → 1
- **Slide Up** — rises 50px while fading in
- **Scale In** — grows from 50% to 100% while fading in

Customize font family, size, weight, color, alignment, position, and timing per element.

### 🖼️ Image Overlays
Upload images via native file picker, position them absolutely, set opacity, and choose object-fit behavior (cover, contain, or fill). Multi-line text with `white-space: pre-wrap` support.

### 🎵 Audio Tracks
Add background music or sound effects. Set volume (0–1), loop on/off, and trim start/end points. Multiple tracks supported.

### 🖼️ Stock Media Catalog
A built-in catalog of **36 free stock images** (via picsum.photos) and **8 audio tracks** (via SoundHelix), categorized and ready to browse — no API key needed. Ready to be wired into a Media Library browser UI.

### 💾 Render to MP4
Export your video as an MP4 file using the Remotion render pipeline. Features:
- **Progress tracking** with a live progress bar (bundling → rendering → complete)
- **Cancel** mid-render
- **Date-stamped file names** — suggested names like `mike-video_2026-07-26_21-53-43.mp4`
- Detailed error diagnostics on failure

## Architecture

```
mike-video-generator/
├── electron/
│   ├── main.ts               # Electron main process, IPC handlers, FFmpeg check, render pipeline
│   ├── preload.ts             # contextBridge API (typed)
│   └── vite.config.ts
├── gui/
│   ├── src/
│   │   ├── main.tsx           # React entry point, CSS variables / global styles
│   │   ├── App.tsx            # Root component — state management, layout, tab system
│   │   ├── components/
│   │   │   ├── CanvasSettings.tsx   # Canvas config with preset grid
│   │   │   ├── ElementEditor.tsx    # Text/Image/Audio element editor
│   │   │   ├── AssetUploader.tsx    # Asset management panel
│   │   │   ├── RenderControls.tsx   # Render button, progress bar, cancel, output
│   │   │   ├── TemplateSelector.tsx # Template catalog with cards
│   │   │   └── VideoPreview.tsx     # Live Remotion Player preview
│   │   ├── templates/
│   │   │   ├── index.ts             # Template registry (10 templates)
│   │   │   ├── helpers.ts           # Shared txt() helper
│   │   │   └── *.ts                 # Individual template definitions
│   │   ├── data/
│   │   │   └── stock-media.ts       # Stock image + audio catalog
│   │   └── hooks/
│   │       └── useElectron.ts       # Typed wrapper for window.electronAPI
│   └── index.html
├── remotion/
│   ├── index.tsx              # registerRoot entry
│   ├── Root.tsx               # Composition registration ("MikeVideo")
│   ├── types.ts               # Re-exports from shared
│   ├── compositions/
│   │   └── MainComposition.tsx # Root composition — scenes, audio, elements
│   └── components/
│       ├── TextElement.tsx     # Animated text overlay
│       ├── ImageElement.tsx    # Image overlay
│       └── AudioTrack.tsx     # Background audio
├── shared/
│   └── VideoConfig.ts          # Single source-of-truth types, ElectronAPI, RenderState, VideoTemplate
├── package.json
├── electron.vite.config.ts
└── remotion.config.ts
```

### Communication Flow

```
┌──────────────────────────────────────────────────────────────────┐
│  RENDERER (React GUI)                                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐ ┌────────────────┐ │
│  │Canvas    │ │Template  │ │ElementEditor │ │RenderControls   │ │
│  │Settings  │ │Selector  │ │(text,image,   │ │(progress,       │ │
│  │(presets) │ │(10 temp.)│ │  audio)       │ │  cancel,output) │ │
│  └──────────┘ └──────────┘ └──────┬───────┘ └───────┬────────┘ │
│                                    │                  │          │
│   App.tsx state: VideoConfig       │                  │          │
│   ◄— all components read/write     │                  │          │
│                                    ▼                  ▼          │
│                         window.electronAPI (contextBridge)        │
│                         selectFile()  saveDialog()  startRender()│
└───────────────────────────────────────────────────┬──────────────┘
                                                    │ IPC
┌───────────────────────────────────────────────────┼──────────────┐
│  ELECTRON MAIN                                    │              │
│                                                    ▼              │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  IPC Handlers                                            │    │
│  │  ├── select-file → dialog.showOpenDialog                 │    │
│  │  ├── save-dialog  → dialog.showSaveDialog (timestamped)  │    │
│  │  ├── start-render → copy assets → write JSON → spawn    │    │
│  │  │                  remotion CLI                         │    │
│  │  └── cancel-render → kill process tree                  │    │
│  │                                                          │    │
│  │  child_process.spawn(remotion, [...])                    │    │
│  │       │ stderr: "Rendered 42/450"                        │    │
│  │       ▼                                                  │    │
│  │  → win.webContents.send("render-progress", 19)           │    │
│  └──────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘
```

### IPC Channels

| Channel | Direction | Purpose |
|---|---|---|
| `select-file` | Renderer → Main | Open native file picker (copies to userData/assets/) |
| `save-dialog` | Renderer → Main | Open save dialog (timestamped filename) |
| `start-render` | Renderer → Main | Begin video render with config |
| `cancel-render` | Renderer → Main | Kill active render process |
| `render-progress` | Main → Renderer | Percentage 0–100 |
| `render-complete` | Main → Renderer | Output file path |
| `render-error` | Main → Renderer | Error details |

## Prerequisites

- **Node.js** 18+
- **FFmpeg** in PATH (required by Remotion for video encoding)  
  [Download FFmpeg](https://ffmpeg.org/download.html)

## Getting Started

```bash
# Install dependencies
npm install

# Start development mode (Electron + Vite hot reload)
npm run dev

# Build for production
npm run build

# Remotion preview (standalone, optional)
npm run remotion:preview

# Package Windows installer
npm run dist
```

## Usage

1. **Launch** — The app opens with the **Templates** tab active
2. **Choose a template** — Pick from 10 templates across 4 categories
3. **Edit canvas** — Switch to the Canvas tab to adjust resolution, duration, or pick a preset
4. **Edit elements** — Modify text, upload images, add audio tracks in the Elements tab
5. **Preview** — Watch your changes live in the right-side preview panel
6. **Render** — Click the Render button, choose a save location, and watch the progress bar

## Detailed Docs

See [`docs/project-plan.md`](docs/project-plan.md) for the complete project plan, including:
- Full configuration schema reference
- Component API documentation
- Template system overview
- Electron preload & IPC reference
- Packaging & distribution checklist
- Common pitfalls & solutions

## License

Private — internal use.
