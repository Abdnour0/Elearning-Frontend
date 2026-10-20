import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mount } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import { VIcon } from 'vuetify/components';
import { zenIconNames, zenIconSet } from '../src/plugins/zenIcons.js';

/**
 * The app renders icons as inline SVG through a custom Vuetify icon set keyed by
 * MDI class name (see src/plugins/zenIcons.js). Vuetify renders an empty <path>
 * for a name it cannot resolve, so a missing entry fails silently as a blank
 * icon rather than throwing. These tests make that failure loud.
 */
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function vueFiles(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) vueFiles(full, acc);
    else if (entry.name.endsWith('.vue')) acc.push(full);
  }
  return acc;
}

describe('zen icon set', () => {
  it('maps every mdi-* name referenced by a component', () => {
    const missing = [];
    for (const file of vueFiles(path.join(root, 'src'))) {
      const source = fs.readFileSync(file, 'utf8');
      for (const match of source.matchAll(/mdi-[a-z0-9-]+/g)) {
        if (!(match[0] in zenIconNames)) {
          missing.push(`${match[0]} (${path.relative(root, file)})`);
        }
      }
    }
    expect(missing).toEqual([]);
  });

  it('maps every icon Vuetify internal aliases resolve to', () => {
    // $close, $dropdown, $next, $menu, ... are resolved by Vuetify components
    // themselves; if these are absent the icons vanish from dialogs, selects,
    // data tables and date pickers without any visible error.
    const iconset = path.join(root, 'node_modules/vuetify/lib/iconsets/mdi.js');
    const source = fs.readFileSync(iconset, 'utf8');
    const aliased = [...source.matchAll(/'(mdi-[a-z0-9-]+)'/g)].map((m) => m[1]);

    expect(aliased.length).toBeGreaterThan(40);
    expect(aliased.filter((name) => !(name in zenIconNames))).toEqual([]);
  });

  it('provides real SVG path data for every entry', () => {
    const entries = Object.entries(zenIconNames);
    expect(entries.length).toBeGreaterThan(60);
    for (const [name, d] of entries) {
      expect(name).toMatch(/^mdi-[a-z0-9-]+$/);
      expect(typeof d).toBe('string');
      expect(d.length).toBeGreaterThan(10);
    }
  });
});

describe('zen icon set rendering', () => {
  const vuetify = createVuetify({
    icons: { defaultSet: 'mdi', sets: { mdi: zenIconSet } },
  });

  it('renders inline SVG for an icon passed via the prop', () => {
    const wrapper = mount(VIcon, {
      props: { icon: 'mdi-play-circle-outline' },
      global: { plugins: [vuetify] },
    });

    const pathEl = wrapper.find('svg.v-icon__svg path');
    expect(pathEl.exists()).toBe(true);
    expect(pathEl.attributes('d')).toBe(zenIconNames['mdi-play-circle-outline']);
  });

  it('renders inline SVG for an icon written in the default slot', () => {
    // The overwhelmingly common call style in this codebase: <v-icon>mdi-close</v-icon>
    const wrapper = mount(VIcon, {
      slots: { default: () => 'mdi-close' },
      global: { plugins: [vuetify] },
    });

    const pathEl = wrapper.find('svg.v-icon__svg path');
    expect(pathEl.exists()).toBe(true);
    expect(pathEl.attributes('d')).toBe(zenIconNames['mdi-close']);
  });

  it('emits no font class, so the webfont can never be required', () => {
    const wrapper = mount(VIcon, {
      slots: { default: () => 'mdi-close' },
      global: { plugins: [vuetify] },
    });

    // With the built-in @mdi/font set the wrapper would carry class "mdi mdi-close".
    expect(wrapper.classes()).not.toContain('mdi');
    expect(wrapper.classes()).not.toContain('mdi-close');
    expect(wrapper.classes()).toContain('v-icon');
  });
});
