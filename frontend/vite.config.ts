/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

const ANALYZE = process.env.ANALYZE === "true";

export default defineConfig({
  plugins: [
    react(),
    ANALYZE &&
      visualizer({
        filename: "dist/bundle-stats.html",
        template: "treemap",
        gzipSize: true,
        brotliSize: true,
        open: false,
      }),
  ],
  test: {
    environment: "jsdom",
    globals: true, // so describe/it/beforeEach/afterAll are global
    setupFiles: "./src/test/setupTests.ts",
  },
  build: {
    rollupOptions: {
      plugins: [
        visualizer({
          filename: "dist/bundle-stats.html",
          template: "treemap",
          gzipSize: true,
          brotliSize: true,
          open: false,
        }),
      ],
    },
  },
});
