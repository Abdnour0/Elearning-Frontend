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
import { registerMotionDirectives } from './directives/motion.js';

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          background: '#fff9f6',
          surface: '#ffffff',
          'surface-variant': '#f2ece3',
          'surface-bright': '#ffffff',
          'on-background': '#0f151d',
          'on-surface': '#0f151d',
          'on-surface-variant': '#5b6068',
          primary: '#ff7448',
          secondary: '#0f151d',
          accent: '#f13f07',
          error: '#d64b3f',
          info: '#4a90a4',
          success: '#2f9e63',
          warning: '#d99a2b',
        },
      },
    },
  },
  defaults: {
    VBtn: {
      rounded: 'pill',
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
registerMotionDirectives(app);

app.mount('#app');
