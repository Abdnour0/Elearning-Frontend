import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
  ],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.js'],
    css: true,
    server: {
      deps: {
        inline: ['vuetify'],
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        onlyExplicitManualChunks: true,
        manualChunks(id) {
          if (id.includes('/src/views/Admin')) return 'admin';
          if (id.includes('node_modules/chart.js') || id.includes('node_modules/vue-chartjs')) return 'charts';
          if (id.includes('node_modules/jspdf')) return 'exports';
          if (id.includes('node_modules/vuetify') || id.includes('@mdi/font')) return 'ui';
          if (id.includes('node_modules/vue') || id.includes('node_modules/pinia') || id.includes('node_modules/vue-router')) return 'vue-core';
        },
      },
    },
    chunkSizeWarningLimit: 700,
  },
});
