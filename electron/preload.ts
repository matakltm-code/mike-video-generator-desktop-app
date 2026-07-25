import { contextBridge, ipcRenderer } from "electron";
import type { VideoConfig } from "../shared/VideoConfig";

const electronAPI = {
  selectFile: (filters?: { name: string; extensions: string[] }[]) =>
    ipcRenderer.invoke("select-file", filters),

  saveDialog: (defaultName?: string) =>
    ipcRenderer.invoke("save-dialog", defaultName),

  startRender: (config: VideoConfig, outputPath: string) =>
    ipcRenderer.invoke("start-render", config, outputPath),

  cancelRender: () => ipcRenderer.invoke("cancel-render"),

  onRenderProgress: (callback: (percent: number) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, percent: number) =>
      callback(percent);
    ipcRenderer.on("render-progress", handler);
  },

  onRenderComplete: (callback: (outputPath: string) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, outputPath: string) =>
      callback(outputPath);
    ipcRenderer.on("render-complete", handler);
  },

  onRenderError: (callback: (error: string) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, error: string) =>
      callback(error);
    ipcRenderer.on("render-error", handler);
  },

  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
  },
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);
