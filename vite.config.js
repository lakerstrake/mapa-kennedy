import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        // Manual chunks: separa el vendor pesado (Leaflet + Chart.js)
        // del bundle de la app para mejor cache y carga paralela.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('leaflet') || id.includes('react-leaflet')) {
              return 'vendor-leaflet';
            }
            if (id.includes('chart.js')) {
              return 'vendor-chart';
            }
            if (id.includes('react')) {
              return 'vendor-react';
            }
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
