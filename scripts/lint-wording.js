/**
 * lint-wording.js — proofreads every case as a reader sees it.
 *
 * Run with:  npm run lint:wording
 *
 * Renders each case with all {{placeholders}} filled in, then fails (exit code 1) on:
 *   - doubled words, often a unit repeating the word next to it ("400 thousand visits visits")
 *   - a unit followed by the same unit in words ("$11/kg per kg", "20 crews/year a year")
 *   - a minus sign after a word that already means a loss ("lost only −$1.6M")
 *   - British spellings (the site uses American English)
 */
import { caseFiles, readCase, renderCase, caseAsText } from './load-cases.js';

const MINUS = '[−-]';
const RULES = [
  {
    name: 'doubled word',
    re: /\b([a-z]{2,})\s+\1\b/gi,
  },
  {
    name: 'unit repeated in words',
    // "$4/kg per kg", "$16,000/student per new student", "10 crews/year a year"
    re: /\/([a-z]+)\s+(?:[a-z]+\s+){0,2}(?:per|a|an|each)\s+(?:[a-z]+\s+)?\1\b/gi,
  },
  {
    name: 'unit repeated after a number',
    // "250 thousand people different people", "400 thousand visits paid adult visits"
    re: /\d(?:[\d,.]*\d)?\s+(?:(?:thousand|million|billion)\s+)?(?!(?:per|the|and|for|of)\b)([a-z]{3,})\s+(?:[a-z]+\s+){1,3}\1\b/gi,
  },
  {
    name: 'unit followed by "times"',
    // "visit about 2.5 visits times a year"
    re: /\d[\d,.]*\s+(?:visits|trips|orders|uses|sessions|games|days)\s+times\b/gi,
  },
  {
    name: 'minus sign after a loss word',
    re: new RegExp(`\\b(?:lost|lose|loses|losing|costing|fell|fall|falls|drop|drops|dropped|short|recover|deficit|down):?\\s+(?:(?:only|by|of|about|another|a further)\\s+)*${MINUS}\\$`, 'gi'),
  },
  {
    name: 'British spelling',
    re: /\b(?:\w*(?:organis|optimis|prioritis|cannibalis|capitalis|monetis|realis|recognis|standardis|utilis|minimis|maximis|summaris|emphasis|categoris|digitalis|centralis|subsidis)(?:e|es|ed|ing|ation|ations)\b|analys(?:e|es|ed|ing)\b|enrolment|labour|colour|favour|behaviour|neighbour|centre|centres|programme|programmes|cancelled|cancelling|travelled|travelling|modelling|fulfil\b|catalogue|licence|tonnes?(?=\s+of\s+(?:steel|paper|product))|per cent|tills?\b|fixture|electrolyser|defence|offence|cheque|grey\b|aluminium|tyres?\b|storey)/gi,
  },
];

// Phrases that match a rule but are correct.
const ALLOWED = [/\bthat that\b/i, /\bhad had\b/i, /\bemphasis\b/i];

let problems = 0;
for (const file of caseFiles()) {
  let text;
  try {
    const raw = readCase(file);
    text = caseAsText(renderCase(raw));
  } catch {
    continue; // lint-content and test-math report cases that don't load
  }
  const errors = [];
  for (const line of text.split('\n')) {
    for (const { name, re } of RULES) {
      for (const m of line.matchAll(re)) {
        if (ALLOWED.some((ok) => ok.test(m[0]))) continue;
        const start = Math.max(0, m.index - 40);
        const snippet = line.slice(start, m.index + m[0].length + 40).trim();
        errors.push(`${name}: "${m[0]}" in "…${snippet}…"`);
      }
    }
  }
  const name = file.split('/').pop();
  if (errors.length) {
    problems += errors.length;
    console.error(`✗ ${name}\n${errors.map((e) => `    - ${e}`).join('\n')}`);
  } else {
    console.log(`✓ ${name}`);
  }
}

if (problems) {
  console.error(`\n✗ ${problems} wording problem(s) found. Run "npm run preview -- <case-id>" to see the full text.`);
  process.exit(1);
}
console.log('\n✓ No wording problems found.');
