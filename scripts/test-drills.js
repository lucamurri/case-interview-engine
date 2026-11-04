/**
 * test-drills.js — checks the mental-math drill generator.
 *
 * Run with:  npm run test:drills
 *
 * Generates thousands of questions (with a fixed random seed, so results
 * are repeatable) and fails if:
 *   - an answer doesn't match an independent recalculation from the
 *     numbers actually shown in the question
 *   - a number shown in the question was rounded on screen
 *   - the correct answer, typed the way the site displays it, is marked wrong
 *   - a clearly wrong answer (20% off) is marked right
 *   - the answer parser misreads common formats ("1.2B", "35%", "60,000")
 */
import { makeQuestion, parseAnswer, isCorrect, formatAnswer, formatBig, KINDS, DRILL_CATEGORIES } from '../src/js/drill-generators.js';

let failures = 0;
const fail = (msg) => {
  failures++;
  if (failures <= 20) console.error(`  ✗ ${msg}`);
};

// 1. The answer parser -------------------------------------------------------
const parseCases = [
  ['168', 168], ['1,200', 1200], ['$4.5M', 4.5e6], ['1.44b', 1.44e9], ['1.44 billion', 1.44e9], ['2bn', 2e9],
  ['35%', 35], ['60k', 60000], ['−5', -5], ['-12.5', -12.5], ['3mm', 3e6], ['2.5 trillion', 2.5e12], ['.5', 0.5], ['4 years', 4], ['2.5 yrs', 2.5], ['60,000 units', 60000],
];
for (const [text, want] of parseCases) {
  const got = parseAnswer(text);
  if (got !== want) fail(`parseAnswer("${text}") gave ${got}, expected ${want}`);
}
for (const bad of ['', 'abc', '1.2.3', '5 apples', '1e5e']) {
  if (!Number.isNaN(parseAnswer(bad))) fail(`parseAnswer("${bad}") should be unreadable`);
}

// 2. Independent formulas, one per kind, using only the numbers shown -----------
const RECOMPUTE = {
  percentOf: ([p, base]) => (p / 100) * base,
  shareOf: ([part, whole]) => (part / whole) * 100,
  growthRate: ([start, end]) => ((end - start) / start) * 100,
  compound: ([start, g, years]) => start * Math.pow(1 + g / 100, years),
  doubling: ([g]) => 72 / g,
  cagr: ([start, end, years]) => (Math.pow(end / start, 1 / years) - 1) * 100,
  breakevenUnits: ([fixed, price, variable]) => fixed / (price - variable),
  payback: ([invest, saving]) => invest / saving,
  breakevenRevenue: ([margin, fixed]) => fixed / (margin / 100),
  multiply: ([a, b]) => a * b,
  divide: ([total, divisor]) => total / divisor,
};
for (const kind of KINDS) if (!RECOMPUTE[kind]) fail(`no independent check written for drill kind "${kind}"`);

// A small seeded random-number generator (mulberry32) for repeatable runs.
function seeded(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 3. Thousands of generated questions ---------------------------------------
const rng = seeded(42);
const seenKinds = new Set();
let count = 0;
for (const category of Object.keys(DRILL_CATEGORIES)) {
  for (let i = 0; i < 1000; i++) {
    const q = makeQuestion(category, rng);
    count++;
    seenKinds.add(q.kind);
    const where = `${q.kind}: "${q.prompt}"`;

    if (!Number.isFinite(q.answer)) fail(`${where} has no numeric answer`);
    const expected = RECOMPUTE[q.kind](q.inputs);
    if (Math.abs(expected - q.answer) > 1e-9 * Math.max(1, Math.abs(expected))) fail(`${where} answer ${q.answer} ≠ recomputed ${expected}`);

    // Numbers shown on screen must be exact (no hidden rounding).
    for (const x of q.inputs) {
      if (parseAnswer(formatBig(x)) !== x) fail(`${where} shows ${formatBig(x)} for ${x} (rounded on screen)`);
    }

    if (!isCorrect(formatAnswer(q), q)) fail(`${where} rejects its own displayed answer "${formatAnswer(q)}"`);
    if (!isCorrect(String(q.answer), q)) fail(`${where} rejects the exact answer ${q.answer}`);
    if (isCorrect(String(q.answer * 1.2), q)) fail(`${where} accepts a 20% wrong answer`);
  }
}
for (const kind of KINDS) if (!seenKinds.has(kind)) fail(`drill kind "${kind}" was never generated`);

console.log(`${count} drill questions checked across ${KINDS.length} kinds.`);
if (failures) {
  console.error(`✗ ${failures} problem(s) found.`);
  process.exit(1);
}
console.log('✓ All drill checks passed.');
