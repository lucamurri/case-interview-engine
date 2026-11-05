/**
 * partner.js — partner mode (case.html?id=...&mode=partner).
 *
 * For practicing with a friend: the friend plays the interviewer and sees
 * everything at once, laid out as a "run of show" in interview order:
 * what to read aloud, what to answer only if asked, what to ask at each
 * step, and what a good answer looks like. Exhibits can be shown to the
 * candidate full-screen without revealing the insight.
 */
import { renderExhibit } from './exhibits.js';
import { rubricForm, RUBRIC } from './rubric.js';

/** A labelled block: the question to ask, then what good looks like. */
function scriptItem({ title, ask, fallback, good, goodLabel = 'What good looks like' }) {
  return `
    <section class="script-item">
      <h3>${title}</h3>
      <div class="ask"><p class="ask-label">${ask ? 'Ask' : 'If the candidate stalls'}</p><p>${ask || fallback}</p></div>
      <div class="model-answer"><p class="model-label">${goodLabel}</p>${good}</div>
    </section>`;
}

export function partnerBody(c) {
  const s = c.sections;
  const candidateLed = c.format === 'candidate-led';
  const keyNumbers = `
    <details class="key-numbers">
      <summary>All key numbers <span class="muted">(each one verified by an automated test)</span></summary>
      <div class="table-scroll" tabindex="0" role="region" aria-label="Key numbers"><table>
        <tbody>${c.keyNumbers.map((k) => `<tr><th scope="row">${k.label}</th><td>${k.display}</td></tr>`).join('')}</tbody>
      </table></div>
    </details>`;

  const exhibits = c.exhibits
    .map(
      (ex, i) => `
      <section class="script-item">
        <h3>Exhibit ${ex.number}</h3>
        ${ex.ask ? `<div class="ask"><p class="ask-label">Hand over and ask</p><p>${ex.ask}</p></div>` : ''}
        <div class="step-actions step-actions-start">
          <button class="button button-outline" type="button" data-present="${i}">Show Exhibit ${ex.number} to the candidate</button>
        </div>
        ${renderExhibit(ex)}
        ${ex.insight ? `<div class="model-answer"><p class="model-label">Key insight to listen for</p><div class="prose">${ex.insight}</div></div>` : ''}
      </section>`,
    )
    .join('');

  return `
    <section class="partner-intro" aria-labelledby="h-partner">
      <h2 id="h-partner">You're the interviewer</h2>
      <p>Everything is visible to you, so keep your screen away from the candidate. ${
        candidateLed
          ? 'This case is <strong>candidate-led</strong>: let the candidate drive, and use the questions below only to nudge if they stall.'
          : 'This case is <strong>interviewer-led</strong>: ask the questions below in order.'
      } Start the timer when you begin reading.</p>
      <div class="button-row">
        <button class="button" type="button" data-print>Print interviewer sheet</button>
      </div>
      <p class="muted print-hint">Prints the whole run of show, a paper scorecard, and one page per exhibit to hand to the candidate.</p>
      <nav aria-label="Jump to"><ul class="jump-links">
        <li><a href="#p-prompt">Prompt</a></li><li><a href="#p-clarifiers">If asked</a></li><li><a href="#p-run">Run of show</a></li><li><a href="#p-debrief">Debrief</a></li><li><a href="#p-score">Score</a></li>
      </ul></nav>
    </section>

    <section class="step" id="p-prompt" aria-labelledby="h-p-prompt">
      <h2 id="h-p-prompt">1. Read aloud</h2>
      <div class="prompt-text prose">${s.prompt.html}</div>
    </section>

    <section class="step" id="p-clarifiers" aria-labelledby="h-p-clar">
      <h2 id="h-p-clar">2. Answer only if asked</h2>
      <p class="tip">Share each fact only when the candidate asks for it (or something close). Note which ones they missed.</p>
      <dl class="clarifier-list">
        ${c.clarifiers.map((q) => `<dt>${q.q}</dt><dd class="prose">${q.a}</dd>`).join('')}
      </dl>
    </section>

    <section class="step" id="p-run" aria-labelledby="h-p-run">
      <h2 id="h-p-run">3. Run of show</h2>
      ${scriptItem({ title: 'Structure', ask: s.structure.ask, fallback: 'How would you structure this problem?', good: `<div class="prose issue-tree">${s.structure.html}</div>` })}
      ${exhibits}
      ${scriptItem({ title: 'Math', ask: s.math.ask, fallback: 'Can you put numbers on that?', good: `<div class="prose math">${s.math.html}</div>${keyNumbers}` })}
      ${scriptItem({ title: 'Synthesis', ask: s.synthesis.ask, fallback: 'The CEO walks in. What do you recommend?', good: `<div class="prose">${s.synthesis.html}</div>` })}
      ${scriptItem({ title: 'Bonus: creative question', ask: s.creative.html.replace(/^<p>|<\/p>\s*$/g, ''), good: `<div class="prose">${s.creativeAnswer.html}</div>`, goodLabel: 'Model answer' })}
    </section>

    <section class="step" id="p-debrief" aria-labelledby="h-p-debrief">
      <h2 id="h-p-debrief">4. Debrief</h2>
      <div class="answer-line"><p class="model-label">The answer in one line</p><p>${c.answer}</p></div>
      <div class="debrief-grid">
        <section class="debrief-card prose" aria-labelledby="h-mistakes"><h3 id="h-mistakes">Watch for these mistakes</h3>${s.mistakes.html}</section>
        <section class="debrief-card prose" aria-labelledby="h-top"><h3 id="h-top">What top candidates do</h3>${s.topCandidates.html}</section>
      </div>
    </section>

    <section class="step score" id="p-score" aria-labelledby="h-score">
      <h2 id="h-score">5. Score the candidate</h2>
      <p class="tip">Score together, then save. The score is saved in this browser.</p>
      ${rubricForm()}
    </section>

    ${printExtras(c)}

    <dialog class="present" data-present-dialog aria-labelledby="present-title">
      <div class="present-inner">
        <div class="present-bar">
          <p id="present-title" class="model-label">Exhibit for the candidate</p>
          <button class="button button-quiet button-small" type="button" data-close-present>Close</button>
        </div>
        <div data-present-body></div>
      </div>
    </dialog>`;
}

/**
 * Sections that only appear on paper: a scorecard to fill in by hand, and one
 * page per exhibit to hand to the candidate (the exhibit alone: no question,
 * no insight).
 */
function printExtras(c) {
  const boxes = [1, 2, 3, 4, 5].map((n) => `<td class="box">${n}</td>`).join('');
  const rows = RUBRIC.map((d) => `<tr><th scope="row">${d.name}</th>${boxes}<td class="notes"></td></tr>`).join('');
  const handouts = c.exhibits
    .map(
      (ex) => `
      <section class="handout">
        <p class="handout-label">Candidate handout · ${c.title}</p>
        ${renderExhibit(ex).replace(/ id="[^"]*"/, '')}
      </section>`,
    )
    .join('');
  return `
    <section class="print-only print-scorecard" aria-hidden="true">
      <h2>Scorecard</h2>
      <p>Candidate: ______________________ &nbsp; Date: ____________ &nbsp; Time taken: ______ / ${c.time_minutes} min</p>
      <table>
        <thead><tr><th>Skill</th><th colspan="5">Circle a score (1 = struggled, 5 = offer-level)</th><th>Notes</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p>Overall recommendation: &nbsp; ☐ Strong yes &nbsp; ☐ Yes &nbsp; ☐ Not yet</p>
    </section>
    <div class="print-only handouts" aria-hidden="true">${handouts}</div>`;
}

/** Wire the "Show exhibit to the candidate" and "Print" buttons. */
export function wirePartner(root, c) {
  const dialog = root.querySelector('[data-present-dialog]');
  const body = dialog.querySelector('[data-present-body]');
  root.addEventListener('click', (e) => {
    const t = e.target.closest('button');
    if (!t) return;
    if (t.matches('[data-present]')) {
      // Show only the exhibit itself — not the ask or the insight.
      // Drop the id so the page doesn't contain the same id twice.
      body.innerHTML = renderExhibit(c.exhibits[Number(t.dataset.present)]).replace(/ id="[^"]*"/, '');
      dialog.showModal();
      dialog.querySelector('[data-close-present]').focus();
    } else if (t.matches('[data-close-present]')) {
      dialog.close();
    } else if (t.matches('[data-print]')) {
      window.print();
    }
  });
  // Before printing (button or Cmd+P), open every collapsed section so it
  // appears on paper; close the ones that were closed afterwards.
  let reopened = [];
  window.addEventListener('beforeprint', () => {
    reopened = [...root.querySelectorAll('details:not([open])')];
    reopened.forEach((d) => (d.open = true));
  });
  window.addEventListener('afterprint', () => reopened.forEach((d) => (d.open = false)));
  // Clicking the dark backdrop also closes it. (Escape closes it natively.)
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
}
