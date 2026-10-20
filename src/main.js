import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';

import 'vuetify/styles';
import './assets/app.css';

import { createVuetify } from 'vuetify';
import { zenIconSet } from './plugins/zenIcons.js';
import { showErrorToast } from './composables/useToast.js';

// Components and directives are deliberately NOT registered globally here.
// vite-plugin-vuetify (autoImport: true, see vite.config.js) rewrites each
// <v-*> tag into a direct import, so only the components this app renders are
// bundled. Globally registering the `vuetify/components` namespace instead pulls
// in every component's JS *and* its co-located CSS — including the many this app
// never uses (.v-data-table, .v-time-picker, .v-treeview, .v-stepper, ...).
const vuetify = createVuetify({
  // Icons render as inline SVG via a custom set registered under the `mdi` key.
  // Vuetify's built-in `mdi` set is the icon webfont, so overriding it here is
  // what removes ~394 kB of font + ~408 kB of icon-class CSS from every page.
  // Existing `<v-icon>` name call sites are unaffected.
  icons: {
    defaultSet: 'mdi',
    sets: { mdi: zenIconSet },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          background: '#fbfaf6',
          surface: '#ffffff',
          'surface-variant': '#f0f2ec',
          'surface-bright': '#ffffff',
          'on-background': '#29382e',
          'on-surface': '#354439',
          'on-surface-variant': '#606a63',
          primary: '#537a62',
          secondary: '#a97852',
          accent: '#718b74',
          error: '#a94e46',
          info: '#557c82',
          success: '#527a5c',
          warning: '#92733f',
        },
      },
    },
  },
  defaults: {
    VBtn: {
      rounded: 'lg',
      elevation: 0,
    },
    VCard: {
      rounded: 'xl',
      elevation: 0,
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      hideDetails: 'auto',
    },
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
      hideDetails: 'auto',
    },
  },
});

const app = createApp(App);

app.config.errorHandler = (err) => {
    showErrorToast(err, 'An unexpected interface error occurred.');
};

window.addEventListener('unhandledrejection', function(event) {
  showErrorToast(event.reason, 'That action could not be completed.');
});

app.use(createPinia());
app.use(router);
app.use(vuetify);

// Drop the static pre-paint <main> from index.html before rendering. Clearing and
// mounting run in one synchronous task, so the browser never paints a frame with
// zero (or two) main landmarks — the window axe's `landmark-one-main` check hits
// on a slow SPA boot.
document.getElementById('app').innerHTML = '';

app.mount('#app');
