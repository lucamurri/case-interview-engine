/**
 * test-fit.js — checks the fit-interview question bank.
 *
 * Run with:  npm run test:fit
 * Fails on: a theme with no coach's note or too few questions, duplicate
 * questions, a question that does not end in "?" or ".", or British spellings.
 */
import { FIT_THEMES, FIT_RUBRIC, FIT_TIPS } from '../src/js/fit-questions.js';

const problems = [];
const seen = new Set();
const BRITISH = /\b(?:\w*(?:organis|optimis|prioritis|realis|recognis)(?:e|es|ed|ing|ation)\b|behaviour|labour|colour|favour|programme|centre)/i;

for (const [key, t] of Object.entries(FIT_THEMES)) {
  if (!t.name || !t.blurb || !t.listenFor) problems.push(`${key}: missing name, blurb or listenFor`);
  if (t.questions.length < 5) problems.push(`${key}: needs at least 5 questions`);
  for (const q of t.questions) {
    if (seen.has(q)) problems.push(`${key}: duplicate question "${q}"`);
    seen.add(q);
    if (!/[?.]$/.test(q)) problems.push(`${key}: question should end with ? or . — "${q}"`);
  }
  for (const text of [t.name, t.blurb, t.listenFor, ...t.questions]) if (BRITISH.test(text)) problems.push(`${key}: British spelling in "${text}"`);
}
if (FIT_RUBRIC.length !== new Set(FIT_RUBRIC.map((d) => d.key)).size) problems.push('rubric keys must be unique');
if (!FIT_TIPS.length) problems.push('no tips');

if (problems.length) {
  console.error(problems.map((p) => `✗ ${p}`).join('\n'));
  process.exit(1);
}
console.log(`✓ ${seen.size} fit questions across ${Object.keys(FIT_THEMES).length} themes look good`);
