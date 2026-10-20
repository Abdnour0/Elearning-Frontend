#!/usr/bin/env node
/**
 * Bundle-size budget gate (CI).
 *
 * The audit's performance section recorded LCP as healthy but had no mechanism
 * to keep it that way: a single `import 'jspdf'` in a route component that moves
 * into the entry chunk would silently add ~126 kB gzip to every first paint.
 *
 * Two budgets are checked:
 *
 *   initial  — the module script in `dist/index.html`, plus its transitive
 *              *static* import graph, plus its stylesheet. Vite lists only the
 *              entry chunk in the HTML; the chunks it statically imports are
 *              fetched as soon as that module evaluates, so they are first
 *              paint too. Chunks reached by dynamic `import()` (route
 *              splitting) are excluded — those are genuinely deferred.
 *              This is the number that hurts LCP / TTI.
 *   total    — every .js/.css emitted by the build. Catches slow creep in
 *              route chunks, which is what pushes up cold-start on slow links.
 *
 * Budgets are in *gzip* bytes, because that is what the network serves.
 *
 * Usage:  node scripts/check-bundle-budget.mjs [distDir]
 * Exits 1 when a budget is exceeded, 0 when it passes.
 */

import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';
import { gzipSync } from 'node:zlib';

// Current measured sizes, rounded up ~20% to leave room for real feature work.
// Deliberately not generous: the point of a budget is that a new dependency
// crossing it is a visible decision, not an accident.
const BUDGETS = {
  initialJsGzip: 165 * 1000,
  initialCssGzip: 50 * 1000,
  totalJsGzip: 650 * 1000,
  totalCssGzip: 105 * 1000,
};

const distDir = resolve(process.argv[2] || 'dist');

if (!existsSync(join(distDir, 'index.html'))) {
  console.error(`✗ ${distDir} has no index.html — run \`npm run build\` first.`);
  process.exit(2);
}

const kB = (n) => `${(n / 1000).toFixed(1)} kB`;
const gz = (p) => gzipSync(readFileSync(p), { level: 9 }).length;
const isJs = (p) => p.endsWith('.js');
const isCss = (p) => p.endsWith('.css');
const dirOf = (p) => p.slice(0, p.lastIndexOf('/')) || p;

/** Every file under dir, recursively. */
function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

// ── initial JS: the entry script plus its *static* import graph ─────────────
//
// Vite emits only the entry chunk in index.html; the chunks it statically
// imports are fetched the moment that module is evaluated, so they are part of
// first paint too. Budgeting just the entry file (136 kB) while vuetify (53 kB)
// loads 50 ms later would make the gate meaningless.
//
// `import"./x.js"` / `from"./x.js"` are static. Dynamic `import("./x.js")` is
// route-splitting and does not match that pattern, so it is excluded.
const html = readFileSync(join(distDir, 'index.html'), 'utf8');
const initialJs = new Set();
const initialCss = new Set();
const queue = [];

for (const [, url] of html.matchAll(/\s(?:src|href)\s*=\s*"([^"]+)"/gi)) {
  if (!/^\/?assets\//.test(url)) continue;
  const p = join(distDir, url.replace(/^\//, ''));
  if (isJs(p)) queue.push(p);
  else if (isCss(p)) initialCss.add(p);
}

while (queue.length) {
  const file = queue.pop();
  if (initialJs.has(file) || !existsSync(file)) continue;
  initialJs.add(file);
  const code = readFileSync(file, 'utf8');
  for (const [, rel] of code.matchAll(/(?:from|import)"([^"]+\.js)"/g)) {
    const dep = `${dirOf(file)}/${rel}`;
    if (!initialJs.has(dep)) queue.push(dep);
  }
}

// A gate that silently measures nothing is worse than no gate: if the parse
// above ever stops matching (Vite changes its output format), it would report
// 0 kB and pass forever.
if (initialJs.size === 0 || initialCss.size === 0) {
  console.error('✗ could not parse initial resources out of dist/index.html.');
  console.error('  The bundle format changed — fix scripts/check-bundle-budget.mjs before trusting it.');
  process.exit(2);
}

const allFiles = walk(distDir);
const assets = allFiles.filter((p) => isJs(p) || isCss(p));

const sum = (list, pred) => list.filter(pred).reduce((n, p) => n + gz(p), 0);

const measured = {
  initialJsGzip: sum([...initialJs], isJs),
  initialCssGzip: sum([...initialCss], isCss),
  totalJsGzip: sum(assets, isJs),
  totalCssGzip: sum(assets, isCss),
};

const labels = {
  initialJsGzip: 'Initial JS  (first paint)',
  initialCssGzip: 'Initial CSS (first paint)',
  totalJsGzip: 'Total JS    (all chunks)',
  totalCssGzip: 'Total CSS   (all chunks)',
};

console.log(`\nBundle budget — ${relative(process.cwd(), distDir) || 'dist'}\n`);
console.log('  metric                actual      budget      headroom');

let failed = 0;
for (const key of Object.keys(BUDGETS)) {
  const actual = measured[key];
  const budget = BUDGETS[key];
  const room = budget - actual;
  const pct = ((room / budget) * 100).toFixed(0);
  const ok = room >= 0;
  if (!ok) failed++;
  console.log(
    `  ${labels[key]}  ${String(kB(actual)).padStart(10)}  ` +
      `${kB(budget).padStart(10)}  ` +
      `${(ok ? '  +' : '  ')}${pct}% ${ok ? '✓' : '✗'}`
  );
}

if (failed) {
  const top = [...initialJs, ...initialCss]
    .map((p) => ({ p: relative(distDir, p), n: gz(p) }))
    .sort((a, b) => b.n - a.n)
    .slice(0, 8);
  console.error('\n  Largest first-paint assets:');
  for (const f of top) console.error(`    ${String(kB(f.n)).padStart(9)}  ${f.p}`);
  console.error(`\n✗ ${failed} bundle budget(s) exceeded.`);
  console.error('  Raise a budget only if the growth is deliberate, and say so in the commit.');
  process.exit(1);
}

console.log('\n✓ all bundle budgets met.\n');
