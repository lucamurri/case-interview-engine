/**
 * preview-case.js — print a case as plain text, with all numbers filled in.
 *
 * Run with:  npm run preview -- <case-id>
 * Handy for proofreading: shows exactly how each {{placeholder}} will read.
 */
import path from 'node:path';
import { CASES_DIR, readCase, renderCase, caseAsText } from './load-cases.js';

const id = process.argv[2];
if (!id) {
  console.error('Usage: npm run preview -- <case-id>');
  process.exit(1);
}

console.log(caseAsText(renderCase(readCase(path.join(CASES_DIR, `${id}.md`)))));
