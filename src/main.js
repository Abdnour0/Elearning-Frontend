import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { MotionPlugin } from '@vueuse/motion';

import 'vuetify/styles';
import './assets/app.css';

import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';
import { showErrorToast } from './composables/useToast.js';

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          background: '#0a0f1c',
          surface: '#111827',
          'surface-variant': '#1f2937',
          'on-background': '#f8fafc',
          'on-surface': '#f1f5f9',
          'on-surface-variant': '#9ca3af',
          primary: '#3b82f6',
          secondary: '#f97316',
          accent: '#06b6d4',
          error: '#ef4444',
          info: '#38bdf8',
          success: '#10b981',
          warning: '#f59e0b',
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
  showErrorToast(err, 'Une erreur inattendue est survenue dans l\'interface.');
};

window.addEventListener('unhandledrejection', function(event) {
  showErrorToast(event.reason, 'Une action n\'a pas pu être terminée.');
});

app.use(createPinia());
app.use(router);
app.use(vuetify);
app.use(MotionPlugin);

app.mount('#app');
