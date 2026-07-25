# Mike Video Generator

A Windows desktop application for creating videos with text overlays, images, and background music — powered by [Remotion](https://remotion.dev) and [Electron](https://www.electronjs.org/).

> **Status:** Blueprint phase — the project plan is complete but no source code has been scaffolded yet. See [`docs/project-plan.md`](docs/project-plan.md) for the full project plan.

## Overview

Mike Video Generator lets you compose short-form videos through a visual GUI:

- **Canvas setup** — configure resolution, frame rate, duration, and background color (with a 9:16 preset for vertical video)
- **Text overlays** — add animated text with fade, slide-up, or scale-in effects
- **Image overlays** — upload and position images with adjustable opacity and sizing
- **Background music** — add a single audio track with loop and trim controls
- **Local rendering** — export the final video as MP4 via the Remotion CLI

## Architecture

```
gui/          React front-end (Electron renderer)
electron/     Electron main process & IPC handlers
remotion/     Remotion composition engine
shared/       Shared TypeScript types (VideoConfig schema)
```

Communication between the GUI and the render pipeline flows through typed Electron IPC channels, with a single JSON configuration schema as the source of truth.

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [FFmpeg](https://ffmpeg.org/download.html) in PATH (required by Remotion for encoding)

## Getting Started

> ⚠️ The project is currently in the planning phase. Once the scaffolding is completed, run:

```bash
# Install dependencies
npm install

# Start development mode (Electron + Vite hot reload)
npm run dev

# Build for production
npm run build

# Package Windows installer
npm run dist
```

## Project Plan

See [`docs/project-plan.md`](docs/project-plan.md) for the full project plan, including architecture, configuration schema, component reference, and common pitfalls.

## License

Private — internal use.
