/**
 * check-links.js — finds broken links in the built site (dist/).
 *
 * Run with:  npm run check:links   (after npm run build)
 *
 * Fails if any page links to a file, page anchor or case that doesn't exist:
 *   - href/src pointing at a missing file           (e.g. "drils.html")
 *   - "#anchor" links with no matching id on the page
 *   - case.html?id=... links to an unknown case
 *   - index.html?type=... links with an unknown case type
 * Links inside case content and framework guides are checked too.
 * External links (https://...) are listed but not fetched, so the check
 * works offline and never fails because another website is slow.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALLOWED } from './load-cases.js';

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
if (!fs.existsSync(DIST)) {
  console.error('✗ dist/ not found — run `npm run build` first.');
  process.exit(1);
}

const caseIds = new Set(JSON.parse(fs.readFileSync(path.join(DIST, 'data', 'index.json'), 'utf8')).map((c) => c.id));
const problems = [];
const external = new Set();

/** Check one link found in `source` (a page name, or a case JSON file). */
function checkLink(link, source, pageIds) {
  if (/^(https?:|mailto:)/.test(link)) {
    external.add(link);
    return;
  }
  if (link.includes('${')) return; // a template inside page JavaScript, filled in at runtime
  const [pathPart, hash] = link.split('#');
  const [file, query] = pathPart.split('?');
  if (file && !fs.existsSync(path.join(DIST, file))) problems.push(`${source}: "${link}" → missing file ${file}`);
  if (!file && hash && pageIds && !pageIds.has(hash)) problems.push(`${source}: "#${hash}" has no matching id on the page`);
  const params = new URLSearchParams(query || '');
  if (file === 'case.html' && params.get('id') && !caseIds.has(params.get('id'))) problems.push(`${source}: unknown case id "${params.get('id')}"`);
  if (file === 'index.html' && params.get('type') && !ALLOWED.type.includes(params.get('type'))) problems.push(`${source}: unknown case type "${params.get('type')}"`);
}

// <base href> sets where relative links start from; it isn't a link itself.
const linksIn = (html) => [...html.replace(/<base [^>]*>/g, '').matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
const idsIn = (html) => new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));

// 1. Every HTML page
const pages = fs.readdirSync(DIST).filter((f) => f.endsWith('.html'));
for (const page of pages) {
  const html = fs.readFileSync(path.join(DIST, page), 'utf8');
  const ids = idsIn(html);
  for (const link of linksIn(html)) checkLink(link, page, ids);
}

// 2. Links written inside case content (rendered to HTML at build time)
for (const file of fs.readdirSync(path.join(DIST, 'data', 'cases'))) {
  const json = fs.readFileSync(path.join(DIST, 'data', 'cases', file), 'utf8');
  // The HTML sits inside JSON strings, so un-escape quotes (\") before scanning.
  for (const link of linksIn(json.replace(/\\"/g, '"'))) checkLink(link, `case ${file}`, null);
}

console.log(`${pages.length} pages and ${caseIds.size} cases checked.`);
console.log(`External links (not fetched):\n${[...external].sort().map((l) => `  · ${l}`).join('\n')}`);
if (problems.length) {
  console.error(problems.map((p) => `  ✗ ${p}`).join('\n'));
  console.error(`✗ ${problems.length} broken link(s).`);
  process.exit(1);
}
console.log('✓ No broken links.');
