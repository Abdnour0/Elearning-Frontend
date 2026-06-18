import { mount } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';

export function mountView(component, options = {}) {
  const vuetify = createVuetify({
    components,
    directives,
  });

  const providedGlobal = options.global || {};

  return mount(component, {
    attachTo: document.body,
    ...options,
    global: {
      ...providedGlobal,
      plugins: [vuetify, ...(providedGlobal.plugins || [])],
      directives: {
        motion: {
          mounted() {},
          updated() {},
        },
        ...(providedGlobal.directives || {}),
      },
      stubs: {
        transition: false,
        'transition-group': false,
        ...(providedGlobal.stubs || {}),
      },
    },
  });
}
