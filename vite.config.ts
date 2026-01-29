import { defineConfig } from "vite";
import { resolve } from "path";

// Configuration for multiple format build
export default defineConfig({
  build: {
    copyPublicDir: false, // Don't copy public directory
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "ads",
      fileName: (format) => {
        if (format === 'umd') {
          return 'ads.umd.js';
        } else if (format === 'es') {
          return 'ads.mjs';
        } else { // cjs
          return 'ads.js';
        }
      },
      formats: ["es", "cjs", "umd"], // ES, CJS, and UMD formats
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {
          // Define globals if needed
        },
      },
    },
    emptyOutDir: false, // Important: Don't empty the dist directory to preserve CJS/ESM builds
  },
  define: {
    global: "globalThis",
  },
});
