import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "ads",
      fileName: "ads",
      formats: ["umd", "es", "cjs"], // UMD for browser, ES for modern bundlers, CJS for Node
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {
          // Define globals if needed
        },
        // Ensure the UMD name matches the global variable
        extend: true,
      },
    },
  },
  define: {
    global: "globalThis",
  },
});
