import { app, BrowserWindow, ipcMain, dialog } from "electron";
import { spawn, execSync, ChildProcess } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import type { VideoConfig } from "../shared/VideoConfig";

// ─── State ────────────────────────────────────────────────────────────

let mainWindow: BrowserWindow | null = null;
let activeRenderProcess: ChildProcess | null = null;

// ─── FFmpeg Detection ─────────────────────────────────────────────────

function checkFFmpeg(): boolean {
  try {
    execSync("ffmpeg -version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

// ─── Window Creation ──────────────────────────────────────────────────

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 920,
    minWidth: 1000,
    minHeight: 700,
    title: "Mike Video Generator",
    backgroundColor: "#0f0f11",
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow?.show();
  });

  // In dev, load Vite dev server URL; in prod, load built HTML
  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, "../gui/index.html")
    );
  }
}

// ─── IPC Handlers ─────────────────────────────────────────────────────

ipcMain.handle("select-file", async (_event, filters?: { name: string; extensions: string[] }[]) => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ["openFile"],
    filters: filters ?? [
      { name: "Media Files", extensions: ["png", "jpg", "jpeg", "gif", "webp", "mp3", "wav", "ogg", "mp4"] },
    ],
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  const srcPath = result.filePaths[0];

  // Copy file to app's user data assets directory
  const assetsDir = path.join(app.getPath("userData"), "assets");
  fs.mkdirSync(assetsDir, { recursive: true });
  const destPath = path.join(assetsDir, `${Date.now()}-${path.basename(srcPath)}`);
  fs.copyFileSync(srcPath, destPath);

  return destPath;
});

ipcMain.handle("save-dialog", async (_event, defaultName?: string) => {
  const result = await dialog.showSaveDialog(mainWindow!, {
    defaultPath: path.join(app.getPath("desktop"), defaultName ?? "mike-video.mp4"),
    filters: [{ name: "MP4 Video", extensions: ["mp4"] }],
  });

  if (result.canceled || !result.filePath) {
    return null;
  }

  return result.filePath;
});

ipcMain.handle(
  "start-render",
  async (event, config: VideoConfig, outputPath: string) => {
    const tempDir = path.join(os.tmpdir(), `mike-video-${Date.now()}`);
    fs.mkdirSync(tempDir, { recursive: true });

    // Deep clone config
    const configCopy: VideoConfig = JSON.parse(JSON.stringify(config));

    // Copy asset files to temp dir and rewrite paths
    const copyAsset = (srcPath: string): string => {
      const basename = path.basename(srcPath);
      const dest = path.join(tempDir, basename);
      try {
        fs.copyFileSync(srcPath, dest);
      } catch {
        // If file doesn't exist, keep original path (may be a URL or static file)
        return srcPath;
      }
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

    // Write config JSON
    const propsPath = path.join(tempDir, "props.json");
    fs.writeFileSync(propsPath, JSON.stringify(configCopy, null, 2));

    // Spawn Remotion CLI — use local binary directly for reliability
    const isWin = process.platform === "win32";
    const remotionBin = path.join(
      app.getAppPath(),
      "node_modules",
      ".bin",
      isWin ? "remotion.cmd" : "remotion"
    );
    const remotionEntry = path.join(__dirname, "../remotion/index.tsx");

    const proc = spawn(
      remotionBin,
      [
        "render",
        remotionEntry,
        "MikeVideo",
        outputPath,
        "--props",
        propsPath,  // separate arg avoids shell escaping on Windows paths
        "--log=verbose",
      ],
      {
        cwd: app.getAppPath(),
        shell: isWin,
        env: { ...process.env },
      }
    );

    activeRenderProcess = proc;

    let stderrBuf = "";
    let stdoutBuf = "";

    // Parse progress from stderr
    const progressRegex = /Rendered\s+frame\s+(\d+)\/(\d+)/i;
    const altRegex = /(\d+)\/(\d+)\s*frames\s*rendered/i;

    proc.stderr?.on("data", (data: Buffer) => {
      const str = data.toString();
      stderrBuf += str;

      for (const line of str.split("\n")) {
        const match = line.match(progressRegex) || line.match(altRegex);
        if (match) {
          const current = parseInt(match[1], 10);
          const total = parseInt(match[2], 10);
          const percent = Math.round((current / total) * 100);
          mainWindow?.webContents.send("render-progress", percent);
          break;
        }
      }
    });

    proc.stdout?.on("data", (data: Buffer) => {
      stdoutBuf += data.toString();
    });

    return new Promise<void>((resolve, reject) => {
      proc.on("close", (code) => {
        activeRenderProcess = null;
        if (code === 0) {
          mainWindow?.webContents.send("render-complete", outputPath);
          resolve();
        } else {
          // Build a detailed error message from both stderr and stdout
          const stderrTail = stderrBuf.trim().split("\n").slice(-20).join("\n");
          const stdoutTail = stdoutBuf.trim().split("\n").slice(-10).join("\n");
          const combined = [
            stderrTail ? `stderr:\n${stderrTail}` : "",
            stdoutTail ? `stdout:\n${stdoutTail}` : "",
          ]
            .filter(Boolean)
            .join("\n\n");
          const errorMsg = combined || `Render failed with exit code ${code}`;
          mainWindow?.webContents.send("render-error", errorMsg);
          reject(new Error(`Render failed with code ${code}`));
        }
      });

      proc.on("error", (err) => {
        activeRenderProcess = null;
        const fullMsg = [err.message, stderrBuf.trim(), stdoutBuf.trim()]
          .filter(Boolean)
          .join("\n");
        mainWindow?.webContents.send("render-error", fullMsg);
        reject(err);
      });
    });
  }
);

ipcMain.handle("cancel-render", () => {
  if (activeRenderProcess) {
    const pid = activeRenderProcess.pid;
    activeRenderProcess.kill("SIGTERM");
    activeRenderProcess = null;
    // Try to kill process tree on Windows
    if (process.platform === "win32" && pid) {
      try {
        execSync(`taskkill /T /F /PID ${pid}`, { stdio: "ignore" });
      } catch {
        // process already dead
      }
    }
  }
});

// ─── App Lifecycle ────────────────────────────────────────────────────

app.whenReady().then(() => {
  // Check FFmpeg availability
  if (!checkFFmpeg()) {
    dialog.showErrorBox(
      "FFmpeg Required",
      "FFmpeg was not found in your system PATH.\n\n" +
        "Remotion requires FFmpeg for video encoding.\n\n" +
        "Please install it from: https://ffmpeg.org/download.html\n\n" +
        "After installing, restart the application."
    );
    app.quit();
    return;
  }

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  if (activeRenderProcess) {
    activeRenderProcess.kill("SIGTERM");
  }
});
