/**
 * drills.js — the mental-math drills page.
 *
 * Flow: choose a topic and length → answer questions (Enter to check,
 * Enter again for the next one) → see a summary. Results are saved in
 * the browser and appear on the progress page.
 * Questions come from drill-generators.js, which has its own test.
 */
import { DRILL_CATEGORIES, makeQuestion, isCorrect, formatAnswer } from './drill-generators.js';
import { addDrillResult, loadProgress } from './storage.js';
import { escapeHtml, formatDuration } from './labels.js';

const SPRINT_SECONDS = 120;
const ROUND_LENGTH = 10;

const $ = (sel) => document.querySelector(sel);
const setup = $('[data-setup]');
const play = $('[data-play]');
const results = $('[data-results]');
const answerForm = $('[data-answer-form]');
const input = $('#answer');
const feedback = $('[data-feedback]');
const announce = $('[data-announce]');

const UNIT_LABEL = { '%': '%', $: '$', $M: '$M', years: 'years', '': '' };

let round = null; // the round in progress

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

$('[data-categories]').innerHTML = Object.entries(DRILL_CATEGORIES)
  .map(
    ([key, c], i) => `
    <label class="choice"><input type="radio" name="category" value="${key}"${i === 0 ? ' checked' : ''}>
      <span><strong>${c.name}</strong><small>${c.blurb}</small></span></label>`,
  )
  .join('');

function showBest() {
  const category = setup.elements.category.value;
  const length = setup.elements.roundLength.value;
  const past = loadProgress().drills.filter((d) => d.category === category && d.length === length);
  const best = past.reduce((b, d) => (d.correct > (b?.correct ?? -1) ? d : b), null);
  $('[data-best]').textContent = best ? `Your best: ${best.correct} / ${best.total}${length === 'sprint' ? ' in 2 minutes' : ''}.` : '';
}
setup.addEventListener('change', showBest);
showBest();

setup.addEventListener('submit', (e) => {
  e.preventDefault();
  startRound(setup.elements.category.value, setup.elements.roundLength.value);
});

// ---------------------------------------------------------------------------
// Playing a round
// ---------------------------------------------------------------------------

function startRound(category, length) {
  round = { category, length, startedAt: Date.now(), answered: [], current: null, state: 'answering', timer: null, lastAnnounced: null };
  setup.hidden = true;
  results.hidden = true;
  play.hidden = false;
  if (length === 'sprint') round.timer = setInterval(tickSprint, 250);
  nextQuestion();
}

const elapsed = () => (Date.now() - round.startedAt) / 1000;

function updateBar() {
  const correct = round.answered.filter((a) => a.ok).length;
  if (round.length === 'sprint') {
    const left = Math.max(0, SPRINT_SECONDS - elapsed());
    $('[data-progress]').textContent = `${formatDuration(Math.ceil(left))} left`;
  } else {
    $('[data-progress]').textContent = `Question ${Math.min(round.answered.length + 1, ROUND_LENGTH)} of ${ROUND_LENGTH}`;
  }
  $('[data-score]').textContent = `${correct} correct`;
}

function tickSprint() {
  const left = SPRINT_SECONDS - elapsed();
  updateBar();
  // Spoken reminders for screen-reader users at 60 and 30 seconds.
  for (const mark of [60, 30]) {
    if (left <= mark && round.lastAnnounced !== mark && left > mark - 1) {
      round.lastAnnounced = mark;
      announce.textContent = `${mark} seconds left`;
    }
  }
  if (left <= 0) endRound('Time is up.');
}

function nextQuestion() {
  if (round.length === 'ten' && round.answered.length >= ROUND_LENGTH) return endRound();
  round.current = makeQuestion(round.category);
  round.state = 'answering';
  $('[data-question]').textContent = round.current.prompt;
  $('[data-unit]').textContent = UNIT_LABEL[round.current.unit] ?? '';
  feedback.innerHTML = '';
  feedback.className = 'feedback';
  input.value = '';
  input.readOnly = false;
  $('[data-submit]').textContent = 'Check';
  updateBar();
  input.focus();
}

function check(skipped = false) {
  const q = round.current;
  const typed = input.value.trim();
  if (!skipped && !typed) {
    feedback.textContent = 'Type an answer, or press Skip.';
    return;
  }
  const ok = !skipped && isCorrect(typed, q);
  round.answered.push({ q, typed: skipped ? '(skipped)' : typed, ok });
  round.state = 'feedback';
  input.readOnly = true;
  feedback.className = `feedback ${ok ? 'is-correct' : 'is-wrong'}`;
  feedback.innerHTML = ok
    ? `<strong>Correct.</strong> ${escapeHtml(formatAnswer(q))}`
    : `<strong>${skipped ? 'Skipped.' : 'Not quite.'}</strong> The answer is <strong>${escapeHtml(formatAnswer(q))}</strong>. <span class="muted">${escapeHtml(q.explain)}</span>`;
  $('[data-submit]').textContent = 'Next';
  updateBar();
  // In a sprint, keep momentum: move on automatically after a correct answer.
  if (ok && round.length === 'sprint') setTimeout(() => round && round.state === 'feedback' && nextQuestion(), 700);
  else $('[data-submit]').focus();
}

answerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!round) return;
  if (round.state === 'answering') check();
  else nextQuestion();
});
$('[data-skip]').addEventListener('click', () => round?.state === 'answering' && check(true));
$('[data-quit]').addEventListener('click', () => endRound());

// ---------------------------------------------------------------------------
// Results
// ---------------------------------------------------------------------------

function endRound(reason = '') {
  if (!round) return;
  clearInterval(round.timer);
  const seconds = Math.min(Math.round(elapsed()), round.length === 'sprint' ? SPRINT_SECONDS : Infinity);
  const total = round.answered.length;
  const correct = round.answered.filter((a) => a.ok).length;
  const finished = round;
  round = null;

  if (total) addDrillResult({ category: finished.category, length: finished.length, correct, total, seconds });

  const pct = total ? Math.round((correct / total) * 100) : 0;
  $('[data-summary]').innerHTML = `
    <div class="stat"><p class="stat-value">${correct}<span class="muted"> / ${total}</span></p><p class="stat-caption">correct</p></div>
    <div class="stat"><p class="stat-value">${pct}%</p><p class="stat-caption">accuracy</p></div>
    <div class="stat"><p class="stat-value">${total ? (seconds / total).toFixed(1) : '–'}s</p><p class="stat-caption">per question</p></div>`;

  const misses = finished.answered.filter((a) => !a.ok);
  $('[data-review]').innerHTML = misses.length
    ? `<h3>Review your misses</h3><ul class="review-list">${misses
        .map((m) => `<li><p>${escapeHtml(m.q.prompt)}</p><p class="muted">You said ${escapeHtml(m.typed)} · Answer: <strong>${escapeHtml(formatAnswer(m.q))}</strong> — ${escapeHtml(m.q.explain)}</p></li>`)
        .join('')}</ul>`
    : total
      ? '<p><strong>A perfect round.</strong> Try a sprint or a harder topic.</p>'
      : '';

  $('#h-results').textContent = reason ? `${reason} Round complete` : 'Round complete';
  play.hidden = true;
  results.hidden = false;
  results.focus();
  results.dataset.category = finished.category;
  results.dataset.length = finished.length;
}

$('[data-again]').addEventListener('click', () => startRound(results.dataset.category, results.dataset.length));
$('[data-change]').addEventListener('click', () => {
  results.hidden = true;
  setup.hidden = false;
  showBest();
  setup.querySelector('input:checked').focus();
});
