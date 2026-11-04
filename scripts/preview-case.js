/**
 * preview-case.js — print a case as plain text, with all numbers filled in.
 *
 * Run with:  npm run preview -- <case-id>
 * Handy for proofreading: shows exactly how each {{placeholder}} will read.
 */
import path from 'node:path';
import { CASES_DIR, readCase, renderCase } from './load-cases.js';

const id = process.argv[2];
if (!id) {
  console.error('Usage: npm run preview -- <case-id>');
  process.exit(1);
}

const c = renderCase(readCase(path.join(CASES_DIR, `${id}.md`)));
// Strip HTML tags and decode the few entities marked produces.
const text = (html) =>
  String(html || '')
    .replace(/<\/(p|li|tr|h\d)>/g, '\n')
    .replace(/<(td|th)[^>]*>/g, ' | ')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();

const out = [`# ${c.title}`, c.client, `Answer: ${text(c.answer)}`, ''];
out.push('## prompt', text(c.sections.prompt.html), '');
out.push('## clarifiers', ...c.clarifiers.map((q) => `Q: ${text(q.q)}\nA: ${text(q.a)}`), '');
for (const ex of c.exhibits) {
  out.push(`## Exhibit ${ex.number}: ${text(ex.title)}`);
  if (ex.ask) out.push(`Ask: ${text(ex.ask)}`);
  if (ex.columns.length) out.push(ex.columns.map(text).join(' | '), ...ex.rows.map((r) => r.map(text).join(' | ')));
  out.push(...ex.data.map((d) => `${d.label}: ${d.display}`));
  if (ex.reference) out.push(`Reference: ${ex.reference.label} ${ex.reference.display}`);
  out.push(`Note: ${text(ex.note)}`, `Insight: ${text(ex.insight)}`, '');
}
for (const [key, s] of Object.entries(c.sections)) {
  if (key === 'prompt') continue;
  out.push(`## ${key}`);
  if (s.ask) out.push(`Ask: ${text(s.ask)}`);
  out.push(text(s.html), '');
}
console.log(out.join('\n'));
