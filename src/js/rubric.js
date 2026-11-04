/**
 * rubric.js — the self-score form at the end of a case.
 *
 * Five dimensions, each scored 1–5. Saving stores the attempt (with the
 * timer's elapsed time and optional notes) in the browser.
 */
import { addAttempt, averageScore, caseStats } from './storage.js';
import { escapeHtml, formatDuration } from './labels.js';

export const RUBRIC = [
  { key: 'structure', name: 'Structure', hint: 'Was your approach MECE, tailored to this case and clearly laid out?' },
  { key: 'math', name: 'Math', hint: 'Were your calculations correct, organized and sanity-checked?' },
  { key: 'judgment', name: 'Business judgment', hint: 'Did you draw "so what" insights and make sensible assumptions?' },
  { key: 'synthesis', name: 'Synthesis', hint: 'Did you lead with the answer, back it up, and add risks and next steps?' },
  { key: 'communication', name: 'Communication', hint: 'Were you clear, concise and easy to follow?' },
];

const SCALE = { 1: 'Struggled', 2: 'Weak', 3: 'Solid', 4: 'Strong', 5: 'Offer-level' };

/** HTML for the rubric form. */
export function rubricForm() {
  const groups = RUBRIC.map(
    (d) => `
    <fieldset class="score-group">
      <legend><strong>${d.name}</strong> <span class="muted">${d.hint}</span></legend>
      <div class="score-options">
        ${[1, 2, 3, 4, 5]
          .map(
            (n) => `
          <label class="score-option">
            <input type="radio" name="${d.key}" value="${n}" required>
            <span><b>${n}</b><small>${SCALE[n]}</small></span>
          </label>`,
          )
          .join('')}
      </div>
    </fieldset>`,
  ).join('');
  return `
    <form class="rubric" data-rubric novalidate>
      ${groups}
      <div class="field">
        <label for="notes">Notes for next time <span class="muted">(optional)</span></label>
        <textarea id="notes" name="notes" rows="3" maxlength="2000"></textarea>
      </div>
      <p class="form-error" data-error role="alert" hidden></p>
      <button type="submit" class="button">Save my score</button>
      <div class="save-result" data-result aria-live="polite"></div>
    </form>
    <div class="history" data-history></div>`;
}

/** Wire up the form. `getSeconds` returns the timer's elapsed time. */
export function initRubric(container, { caseId, getSeconds, onSaved }) {
  const form = container.querySelector('[data-rubric]');
  const error = form.querySelector('[data-error]');
  const result = form.querySelector('[data-result]');
  const history = container.querySelector('[data-history]');

  const showHistory = () => {
    const { attempts } = caseStats(caseId);
    if (!attempts.length) {
      history.innerHTML = '';
      return;
    }
    const rows = attempts
      .slice()
      .reverse()
      .map((a) => `<tr><td>${new Date(a.date).toLocaleDateString()}</td><td>${formatDuration(a.seconds)}</td><td>${averageScore(a).toFixed(1)}</td><td>${escapeHtml(a.notes || '')}</td></tr>`)
      .join('');
    history.innerHTML = `
      <h3>Your attempts at this case</h3>
      <div class="table-scroll" tabindex="0" role="region" aria-label="Your attempts"><table>
        <thead><tr><th scope="col">Date</th><th scope="col">Time</th><th scope="col">Average</th><th scope="col">Notes</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>`;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const scores = {};
    const missing = [];
    for (const d of RUBRIC) {
      const v = form.elements[d.key].value;
      if (v) scores[d.key] = Number(v);
      else missing.push(d.name);
    }
    if (missing.length) {
      error.textContent = `Please score: ${missing.join(', ')}.`;
      error.hidden = false;
      form.querySelector(`input[name="${RUBRIC.find((d) => d.name === missing[0]).key}"]`).focus();
      return;
    }
    error.hidden = true;
    const attempt = { caseId, seconds: Math.round(getSeconds()), scores, notes: form.elements.notes.value.trim() };
    const ok = addAttempt(attempt);
    result.textContent = ok
      ? `Saved. Average score ${averageScore(attempt).toFixed(1)} / 5 in ${formatDuration(attempt.seconds)}.`
      : 'Sorry — your browser blocked saving (private browsing?). Your score was not stored.';
    form.reset();
    showHistory();
    onSaved?.();
  });

  showHistory();
}
