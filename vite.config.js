import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

/**
 * Every route is lazy, including "/", so the browser cannot discover
 * HomeView-*.js until the entry bundle has parsed and vue-router has resolved
 * the initial route.
 *
 * Measured against the live deployment, that shows up as a waterfall:
 *
 *   document     0ms -> 199ms
 *   entry JS   216ms -> 370ms
 *   entry CSS  216ms -> 320ms
 *   HomeView   520ms -> 580ms   <-- 150ms of dead time before the request even starts
 *
 * A <link rel="modulepreload"> in <head> tells the browser about that file
 * while it is still parsing the document, so it downloads alongside the entry
 * bundle instead of after it.
 *
 * Scope is deliberately just the landing view. Preloading every public route
 * would make a visitor who only reads "/" download chunks they never use, and
 * on every other page the extra round trip happens after first paint where it
 * is invisible. "/" is the only route where the wait lands on the LCP element.
 *
 * The filename comes from the build's own output, never hard-coded, so the
 * content hash cannot go stale.
 */
const LANDING_VIEW = 'HomeView';

function preloadLandingChunk() {
  return {
    name: 'preload-landing-chunk',
    apply: 'build',
    enforce: 'post',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        // Only populated during `vite build`; the dev server has no bundle.
        const bundle = ctx.bundle;
        if (!bundle) return html;

        // The chunk `fileName` is the built asset path (assets/HomeView-abc.js).
        const chunk = Object.entries(bundle).find(
          ([key, c]) => key.includes(LANDING_VIEW) && c.fileName?.endsWith('.js'),
        );
        if (!chunk) return html;

        const file = chunk[1].fileName;

        // Never duplicate what <head> already loads synchronously.
        if (html.includes(`/${file}`)) return html;

        const link = `    <link rel="modulepreload" crossorigin href="/${file}" />`;
        return html.replace('</head>', `${link}\n  </head>`);
      },
    },
  };
}

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    preloadLandingChunk(),
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
