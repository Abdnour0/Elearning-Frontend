/**
 * Regenerates src/plugins/zenIcons.js.
 *
 * Why this exists: the app ships zero icon webfont. Instead of `@mdi/font`
 * (394 kB woff2 + 3.1 MB of legacy formats + a 408 kB stylesheet of ~7,000
 * unused class rules), icons render as inline `<svg>`. To keep every existing
 * `<v-icon>` name call site working, a custom Vuetify icon set is registered
 * under the `mdi` key, backed by an explicit name -> path map.
 *
 * The map must be exhaustive, because Vuetify renders an empty <path> for an
 * unknown name (a silently blank icon). This script derives the map from:
 *   - every `mdi-*` string in src/ and index.html, and
 *   - every `mdi-*` name Vuetify's own internal aliases resolve to
 *     ($close, $dropdown, $next, $menu, ...), read from the installed package
 * and verifies each one exists in @mdi/js before writing.
 *
 * Usage:
 *   node scripts/generate-zen-icons.mjs           # regenerate
 *   node scripts/generate-zen-icons.mjs --check   # fail if the map is stale
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const FE = path.resolve(scriptDir, '..');
const CHECK_ONLY = process.argv.includes('--check');
const require = createRequire(path.join(FE, 'package.json'));

// ---- 1. every mdi-* name the app can reference ---------------------------
const DEST = path.join(FE, 'src/plugins/zenIcons.js');
const used = new Set();
const collect = (text) => {
  for (const m of text.matchAll(/mdi-[a-z0-9-]+/g)) used.add(m[0]);
};
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === 'dist') continue;
    const p = path.join(dir, e.name);
    if (p === DEST) continue; // never scan our own output
    if (e.isDirectory()) walk(p);
    else if (/\.(vue|js|css|html)$/.test(e.name)) collect(fs.readFileSync(p, 'utf8'));
  }
};
walk(path.join(FE, 'src'));
const idxHtml = path.join(FE, 'index.html');
if (fs.existsSync(idxHtml)) collect(fs.readFileSync(idxHtml, 'utf8'));

// ---- 2. every name Vuetify's own aliases resolve to ----------------------
// Vuetify imports this module statically, so it is always present.
const vuetifyMdi = fs.readFileSync(
  path.join(FE, 'node_modules/vuetify/lib/iconsets/mdi.js'),
  'utf8',
);
const builtinAliases = new Set();
for (const m of vuetifyMdi.matchAll(/'(mdi-[a-z0-9-]+)'/g)) builtinAliases.add(m[1]);

// ---- 3. verify each name exists in @mdi/js ------------------------------
const mdi = require('@mdi/js');
const toExport = (name) =>
  'mdi' + name.replace(/^mdi-/, '').split('-')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('');

const all = [...new Set([...used, ...builtinAliases])].sort();
const resolved = [];
const missing = [];
for (const name of all) {
  const exp = toExport(name);
  if (typeof mdi[exp] !== 'string') missing.push(`${name} (expected export ${exp})`);
  else resolved.push({ name, exp });
}

console.log(`mdi-* names in app        : ${used.size}`);
console.log(`resolved via Vuetify alias: ${builtinAliases.size}`);
console.log(`total unique to map       : ${all.length}`);

if (missing.length) {
  console.error('\nERROR: these names are not in @mdi/js:');
  for (const m of missing) console.error('  ' + m);
  console.error(
    '\nIf a name above is a documentation placeholder rather than a real icon,\n' +
    'reword the comment so it does not look like a literal mdi-* name.',
  );
  process.exit(1);
}

// ---- 4. emit -------------------------------------------------------------
const dest = path.join(FE, 'src/plugins/zenIcons.js');
const constNames = resolved.map((r) => r.exp);
const importBlock = [];
for (let i = 0; i < constNames.length; i += 4) {
  importBlock.push('  ' + constNames.slice(i, i + 4).join(', ') + ',');
}
const mapBlock = resolved.map((r) => `  '${r.name}': ${r.exp},`).join('\n');

const out = `/**
 * Zen icon set — inline SVG, no icon webfont.
 *
 * \`@mdi/font\` ships a 394 kB woff2 (plus ~3.1 MB of legacy .eot/.ttf/.woff) and a
 * 408 kB stylesheet of ~7,000 class rules, of which this app uses ${used.size}. This
 * module keeps the ergonomic \`<v-icon>\` name call sites unchanged by
 * registering a custom Vuetify icon set under the \`mdi\` key. Vuetify resolves
 * \`mdi-*\` names through this set and renders an inline \`<svg>\`, so dropping the
 * font costs nothing at the call site.
 *
 * The map below is exhaustive and verified at generation time: it covers every
 * \`mdi-*\` string in the codebase plus every name Vuetify's own internal aliases
 * (\`$close\`, \`$dropdown\`, \`$next\`, ...) resolve to.
 *
 * GENERATED FILE — do not hand-edit. Regenerate with:
 *   npm run icons:generate
 */
import { h } from 'vue';
import {
${importBlock.join('\n')}
} from '@mdi/js';

/** MDI class name -> \`@mdi/js\` SVG path data. */
export const zenIconNames = {
${mapBlock}
};

/**
 * Renders the same DOM shape Vuetify's built-in \`VSvgIcon\` produces
 * (\`<i class="v-icon ..."><svg class="v-icon__svg" viewBox="0 0 24 24">\`), so all
 * existing icon sizing, colour and alignment CSS keeps working untouched.
 */
const ZenSvgIcon = {
  name: 'ZenSvgIcon',
  inheritAttrs: false,
  props: {
    icon: { type: [String, Array], default: undefined },
    tag: { type: String, required: true },
  },
  setup(props, { attrs }) {
    return () => h(props.tag, { ...attrs, style: null }, [
      h(
        'svg',
        {
          class: 'v-icon__svg',
          xmlns: 'http://www.w3.org/2000/svg',
          viewBox: '0 0 24 24',
          role: 'img',
          'aria-hidden': 'true',
        },
        [h('path', { d: zenIconNames[props.icon] ?? '' })],
      ),
    ]);
  },
};

export const zenIconSet = { component: ZenSvgIcon };
`;

if (CHECK_ONLY) {
  const current = fs.existsSync(dest) ? fs.readFileSync(dest, 'utf8') : '';
  if (current !== out) {
    console.error('\nzenIcons.js is stale. Run: npm run icons:generate');
    process.exit(1);
  }
  console.log('\nzenIcons.js is up to date.');
} else {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, out, 'utf8');
  console.log(`\nwrote ${path.relative(FE, dest)} (${resolved.length} icons)`);
}
