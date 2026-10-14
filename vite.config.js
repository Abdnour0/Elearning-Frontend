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
    // Let Vite/Rollup derive a safe chunk graph automatically.
    // The previous manual chunk rules introduced circular chunks in production.
    chunkSizeWarningLimit: 700,
  },
});
