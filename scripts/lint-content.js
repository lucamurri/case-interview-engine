/**
 * lint-content.js — checks that every case has everything it needs.
 *
 * Run with:  npm run lint:content
 *
 * Fails (exit code 1) if any case:
 *   - is missing a metadata field, or uses a value outside the allowed list
 *   - has a file name that doesn't match its id, or reuses another case's id
 *   - is missing a required section, or has an unknown/misspelled heading
 *   - has fewer than 2 clarifying Q&As
 *   - has 0 or more than 3 exhibits, or an exhibit without an "illustrative" note
 *   - (interviewer-led) lacks an "Ask:" question in Structure, Math or Synthesis
 */
import path from 'node:path';
import { caseFiles, readCase, ALLOWED, SECTIONS, splitAsk, parseClarifiers } from './load-cases.js';

const REQUIRED_META = ['id', 'title', 'client', 'summary', 'industry', 'type', 'difficulty', 'format', 'time_minutes', 'inputs', 'calculations', 'answer', 'exhibits'];

let problems = 0;
const seenIds = new Map();

for (const file of caseFiles()) {
  const errors = [];
  const err = (m) => errors.push(m);
  let raw;
  try {
    raw = readCase(file);
  } catch (e) {
    console.error(`✗ ${path.basename(file)}\n    - ${e.message}`);
    problems++;
    continue;
  }
  const { meta, sections } = raw;

  // Metadata
  for (const field of REQUIRED_META) {
    if (meta[field] === undefined || meta[field] === null || meta[field] === '') err(`missing metadata field "${field}"`);
  }
  for (const [field, allowed] of Object.entries(ALLOWED)) {
    if (meta[field] && !allowed.includes(meta[field])) err(`${field} "${meta[field]}" must be one of: ${allowed.join(', ')}`);
  }
  if (meta.time_minutes !== undefined && !(Number.isInteger(meta.time_minutes) && meta.time_minutes > 0)) {
    err('time_minutes must be a whole number of minutes');
  }
  if (meta.id && raw.fileName !== `${meta.id}.md`) err(`file name should be "${meta.id}.md"`);
  if (meta.id) {
    if (seenIds.has(meta.id)) err(`id "${meta.id}" is also used by ${seenIds.get(meta.id)}`);
    seenIds.set(meta.id, raw.fileName);
  }
  for (const [name, input] of Object.entries(meta.inputs || {})) {
    if (typeof input?.value !== 'number') err(`input "${name}" needs a numeric value`);
    if (!input?.label) err(`input "${name}" needs a label`);
  }
  for (const step of meta.calculations || []) {
    for (const f of ['id', 'label', 'formula', 'expected']) if (step[f] === undefined) err(`a calculation is missing "${f}" (${step.id || '?'})`);
  }

  // Sections
  for (const { key, heading } of SECTIONS) {
    if (sections[key] === null) err(`missing section "## ${heading}"`);
    else if (!sections[key].trim()) err(`section "## ${heading}" is empty`);
  }
  for (const h of raw.unknownHeadings) err(`unknown heading "## ${h}" (check spelling)`);
  if (sections.clarifiers && parseClarifiers(sections.clarifiers).filter((c) => c.a).length < 2) {
    err('needs at least 2 clarifying Q&As written as "- Q: ..." then "A: ..."');
  }
  if (meta.format === 'interviewer-led') {
    for (const key of ['structure', 'math', 'synthesis']) {
      if (sections[key] && !splitAsk(sections[key]).ask) err(`interviewer-led: "${SECTIONS.find((s) => s.key === key).heading}" should start with "> **Ask:** ..."`);
    }
  }

  // Exhibits
  const exhibits = meta.exhibits || [];
  if (exhibits.length < 1 || exhibits.length > 3) err(`needs 1–3 exhibits (has ${exhibits.length})`);
  exhibits.forEach((ex, i) => {
    const name = ex.id || `exhibit ${i + 1}`;
    if (!ex.title) err(`${name}: missing title`);
    if (!/illustrative/i.test(ex.note || '')) err(`${name}: note must say the data is illustrative`);
    if (ex.kind === 'table') {
      if (!ex.columns?.length || !ex.rows?.length) err(`${name}: table needs columns and rows`);
      (ex.rows || []).forEach((row, r) => {
        if (row.length !== ex.columns?.length) err(`${name}: row ${r + 1} has ${row.length} cells, expected ${ex.columns?.length}`);
      });
    } else if (ex.kind === 'bar') {
      if (!ex.data?.length) err(`${name}: bar chart needs data`);
    } else {
      err(`${name}: kind must be "table" or "bar"`);
    }
  });

  if (errors.length) {
    problems += errors.length;
    console.error(`✗ ${raw.fileName}\n${errors.map((e) => `    - ${e}`).join('\n')}`);
  } else {
    console.log(`✓ ${raw.fileName}`);
  }
}

if (problems) {
  console.error(`\n✗ ${problems} content problem(s) found.`);
  process.exit(1);
}
console.log('\n✓ All cases have the required sections.');
