/**
 * build.js — turns src/ + content/ into the finished website in dist/.
 *
 * Run with:  npm run build
 *
 * Steps:
 *   1. Empty dist/
 *   2. Copy src/ (HTML, CSS, JS) into dist/, inserting the shared
 *      header and footer where a page says <!-- @header --> / <!-- @footer -->
 *   3. Read every case and write:
 *        dist/data/index.json         (short list for the library page)
 *        dist/data/cases/<id>.json    (full case for the case page)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { caseFiles, readCase, renderCase, indexEntry } from './load-cases.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');
const PARTIALS = path.join(SRC, 'partials');

// 1. Start fresh
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

// 2. Copy source files
const partial = (name) => fs.readFileSync(path.join(PARTIALS, `${name}.html`), 'utf8');
const header = partial('header');
const footer = partial('footer');

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (entry.name === 'partials' || entry.name.startsWith('.')) continue;
    const src = path.join(from, entry.name);
    const dest = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(src, dest);
    else if (entry.name.endsWith('.html')) {
      // Mark the current page in the navigation for screen readers and styling.
      const page = entry.name;
      const nav = header.replace(`href="${page}"`, `href="${page}" aria-current="page"`);
      const html = fs.readFileSync(src, 'utf8').replace('<!-- @header -->', nav).replace('<!-- @footer -->', footer);
      fs.writeFileSync(dest, html);
    } else fs.copyFileSync(src, dest);
  }
}
copyDir(SRC, DIST);

// 3. Case data
fs.mkdirSync(path.join(DIST, 'data', 'cases'), { recursive: true });
const index = [];
for (const file of caseFiles()) {
  const raw = readCase(file);
  const rendered = renderCase(raw);
  index.push(indexEntry(raw.meta));
  fs.writeFileSync(path.join(DIST, 'data', 'cases', `${raw.meta.id}.json`), JSON.stringify(rendered));
}
fs.writeFileSync(path.join(DIST, 'data', 'index.json'), JSON.stringify(index));

console.log(`✓ Built ${index.length} cases into dist/`);
