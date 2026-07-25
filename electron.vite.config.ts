import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: "out/main",
      rollupOptions: {
        input: {
          index: path.resolve(__dirname, "electron/main.ts"),
        },
        external: ["electron"],
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: "out/preload",
      rollupOptions: {
        input: {
          index: path.resolve(__dirname, "electron/preload.ts"),
        },
        external: ["electron"],
      },
    },
  },
  renderer: {
    root: "gui",
    build: {
      outDir: "../out/renderer",
      rollupOptions: {
        input: path.resolve(__dirname, "gui/index.html"),
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@shared": path.resolve(__dirname, "shared"),
      },
    },
  },
});
