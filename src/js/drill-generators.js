/**
 * drill-generators.js — random mental-math questions for the drills page.
 *
 * Pure functions with no page code, so the same file is used by the browser
 * and by the automated test (scripts/test-drills.js), which checks thousands
 * of generated questions.
 *
 * Every question has:
 *   prompt     — the question text
 *   answer     — the exact answer, in the units the user types
 *   unit       — '%', '$', '$M', 'years' or '' (shown next to the input box)
 *   tolerance  — allowed relative error (0.01 = within 1%)
 *   explain    — a short "how to do it in your head" hint
 *   kind       — which formula was used (the test re-checks it)
 *   inputs     — the numbers shown in the prompt, in order
 */

export const DRILL_CATEGORIES = {
  mixed: { name: 'Mixed', blurb: 'A bit of everything.' },
  percentages: { name: 'Percentages', blurb: 'X% of Y, and what share one number is of another.' },
  growth: { name: 'Growth rates', blurb: 'Growth %, compounding and the rule of 72.' },
  breakeven: { name: 'Break-evens', blurb: 'Break-even volume, revenue and payback.' },
  bignumbers: { name: 'Big numbers', blurb: 'Multiplying and dividing millions and billions.' },
};

// ---------------------------------------------------------------------------
// Number helpers
// ---------------------------------------------------------------------------

const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];

/** Round away floating-point noise (e.g. 0.1 * 3 = 0.30000000000000004). */
const clean = (x) => Number(x.toPrecision(12));

/**
 * Write a number the way you'd say it in an interview:
 * 2,400 · 36,000 · 4.5 million · 1.2 billion · 2.5 trillion.
 */
export function formatBig(n) {
  const abs = Math.abs(n);
  const trim = (x) => Number(x.toPrecision(12)).toLocaleString('en-US', { maximumFractionDigits: 3 });
  if (abs >= 1e12) return `${trim(n / 1e12)} trillion`;
  if (abs >= 1e9) return `${trim(n / 1e9)} billion`;
  if (abs >= 1e6) return `${trim(n / 1e6)} million`;
  return trim(n);
}

const money = (n) => (n < 0 ? `−$${formatBig(-n)}` : `$${formatBig(n)}`);

/**
 * Read what the user typed. Accepts commas, $, %, x, and suffixes like
 * k, m, mm, b, bn, t or words (thousand, million, billion, trillion).
 * Unit words at the end ("years", "units") are ignored.
 * Examples: "1.44B" → 1.44e9, "35%" → 35, "60,000" → 60000, "−5" → -5, "4 years" → 4.
 * Returns NaN if it can't be read.
 */
export function parseAnswer(text) {
  const s = String(text).trim().toLowerCase().replace(/[−–]/g, '-').replace(/[$€£,\s]/g, '').replace(/(%|x|years?|yrs?|units?)$/, '');
  const m = /^(-?\d*\.?\d+)(k|thousand|m|mm|mn|million|b|bn|billion|t|tn|trillion)?$/.exec(s);
  if (!m) return NaN;
  const scale = { k: 1e3, thousand: 1e3, m: 1e6, mm: 1e6, mn: 1e6, million: 1e6, b: 1e9, bn: 1e9, billion: 1e9, t: 1e12, tn: 1e12, trillion: 1e12 }[m[2]] ?? 1;
  return clean(parseFloat(m[1]) * scale);
}

/** Is the typed text within the question's tolerance? */
export function isCorrect(text, q) {
  let v = parseAnswer(text);
  if (!Number.isFinite(v)) return false;
  // For answers asked "in $M", accept "121" and also "121M" / "121,000,000".
  if (q.unit === '$M' && Math.abs(v) >= 1e5) v /= 1e6;
  if (q.answer === 0) return Math.abs(v) < 1e-9;
  return Math.abs(v - q.answer) / Math.abs(q.answer) <= q.tolerance;
}

/** The answer written out for feedback, e.g. "168", "25%", "1.44 billion". */
export function formatAnswer(q) {
  const shown = Number(q.answer.toPrecision(4));
  if (q.unit === '%') return `${formatBig(shown)}%`;
  if (q.unit === '$') return money(shown);
  if (q.unit === '$M') return `$${formatBig(shown)}M`;
  if (q.unit === 'years') return `${formatBig(shown)} years`;
  return formatBig(shown);
}

// ---------------------------------------------------------------------------
// Question generators (one per kind)
// ---------------------------------------------------------------------------

/** A "nice" base number: 2–60 × 10, 100 or 1,000 (e.g. 480, 3,600, 24,000). */
const niceBase = (rng) => pick(rng, [12, 16, 18, 24, 30, 36, 40, 48, 60, 64, 72, 80, 90, 120, 150, 240, 360, 480]) * pick(rng, [1, 10, 100, 1000]);

const GENERATORS = {
  percentages: [
    function percentOf(rng) {
      const p = pick(rng, [5, 10, 12.5, 15, 20, 25, 30, 35, 40, 45, 60, 65, 75, 80]);
      const base = niceBase(rng);
      return {
        kind: 'percentOf',
        inputs: [p, base],
        prompt: `What is ${p}% of ${formatBig(base)}?`,
        answer: clean((p / 100) * base),
        unit: '',
        tolerance: 0.01,
        explain: `10% of ${formatBig(base)} is ${formatBig(clean(base / 10))}, so ${p}% is ${p / 10} × that.`,
      };
    },
    function shareOf(rng) {
      const p = pick(rng, [5, 10, 12.5, 15, 20, 25, 30, 40, 45, 60, 75, 80]);
      const whole = niceBase(rng);
      const part = clean((p / 100) * whole);
      return {
        kind: 'shareOf',
        inputs: [part, whole],
        prompt: `${formatBig(part)} is what percent of ${formatBig(whole)}?`,
        answer: p,
        unit: '%',
        tolerance: 0.01,
        explain: `Divide part by whole: ${formatBig(part)} ÷ ${formatBig(whole)}. Simplify the fraction first.`,
      };
    },
  ],

  growth: [
    function growthRate(rng) {
      const start = pick(rng, [40, 50, 60, 80, 120, 150, 200, 250, 400]);
      const g = pick(rng, [5, 10, 12.5, 15, 20, 25, 30, 40, 50, -10, -20, -25]);
      const end = clean(start * (1 + g / 100));
      return {
        kind: 'growthRate',
        inputs: [start, end],
        prompt: `Revenue went from ${money(start * 1e6)} to ${money(end * 1e6)}. What was the growth rate?`,
        answer: g,
        unit: '%',
        tolerance: 0.01,
        explain: `Change ÷ starting value: (${formatBig(end)} − ${formatBig(start)}) ÷ ${formatBig(start)}.`,
      };
    },
    function compound(rng) {
      const start = pick(rng, [50, 80, 100, 200, 500]);
      const g = pick(rng, [5, 10, 20]);
      const years = pick(rng, [2, 3]);
      return {
        kind: 'compound',
        inputs: [start, g, years],
        prompt: `A ${money(start * 1e6)} business grows ${g}% a year for ${years} years. Roughly how big is it at the end (in $M)?`,
        answer: clean(start * (1 + g / 100) ** years),
        unit: '$M',
        tolerance: 0.02,
        explain: `Multiply by ${1 + g / 100} once per year: ${Array.from({ length: years + 1 }, (_, i) => formatBig(Number((start * (1 + g / 100) ** i).toFixed(1)))).join(' → ')}.`,
      };
    },
    function doubling(rng) {
      const g = pick(rng, [3, 4, 6, 8, 9, 12, 18]);
      return {
        kind: 'doubling',
        inputs: [g],
        prompt: `At ${g}% growth a year, roughly how many years does it take to double?`,
        answer: clean(72 / g),
        unit: 'years',
        tolerance: 0.1,
        explain: `Rule of 72: 72 ÷ ${g} ≈ ${formatBig(clean(72 / g))} years.`,
      };
    },
    function cagr(rng) {
      const years = pick(rng, [3, 4, 5, 6, 8, 10, 12]);
      const start = pick(rng, [50, 100, 200, 400]);
      return {
        kind: 'cagr',
        inputs: [start, start * 2, years],
        prompt: `Sales doubled from ${money(start * 1e6)} to ${money(start * 2e6)} in ${years} years. Roughly what annual growth rate is that?`,
        answer: clean((2 ** (1 / years) - 1) * 100),
        unit: '%',
        tolerance: 0.08,
        explain: `Rule of 72 in reverse: 72 ÷ ${years} ≈ ${formatBig(Number((72 / years).toFixed(1)))}%.`,
      };
    },
  ],

  breakeven: [
    function breakevenUnits(rng) {
      const contribution = pick(rng, [5, 10, 20, 25, 40, 50]);
      const variable = pick(rng, [5, 10, 15, 20, 30, 60]);
      const units = pick(rng, [10000, 20000, 40000, 50000, 60000, 100000, 250000]);
      const fixed = contribution * units;
      const price = variable + contribution;
      return {
        kind: 'breakevenUnits',
        inputs: [fixed, price, variable],
        prompt: `Fixed costs are ${money(fixed)} a year. Each unit sells for $${price} and costs $${variable} to make. How many units to break even?`,
        answer: units,
        unit: '',
        tolerance: 0.01,
        explain: `Fixed costs ÷ contribution per unit ($${price} − $${variable} = $${contribution}).`,
      };
    },
    function payback(rng) {
      const saving = pick(rng, [2, 4, 5, 8, 10, 20, 25]);
      const years = pick(rng, [2, 2.5, 3, 4, 5, 6, 8]);
      const invest = clean(saving * years);
      return {
        kind: 'payback',
        inputs: [invest, saving],
        prompt: `A ${money(invest * 1e6)} investment saves ${money(saving * 1e6)} a year. What is the payback period?`,
        answer: years,
        unit: 'years',
        tolerance: 0.01,
        explain: `Investment ÷ annual saving.`,
      };
    },
    function breakevenRevenue(rng) {
      const margin = pick(rng, [20, 25, 40, 50, 60, 75]);
      const revenue = pick(rng, [8, 12, 16, 20, 40, 60, 80, 100]);
      const fixed = clean((margin / 100) * revenue);
      return {
        kind: 'breakevenRevenue',
        inputs: [margin, fixed],
        prompt: `Contribution margin is ${margin}% and fixed costs are ${money(fixed * 1e6)}. What revenue breaks even (in $M)?`,
        answer: revenue,
        unit: '$M',
        tolerance: 0.01,
        explain: `Fixed costs ÷ contribution margin: ${formatBig(fixed)} ÷ ${margin / 100}.`,
      };
    },
  ],

  bignumbers: [
    function multiply(rng) {
      const a = pick(rng, [1.5, 2, 2.5, 3, 4, 4.5, 6, 8, 12, 15, 25, 35, 45]) * pick(rng, [1e3, 1e4, 1e5, 1e6, 1e7]);
      const b = pick(rng, [2, 3, 4, 5, 8, 12, 20, 40, 60, 80, 150, 250, 320]) * pick(rng, [1, 10, 100, 1000]);
      return {
        kind: 'multiply',
        inputs: [a, b],
        prompt: `${formatBig(a)} × ${formatBig(b)} = ?`,
        answer: clean(a * b),
        unit: '',
        tolerance: 0.01,
        explain: `Multiply the leading digits, then count the zeros. Write it as e.g. 1.2B or 1,200,000,000.`,
      };
    },
    function divide(rng) {
      const answer = pick(rng, [15, 20, 25, 40, 50, 60, 75, 120, 150, 250, 300, 400]) * pick(rng, [1, 10, 100, 1000]);
      const divisor = pick(rng, [4, 8, 12, 20, 25, 40, 50, 80]) * pick(rng, [1, 10, 100, 1000]);
      const total = clean(answer * divisor);
      return {
        kind: 'divide',
        inputs: [total, divisor],
        prompt: `${money(total)} ÷ ${formatBig(divisor)} = ? (in $)`,
        answer,
        unit: '$',
        tolerance: 0.01,
        explain: `Cancel zeros from both numbers first, then divide.`,
      };
    },
  ],
};

/** Make one question. `rng` returns numbers in [0, 1) — Math.random by default. */
export function makeQuestion(category = 'mixed', rng = Math.random) {
  const cat = category === 'mixed' ? pick(rng, Object.keys(GENERATORS)) : category;
  const gen = pick(rng, GENERATORS[cat]);
  return { category: cat, ...gen(rng) };
}

/** Every generator kind, for the test. */
export const KINDS = Object.values(GENERATORS)
  .flat()
  .map((g) => g.name);
