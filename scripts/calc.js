/**
 * calc.js — a tiny, safe calculator for case formulas.
 *
 * Case files describe each calculation as a formula, e.g.
 *   "households_m * ev_share"
 * This module turns that text into a number. It understands only:
 *   - numbers (41, 0.06, 1.2e6)
 *   - names of inputs or earlier steps (households_m)
 *   - + - * / ^ and parentheses
 *   - a short list of helper functions (round, min, max, ...)
 *
 * It deliberately does NOT use JavaScript's eval(), so a formula can never
 * run arbitrary code — it can only do arithmetic.
 */

/** Helper functions a formula may call. */
const FUNCTIONS = {
  round: (x, digits = 0) => {
    const f = 10 ** digits;
    return Math.round(x * f) / f;
  },
  min: (...xs) => Math.min(...xs),
  max: (...xs) => Math.max(...xs),
  abs: (x) => Math.abs(x),
  floor: (x) => Math.floor(x),
  ceil: (x) => Math.ceil(x),
  sqrt: (x) => Math.sqrt(x),
};

/** Step 1: split the formula text into tokens (numbers, names, operators). */
function tokenize(src) {
  const tokens = [];
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (/[0-9.]/.test(ch)) {
      const m = /^(\d+\.?\d*|\.\d+)(e[+-]?\d+)?/i.exec(src.slice(i));
      if (!m) throw new Error(`Bad number at position ${i}`);
      tokens.push({ type: 'num', value: parseFloat(m[0]) });
      i += m[0].length;
      continue;
    }
    if (/[A-Za-z_]/.test(ch)) {
      const m = /^[A-Za-z_][A-Za-z0-9_]*/.exec(src.slice(i));
      tokens.push({ type: 'name', value: m[0] });
      i += m[0].length;
      continue;
    }
    if ('+-*/^(),'.includes(ch)) {
      tokens.push({ type: 'op', value: ch });
      i++;
      continue;
    }
    throw new Error(`Unexpected character "${ch}" at position ${i}`);
  }
  return tokens;
}

/**
 * Step 2: read the tokens with the usual order of operations:
 *   parentheses → ^ → unary minus → * / → + -
 * Returns the numeric result. `scope` maps names to numbers.
 * `usedNames` (optional Set) collects every name the formula refers to.
 */
function parse(tokens, scope, usedNames) {
  let pos = 0;
  const peek = () => tokens[pos];
  const isOp = (v) => peek() && peek().type === 'op' && peek().value === v;
  const expect = (v) => {
    if (!isOp(v)) throw new Error(`Expected "${v}"`);
    pos++;
  };

  function expression() {
    let left = term();
    while (isOp('+') || isOp('-')) {
      const op = tokens[pos++].value;
      const right = term();
      left = op === '+' ? left + right : left - right;
    }
    return left;
  }

  function term() {
    let left = unary();
    while (isOp('*') || isOp('/')) {
      const op = tokens[pos++].value;
      const right = unary();
      if (op === '/' && right === 0) throw new Error('Division by zero');
      left = op === '*' ? left * right : left / right;
    }
    return left;
  }

  function unary() {
    if (isOp('-')) {
      pos++;
      return -unary();
    }
    if (isOp('+')) {
      pos++;
      return unary();
    }
    return power();
  }

  function power() {
    const base = primary();
    if (isOp('^')) {
      pos++;
      return base ** unary(); // right-associative: 2^3^2 = 2^9
    }
    return base;
  }

  function primary() {
    const tok = peek();
    if (!tok) throw new Error('Formula ended unexpectedly');
    if (tok.type === 'num') {
      pos++;
      return tok.value;
    }
    if (tok.type === 'name') {
      pos++;
      // Function call, e.g. round(x, 1)
      if (isOp('(')) {
        const fn = FUNCTIONS[tok.value];
        if (!fn) throw new Error(`Unknown function "${tok.value}"`);
        pos++;
        const args = [];
        if (!isOp(')')) {
          args.push(expression());
          while (isOp(',')) {
            pos++;
            args.push(expression());
          }
        }
        expect(')');
        return fn(...args);
      }
      // Plain name, e.g. households_m
      if (usedNames) usedNames.add(tok.value);
      if (!(tok.value in scope)) throw new Error(`Unknown name "${tok.value}"`);
      return scope[tok.value];
    }
    if (isOp('(')) {
      pos++;
      const v = expression();
      expect(')');
      return v;
    }
    throw new Error(`Unexpected "${tok.value}"`);
  }

  const result = expression();
  if (pos < tokens.length) throw new Error(`Unexpected "${tokens[pos].value}"`);
  return result;
}

/**
 * Evaluate a formula string against a scope of named values.
 * Throws a readable Error if the formula is invalid.
 */
export function evaluate(formula, scope = {}) {
  const value = parse(tokenize(String(formula)), scope);
  if (!Number.isFinite(value)) throw new Error('Result is not a finite number');
  return value;
}

/** List the names (not functions) a formula refers to. */
export function namesIn(formula) {
  const names = new Set();
  try {
    // Use a scope that answers 1 for every name, so parsing never stops early.
    const anything = new Proxy({}, { has: () => true, get: () => 1 });
    parse(tokenize(String(formula)), anything, names);
  } catch {
    /* syntax errors are reported by evaluate() */
  }
  return [...names];
}
