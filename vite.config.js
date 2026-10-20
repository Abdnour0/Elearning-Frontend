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
    allowedHosts: ['5173-io9qdu7tttqyc8i2s5r08-7208f55e.us5.manus.computer'],
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
    // Chunking is left to Rollup; a previously hand-written manualChunks config
    // produced circular chunks in production.
    //
    // chunkSizeWarningLimit is deliberately NOT raised. It used to be 700, purely
    // to silence a warning from a 746 kB entry chunk. That bloat came from
    // importing the entire `vuetify/components` namespace (which drags in every
    // component's co-located CSS) plus the @mdi/font webfont. Both are gone and
    // the largest chunk is now ~385 kB, so Vite's 500 kB default is a real guard.
  },
});
