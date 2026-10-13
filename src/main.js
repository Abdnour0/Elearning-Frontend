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
    defaultTheme: 'light',
    themes: {
      dark: {
        dark: true,
        colors: {
          background: '#fbfaf6',
          surface: '#ffffff',
          'surface-variant': '#f0f2ec',
          'on-background': '#29382e',
          'on-surface': '#354439',
          'on-surface-variant': '#778178',
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
app.use(MotionPlugin);

app.mount('#app');
