/**
 * load-cases.js — reads every case file and turns it into structured data.
 *
 * Used by three scripts:
 *   build.js         → writes the data the website reads
 *   test-math.js     → checks every calculation
 *   lint-content.js  → checks every required section is present
 *
 * A case file = YAML "front matter" (between --- lines) + Markdown body
 * split into sections by "## Heading" lines. See content/_template.md.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load as parseYaml } from 'js-yaml';
import { marked } from 'marked';
import { evaluate } from './calc.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const CASES_DIR = path.join(ROOT, 'content', 'cases');

/** Allowed values for the tag-like metadata fields. */
export const ALLOWED = {
  industry: ['pharma-healthcare', 'energy', 'consumer-retail', 'tech-ai', 'financial-services', 'industrials', 'public-sector', 'media-sports'],
  type: ['market-sizing', 'profitability', 'market-entry', 'pricing', 'm-and-a', 'operations'],
  difficulty: ['beginner', 'intermediate', 'advanced'],
  format: ['interviewer-led', 'candidate-led'],
};

/** Body sections, in the order they appear. Headings must match exactly. */
export const SECTIONS = [
  { key: 'prompt', heading: 'Prompt' },
  { key: 'clarifiers', heading: 'Clarifying information' },
  { key: 'structure', heading: 'Structure' },
  { key: 'math', heading: 'Math walkthrough' },
  { key: 'synthesis', heading: 'Synthesis' },
  { key: 'mistakes', heading: 'Common mistakes' },
  { key: 'topCandidates', heading: 'What top candidates do differently' },
  { key: 'creative', heading: 'Creative question' },
  { key: 'creativeAnswer', heading: 'Model answer' },
];

/** Default allowed difference between a formula's result and `expected` (0.5%). */
export const DEFAULT_TOLERANCE = 0.005;

// ---------------------------------------------------------------------------
// Reading files
// ---------------------------------------------------------------------------

/** List case files (ignores files starting with "_", like the template). */
export function caseFiles() {
  return fs
    .readdirSync(CASES_DIR)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .sort()
    .map((f) => path.join(CASES_DIR, f));
}

/** Split a file into { meta, body } using the --- front matter fences. */
function splitFrontMatter(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text);
  if (!m) throw new Error('Missing YAML front matter (--- ... ---) at top of file');
  return { meta: parseYaml(m[1]) || {}, body: m[2] };
}

/** Split the Markdown body into sections keyed by their "## " heading text. */
function splitSections(body) {
  const sections = {};
  const order = [];
  let current = null;
  for (const line of body.split(/\r?\n/)) {
    const h = /^##\s+(.+?)\s*$/.exec(line);
    if (h) {
      current = h[1];
      sections[current] = '';
      order.push(current);
    } else if (current) {
      sections[current] += line + '\n';
    }
  }
  for (const k of order) sections[k] = sections[k].trim();
  return { sections, order };
}

/** Parse one case file into raw (unrendered) form. */
export function readCase(file) {
  const text = fs.readFileSync(file, 'utf8');
  const { meta, body } = splitFrontMatter(text);
  const { sections: byHeading, order } = splitSections(body);
  const sections = {};
  for (const s of SECTIONS) sections[s.key] = byHeading[s.heading] ?? null;
  const known = new Set(SECTIONS.map((s) => s.heading));
  const unknownHeadings = order.filter((h) => !known.has(h));
  return { file, fileName: path.basename(file), meta, sections, unknownHeadings };
}

// ---------------------------------------------------------------------------
// Math
// ---------------------------------------------------------------------------

/**
 * Run every calculation in order. Returns:
 *   values  — name → number for every input and calculation
 *   specs   — name → { unit, decimals, label } used for display
 *   results — one entry per calculation with pass/fail details
 */
export function computeCase(meta) {
  const values = {};
  const specs = {};
  const results = [];

  for (const [name, input] of Object.entries(meta.inputs || {})) {
    values[name] = Number(input?.value);
    specs[name] = { unit: input?.unit, decimals: input?.decimals, label: input?.label };
  }

  for (const step of meta.calculations || []) {
    const r = { id: step.id, label: step.label, formula: step.formula, expected: step.expected };
    try {
      r.value = evaluate(step.formula, values);
      const tol = step.tolerance ?? DEFAULT_TOLERANCE;
      const scale = Math.max(Math.abs(step.expected), 1e-9);
      r.ok = typeof step.expected === 'number' && Math.abs(r.value - step.expected) / scale <= tol;
      if (typeof step.expected !== 'number') r.error = 'missing "expected" value';
      values[step.id] = r.value;
    } catch (err) {
      r.ok = false;
      r.error = err.message;
    }
    specs[step.id] = { unit: step.unit, decimals: step.decimals, label: step.label };
    results.push(r);
  }
  return { values, specs, results };
}

// ---------------------------------------------------------------------------
// Number formatting and {{placeholders}}
// ---------------------------------------------------------------------------

/**
 * Format a number for display using its unit:
 *   "%"    0.06  → "6%"          "pts" 0.2 → "20 pts" (percentage points; 1 → "1 pt")
 *   "$M"   571   → "$571M"       "$"   30  → "$30"
 *   "$/tube" 243 → "$243/tube"   "x"   6.5 → "6.5x"
 *   anything else → number + space + unit ("million", "years", ...)
 * `decimals` fixes the number of decimals; otherwise it is chosen automatically.
 */
export function formatNumber(value, { unit = '', decimals } = {}) {
  let v = value;
  let prefix = '';
  let suffix = '';
  unit = unit || '';
  const currency = /^([$€£])(.*)$/.exec(unit);
  if (unit === '%') {
    v = value * 100;
    suffix = '%';
  } else if (unit === 'pts') {
    v = value * 100;
    suffix = Math.abs(v) === 1 ? ' pt' : ' pts';
  } else if (currency) {
    prefix = currency[1];
    const rest = currency[2];
    suffix = /^(K|M|B|bn|\/.*)?$/.test(rest) ? rest : ` ${rest}`;
  } else if (unit === 'x') {
    suffix = 'x';
  } else if (unit) {
    suffix = ` ${unit}`;
  }

  const abs = Math.abs(v);
  const auto = abs >= 100 ? 0 : abs >= 10 ? 1 : 2;
  const d = decimals ?? auto;
  const digits = abs.toLocaleString('en-US', {
    minimumFractionDigits: decimals ?? 0,
    maximumFractionDigits: d,
  });
  const sign = v < 0 && digits.replace(/[0.,]/g, '') !== '' ? '−' : ''; // true minus sign
  return `${sign}${prefix}${digits}${suffix}`;
}

/**
 * Replace {{name}} (or {{name:2}} to force 2 decimals) with formatted values.
 * Unknown names are left visible as "⟦name⟧" and reported in `missing`.
 */
export function fillPlaceholders(text, values, specs, missing = []) {
  if (text == null) return text;
  return String(text).replace(/\{\{\s*([A-Za-z_][A-Za-z0-9_]*)\s*(?::\s*(\d+))?\s*\}\}/g, (_, name, dec) => {
    if (!(name in values)) {
      missing.push(name);
      return `⟦${name}⟧`;
    }
    const spec = { ...specs[name] };
    if (dec !== undefined) spec.decimals = Number(dec);
    return formatNumber(values[name], spec);
  });
}

/** Find all {{placeholders}} that don't resolve, anywhere in a case. */
export function findMissingPlaceholders(raw, values) {
  const missing = [];
  const scan = (s) => fillPlaceholders(s, values, {}, missing);
  for (const v of Object.values(raw.sections)) scan(v);
  for (const ex of raw.meta.exhibits || []) scanDeep(ex, scan);
  scan(raw.meta.answer?.headline);
  return [...new Set(missing)];
}

/**
 * Find results typed directly into the text, which the math test can't check.
 * After every "=" or "≈" the value must be a {{placeholder}}, OR the start
 * of a longer expression (e.g. "= 100 MW × 2 h" restates inputs, which is fine).
 *   "= {{capex}}"           ok — checked placeholder
 *   "= 200 × $300 = {{x}}"  ok — "200" is followed by an operator
 *   "= $19.6M"              flagged — a typed result
 * Returns the offending snippets.
 */
export function findTypedResults(markdown) {
  if (!markdown) return [];
  const found = [];
  const re = /[=≈]/g;
  let m;
  while ((m = re.exec(markdown))) {
    const after = markdown.slice(m.index + 1);
    const num = /^[\s*]*(?:~\s*)?([-−]?[$€£]?\d[\d,.]*)(\s?[A-Za-z%][A-Za-z%/-]*|\/[A-Za-z-]+)?/.exec(after);
    if (!num) continue; // starts with a placeholder, word or bracket
    const rest = after.slice(num[0].length);
    if (/^\s*[×*÷/+\-−(]/.test(rest)) continue; // part of a longer expression
    found.push(markdown.slice(m.index, m.index + 1 + num[0].length).replace(/\s+/g, ' ').trim());
  }
  return found;
}

function scanDeep(obj, fn) {
  if (typeof obj === 'string') fn(obj);
  else if (Array.isArray(obj)) obj.forEach((o) => scanDeep(o, fn));
  else if (obj && typeof obj === 'object') Object.values(obj).forEach((o) => scanDeep(o, fn));
}

// ---------------------------------------------------------------------------
// Section helpers
// ---------------------------------------------------------------------------

/**
 * A section may start with an "Ask" block — the question shown before the
 * model answer is revealed:
 *   > **Ask:** How would you structure this?
 * Returns { ask, rest } as Markdown strings.
 */
export function splitAsk(markdown) {
  if (!markdown) return { ask: null, rest: markdown };
  const lines = markdown.split('\n');
  let i = 0;
  while (i < lines.length && lines[i].startsWith('>')) i++;
  const quote = lines.slice(0, i).map((l) => l.replace(/^>\s?/, '')).join('\n').trim();
  const m = /^\*\*Ask:\*\*\s*([\s\S]*)$/.exec(quote);
  if (!m) return { ask: null, rest: markdown };
  return { ask: m[1].trim(), rest: lines.slice(i).join('\n').trim() };
}

/**
 * Clarifying information is written as:
 *   - Q: Do we include public chargers?
 *     A: No, home charging only.
 * Returns [{ q, a }] as Markdown strings.
 */
export function parseClarifiers(markdown) {
  if (!markdown) return [];
  return markdown
    .split(/^-\s+Q:\s*/m)
    .slice(1)
    .map((chunk) => {
      const m = /^([\s\S]*?)\n\s*A:\s*([\s\S]*)$/.exec(chunk.trim());
      return m ? { q: m[1].trim(), a: m[2].trim().replace(/\n\s+/g, '\n') } : { q: chunk.trim(), a: '' };
    });
}

// ---------------------------------------------------------------------------
// Rendering for the website
// ---------------------------------------------------------------------------

const md = (s) => (s ? marked.parse(s) : '');
const mdInline = (s) => (s == null ? '' : marked.parseInline(String(s)));

/** Turn a raw case into the JSON the website reads. */
export function renderCase(raw) {
  const { meta } = raw;
  const { values, specs, results } = computeCase(meta);
  const fill = (s) => fillPlaceholders(s, values, specs);

  const sections = {};
  for (const { key } of SECTIONS) {
    if (key === 'clarifiers') continue;
    const { ask, rest } = splitAsk(fill(raw.sections[key]));
    sections[key] = { ask: ask ? mdInline(ask) : null, html: md(rest) };
  }

  const clarifiers = parseClarifiers(fill(raw.sections.clarifiers)).map((c) => ({
    q: mdInline(c.q),
    a: md(c.a),
  }));

  const exhibits = (meta.exhibits || []).map((ex, i) => ({
    id: ex.id || `exhibit-${i + 1}`,
    number: i + 1,
    title: mdInline(fill(ex.title)),
    ask: ex.ask ? mdInline(fill(ex.ask)) : null,
    kind: ex.kind,
    columns: (ex.columns || []).map((c) => mdInline(fill(c))),
    rows: (ex.rows || []).map((row) => row.map((cell) => mdInline(fill(cell)))),
    // Bar charts: each value is a number or the name of an input/calculation.
    unit: ex.unit || '',
    data: (ex.data || []).map((d) => {
      const v = typeof d.value === 'number' ? d.value : values[d.value];
      return { label: String(d.label), value: v, display: formatNumber(v, { unit: ex.unit, decimals: ex.decimals }) };
    }),
    reference: ex.reference ? referenceLine(ex, values) : null,
    note: mdInline(fill(ex.note)),
    insight: ex.insight ? md(fill(ex.insight)) : null,
  }));

  // "Key numbers" table shown with the math walkthrough.
  const keyNumbers = results.map((r) => ({
    label: mdInline(r.label),
    display: formatNumber(r.value, specs[r.id]),
  }));

  return {
    ...indexEntry(meta),
    client: meta.client || '',
    sections,
    clarifiers,
    exhibits,
    keyNumbers,
    answer: meta.answer?.headline ? mdInline(fill(meta.answer.headline)) : '',
  };
}

/** A bar chart's dashed reference line; its value is a number or a name. */
function referenceLine(ex, values) {
  const v = typeof ex.reference.value === 'number' ? ex.reference.value : values[ex.reference.value];
  return { value: v, label: String(ex.reference.label), display: formatNumber(v, { unit: ex.unit, decimals: ex.decimals }) };
}

/** The short version of a case used by the library page. */
export function indexEntry(meta) {
  return {
    id: meta.id,
    title: meta.title,
    summary: meta.summary || '',
    industry: meta.industry,
    sub_industry: meta.sub_industry || '',
    type: meta.type,
    difficulty: meta.difficulty,
    format: meta.format,
    time_minutes: meta.time_minutes,
  };
}

/** Strip HTML tags and decode the few entities marked produces. */
const htmlToText = (html) =>
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

/** A rendered case as plain text, exactly as a reader sees it (all numbers filled in). */
export function caseAsText(c) {
  const out = [`# ${c.title}`, c.client, `Answer: ${htmlToText(c.answer)}`, ''];
  out.push('## prompt', htmlToText(c.sections.prompt.html), '');
  out.push('## clarifiers', ...c.clarifiers.map((q) => `Q: ${htmlToText(q.q)}\nA: ${htmlToText(q.a)}`), '');
  for (const ex of c.exhibits) {
    out.push(`## Exhibit ${ex.number}: ${htmlToText(ex.title)}`);
    if (ex.ask) out.push(`Ask: ${htmlToText(ex.ask)}`);
    if (ex.columns.length) out.push(ex.columns.map(htmlToText).join(' | '), ...ex.rows.map((r) => r.map(htmlToText).join(' | ')));
    out.push(...ex.data.map((d) => `${d.label}: ${d.display}`));
    if (ex.reference) out.push(`Reference: ${ex.reference.label} ${ex.reference.display}`);
    out.push(`Note: ${htmlToText(ex.note)}`, `Insight: ${htmlToText(ex.insight)}`, '');
  }
  for (const [key, s] of Object.entries(c.sections)) {
    if (key === 'prompt') continue;
    out.push(`## ${key}`);
    if (s.ask) out.push(`Ask: ${htmlToText(s.ask)}`);
    out.push(htmlToText(s.html), '');
  }
  return out.join('\n');
}
