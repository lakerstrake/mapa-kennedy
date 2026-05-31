import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    target: "es2020",
    cssCodeSplit: false,
    sourcemap: false,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 400,
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('leaflet')) return 'vendor-leaflet';
            if (id.includes('chart.js')) return 'vendor-chart';
            if (id.includes('react')) return 'vendor-react';
            return 'vendor';
          }
        },
      },
    },
  },
  server: {
    port: 5173,
    strictPort: false,
  },
});
