/**
 * test-math.js — recalculates every number in every case.
 *
 * Run with:  npm run test:math
 *
 * Fails (exit code 1) if:
 *   - the calculator itself gives a wrong answer on known examples
 *   - a formula's result differs from the case's `expected` value
 *   - a formula refers to a name that isn't defined before it
 *   - an input and a calculation share the same name
 *   - a {{placeholder}} in the text or exhibits doesn't resolve
 *   - a bar-chart value refers to an unknown name
 *   - `answer.calc` doesn't point at a calculation
 */
import { evaluate } from './calc.js';
import { caseFiles, readCase, computeCase, findMissingPlaceholders, DEFAULT_TOLERANCE } from './load-cases.js';

let failures = 0;
const fail = (msg) => {
  failures++;
  console.error(`  ✗ ${msg}`);
};

// --- 1. Check the calculator itself --------------------------------------
const selfChecks = [
  ['1 + 2 * 3', 7],
  ['(1 + 2) * 3', 9],
  ['-2 ^ 2', -4],
  ['2 ^ 3 ^ 2', 512],
  ['10 / 4', 2.5],
  ['round(2.345, 2)', 2.35],
  ['max(1, 5, 3) - min(4, 2)', 3],
  ['a * (1 + g) ^ 2', 121, { a: 100, g: 0.1 }],
];
console.log('Calculator self-check');
for (const [formula, want, scope] of selfChecks) {
  const got = evaluate(formula, scope);
  if (Math.abs(got - want) > 1e-9) fail(`"${formula}" gave ${got}, expected ${want}`);
}
for (const bad of ['1 +', 'foo(1)', '2 ** 3', 'x', 'alert(1)', '1; 2']) {
  try {
    evaluate(bad, {});
    fail(`"${bad}" should have been rejected`);
  } catch {
    /* expected */
  }
}

// --- 2. Check every case ---------------------------------------------------
let calcCount = 0;
const files = caseFiles();
for (const file of files) {
  let raw;
  try {
    raw = readCase(file);
  } catch (err) {
    console.log(`\n${file}`);
    fail(err.message);
    continue;
  }
  const { meta } = raw;
  console.log(`\n${raw.fileName}`);

  const inputNames = Object.keys(meta.inputs || {});
  for (const step of meta.calculations || []) {
    if (inputNames.includes(step.id)) fail(`"${step.id}" is both an input and a calculation`);
  }

  const { values, results } = computeCase(meta);
  for (const r of results) {
    calcCount++;
    if (r.ok) {
      console.log(`  ✓ ${r.id} = ${+r.value.toPrecision(6)}`);
    } else if (r.error) {
      fail(`${r.id}: ${r.error}  (formula: ${r.formula})`);
    } else {
      const step = meta.calculations.find((s) => s.id === r.id);
      const tol = (step.tolerance ?? DEFAULT_TOLERANCE) * 100;
      fail(`${r.id}: formula gives ${+r.value.toPrecision(6)}, case says ${r.expected} (tolerance ${tol}%)`);
    }
  }

  for (const name of findMissingPlaceholders(raw, values)) fail(`placeholder {{${name}}} doesn't match any input or calculation`);

  for (const ex of meta.exhibits || []) {
    for (const d of ex.data || []) {
      if (typeof d.value !== 'number' && !(d.value in values)) fail(`${ex.id}: bar value "${d.value}" is not a number or known name`);
    }
  }

  const answerCalc = meta.answer?.calc;
  if (!answerCalc || !(meta.calculations || []).some((s) => s.id === answerCalc)) {
    fail(`answer.calc "${answerCalc}" must name one of the calculations`);
  }
}

// --- 3. Summary -----------------------------------------------------------
console.log(`\n${files.length} cases, ${calcCount} calculations checked.`);
if (failures) {
  console.error(`✗ ${failures} problem(s) found.`);
  process.exit(1);
}
console.log('✓ All math checks passed.');
