import { useEffect, useCallback } from "react";
import type { ElectronAPI, VideoConfig, RenderState } from "../../../shared/VideoConfig";

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export function useElectron() {
  const api = window.electronAPI;

  const selectFile = useCallback(
    (filters?: { name: string; extensions: string[] }[]) => {
      return api.selectFile(filters);
    },
    [api]
  );

  const saveDialog = useCallback(
    (defaultName?: string) => {
      return api.saveDialog(defaultName);
    },
    [api]
  );

  const startRender = useCallback(
    (config: VideoConfig, outputPath: string) => {
      return api.startRender(config, outputPath);
    },
    [api]
  );

  const cancelRender = useCallback(() => {
    return api.cancelRender();
  }, [api]);

  const setupRenderListeners = useCallback(
    (handlers: {
      onProgress: (percent: number) => void;
      onComplete: (outputPath: string) => void;
      onError: (error: string) => void;
    }) => {
      api.onRenderProgress(handlers.onProgress);
      api.onRenderComplete(handlers.onComplete);
      api.onRenderError(handlers.onError);

      return () => {
        api.removeAllListeners("render-progress");
        api.removeAllListeners("render-complete");
        api.removeAllListeners("render-error");
      };
    },
    [api]
  );

  return {
    selectFile,
    saveDialog,
    startRender,
    cancelRender,
    setupRenderListeners,
  };
}
