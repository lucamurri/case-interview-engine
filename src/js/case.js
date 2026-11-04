/**
 * case.js — the page for a single case (case.html?id=...).
 *
 * Two modes, switched with links at the top of the page:
 *   Practice (default)       — solo, step-by-step reveal (this file)
 *   Partner (&mode=partner)  — interviewer view with everything visible (partner.js)
 *
 * In practice mode the case unfolds one step at a time:
 *   Prompt → Clarifying questions → Structure → Exhibits → Math → Synthesis → Debrief & score
 * Each step shows the interviewer's question first; the model answer stays
 * hidden until the user chooses to reveal it.
 */
import { label, escapeHtml, difficultyBadge } from './labels.js';
import { Timer } from './timer.js';
import { renderExhibit } from './exhibits.js';
import { rubricForm, initRubric } from './rubric.js';
import { partnerBody, wirePartner } from './partner.js';

const root = document.querySelector('[data-case-root]');
const params = new URLSearchParams(location.search);
const caseId = params.get('id');
const mode = params.get('mode') === 'partner' ? 'partner' : 'practice';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const STEPS = [
  { key: 'prompt', title: 'Prompt' },
  { key: 'clarifiers', title: 'Clarifying questions' },
  { key: 'structure', title: 'Structure' },
  { key: 'exhibits', title: 'Exhibits' },
  { key: 'math', title: 'Math' },
  { key: 'synthesis', title: 'Synthesis' },
  { key: 'debrief', title: 'Debrief & score' },
];

/** Short coaching tips shown at the top of each step. */
const TIPS = {
  prompt: 'Listen for the objective and jot down the key facts. Play the objective back before moving on.',
  clarifiers: 'Before looking at anything, write down the 2–4 questions you would ask the interviewer. Then compare with the questions the interviewer has answers for.',
  structure: 'Take about two minutes to sketch an issue tree, then walk through it out loud as if presenting.',
  exhibits: 'Read the title and units first. Say one insight before you start calculating.',
  math: 'Write the equation before plugging in numbers. Round sensibly — and say when you round.',
  synthesis: 'Answer first, then two or three reasons, then risks and next steps. Aim for under a minute.',
  debrief: 'Compare your answer with the model, then score yourself honestly. Scores are saved only in this browser.',
};

let timer;
let unlocked = 0; // index of the furthest step revealed so far

// ---------------------------------------------------------------------------
// Small HTML helpers
// ---------------------------------------------------------------------------

/** The interviewer's question (or a default task) for a step. */
function askBlock(ask, fallback) {
  const who = ask ? 'Interviewer' : 'Your task';
  return `<div class="ask"><p class="ask-label">${who}</p><p>${ask || fallback}</p></div>`;
}

/** A button that shows/hides a block of model-answer content. */
let revealCount = 0;
function revealBlock(buttonText, contentHtml, heading = 'Model answer') {
  const id = `reveal-${++revealCount}`;
  return `
    <button class="button button-outline" type="button" aria-expanded="false" aria-controls="${id}" data-reveal data-label="${escapeHtml(buttonText)}">${escapeHtml(buttonText)}</button>
    <div class="model-answer" id="${id}" hidden>
      <p class="model-label">${heading}</p>
      ${contentHtml}
    </div>`;
}

function nextButton(index) {
  const next = STEPS[index + 1];
  return next ? `<div class="step-actions"><button class="button" type="button" data-next="${index + 1}">Next: ${next.title} <span aria-hidden="true">→</span></button></div>` : '';
}

// ---------------------------------------------------------------------------
// Step content
// ---------------------------------------------------------------------------

function stepBody(key, c) {
  const s = c.sections;
  switch (key) {
    case 'prompt':
      return `<div class="prompt-text prose">${s.prompt.html}</div>`;

    case 'clarifiers':
      // The interviewer's questions stay hidden until the user has written
      // their own, so they practice choosing what to ask.
      return `
        <div class="field own-questions">
          <label for="own-questions">Your clarifying questions <span class="muted">(only for you; not saved)</span></label>
          <textarea id="own-questions" rows="4" placeholder="e.g. What is the client's objective? Over what time frame?"></textarea>
        </div>
        <p class="muted">The interviewer has answers ready for ${c.clarifiers.length} questions.</p>
        <button class="button button-outline" type="button" data-show-clarifiers aria-expanded="false" aria-controls="clarifier-list">I've written mine — show the interviewer's questions</button>
        <ul class="clarifiers" id="clarifier-list" hidden>
          ${c.clarifiers
            .map(
              (q) => `
            <li><details>
              <summary>${q.q}</summary>
              <div class="clarifier-answer prose">${q.a}</div>
            </details></li>`,
            )
            .join('')}
        </ul>`;

    case 'structure':
      return askBlock(s.structure.ask, 'How would you structure this problem?') + revealBlock('Show model structure', `<div class="prose issue-tree">${s.structure.html}</div>`);

    case 'exhibits':
      return c.exhibits
        .map(
          (ex, i) => `
          <div class="exhibit-block" data-exhibit="${i}" ${i > 0 ? 'hidden' : ''}>
            ${ex.ask ? askBlock(ex.ask) : ''}
            ${renderExhibit(ex)}
            ${ex.insight ? revealBlock('Show key insight', `<div class="prose">${ex.insight}</div>`, 'Key insight') : ''}
            ${i < c.exhibits.length - 1 ? `<div class="step-actions"><button class="button button-quiet" type="button" data-show-exhibit="${i + 1}">Show Exhibit ${i + 2}</button></div>` : ''}
          </div>`,
        )
        .join('');

    case 'math': {
      const table = `
        <details class="key-numbers">
          <summary>All key numbers in this case <span class="muted">(each one verified by an automated test)</span></summary>
          <div class="table-scroll" tabindex="0" role="region" aria-label="Key numbers"><table>
            <tbody>${c.keyNumbers.map((k) => `<tr><th scope="row">${k.label}</th><td>${k.display}</td></tr>`).join('')}</tbody>
          </table></div>
        </details>`;
      return askBlock(s.math.ask, 'Work through the numbers. Lay out your approach before you calculate.') + revealBlock('Show math walkthrough', `<div class="prose math">${s.math.html}</div>${table}`);
    }

    case 'synthesis':
      return askBlock(s.synthesis.ask, 'Give your recommendation, answer first, in under a minute.') + revealBlock('Show model synthesis', `<div class="prose">${s.synthesis.html}</div>`);

    case 'debrief':
      return `
        <div class="answer-line"><p class="model-label">The answer in one line</p><p>${c.answer}</p></div>
        <div class="debrief-grid">
          <section class="debrief-card prose" aria-labelledby="h-mistakes"><h3 id="h-mistakes">Common mistakes</h3>${s.mistakes.html}</section>
          <section class="debrief-card prose" aria-labelledby="h-top"><h3 id="h-top">What top candidates do differently</h3>${s.topCandidates.html}</section>
        </div>
        <section class="creative" aria-labelledby="h-creative">
          <h3 id="h-creative">Bonus: creative question</h3>
          ${askBlock(s.creative.html.replace(/^<p>|<\/p>\s*$/g, ''))}
          ${revealBlock('Show model answer', `<div class="prose">${s.creativeAnswer.html}</div>`)}
        </section>
        <section class="score" aria-labelledby="h-score">
          <h3 id="h-score">Score yourself</h3>
          ${rubricForm()}
        </section>`;
    default:
      return '';
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

/** Links that switch between practice and partner mode. */
function modeSwitch(c) {
  const href = (m) => `case.html?id=${encodeURIComponent(c.id)}${m === 'partner' ? '&mode=partner' : ''}`;
  const link = (m, text) => `<a href="${href(m)}"${m === mode ? ' aria-current="page"' : ''}>${text}</a>`;
  return `<nav class="mode-switch" aria-label="Mode">${link('practice', 'Practice solo')}${link('partner', 'Partner mode (interviewer view)')}</nav>`;
}

function renderPage(c) {
  const partner = mode === 'partner';
  document.title = `${c.title}${partner ? ' (partner mode)' : ''} — Case Interview Engine`;
  root.innerHTML = `
    <p class="breadcrumb"><a href="index.html"><span aria-hidden="true">←</span> All cases</a></p>
    <header class="case-header">
      <p class="card-kicker">${escapeHtml(label('type', c.type))}</p>
      <h1>${escapeHtml(c.title)}</h1>
      <p class="client">${escapeHtml(c.client)}</p>
      <div class="case-meta">
        ${difficultyBadge(c.difficulty)}
        <ul class="tags" aria-label="Case details">
          <li>${escapeHtml(label('industry', c.industry))}</li>
          <li>${escapeHtml(label('format', c.format))}</li>
          <li>${escapeHtml(c.time_minutes)} min</li>
        </ul>
      </div>
      <p class="notice">All numbers in this case are illustrative, created for practice.</p>
      ${modeSwitch(c)}
    </header>

    <div class="case-toolbar">
      <div class="timer" data-timer role="group" aria-label="Case timer">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="13" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 9v4l2.5 2M9 2h6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <span class="timer-time" data-time role="timer"></span>
        <button class="button button-small" type="button" data-toggle>Start</button>
        <button class="button button-small button-quiet" type="button" data-reset aria-label="Reset timer">Reset</button>
        <span class="visually-hidden" aria-live="polite" data-announce></span>
      </div>
      ${partner ? '' : `<nav class="stepper" aria-label="Case steps">
        <ol>
          ${STEPS.map((st, i) => `<li><button type="button" data-goto="${i}" disabled><span class="step-num">${i + 1}</span><span class="step-name">${st.title}</span></button></li>`).join('')}
        </ol>
      </nav>`}
    </div>
    ${partner ? partnerBody(c) : practiceBody(c)}`;
}

function practiceBody(c) {
  return `
    <section class="intro" data-intro aria-labelledby="h-intro">
      <h2 id="h-intro">Practice mode</h2>
      <p>The case reveals itself step by step, like a real interview. At each step, answer out loud (or on paper) <em>before</em> revealing the model answer. The timer starts when you begin.</p>
      <button class="button button-large" type="button" data-begin>Start the case</button>
    </section>

    <div class="steps">
      ${STEPS.map(
        (st, i) => `
        <section class="step" id="step-${st.key}" data-step="${i}" aria-labelledby="h-step-${i}" hidden>
          <h2 id="h-step-${i}" tabindex="-1"><span class="step-num">${i + 1}</span> ${st.title}</h2>
          <p class="tip">${TIPS[st.key]}</p>
          ${stepBody(st.key, c)}
          ${nextButton(i)}
        </section>`,
      ).join('')}
    </div>`;
}

/** Reveal step `index` (and mark it current in the stepper). */
function goTo(index, { focus = true } = {}) {
  unlocked = Math.max(unlocked, index);
  root.querySelectorAll('[data-step]').forEach((el) => {
    if (Number(el.dataset.step) <= unlocked) el.hidden = false;
  });
  root.querySelectorAll('[data-goto]').forEach((btn) => {
    const i = Number(btn.dataset.goto);
    btn.disabled = i > unlocked;
    if (i === index) btn.setAttribute('aria-current', 'step');
    else btn.removeAttribute('aria-current');
  });
  const step = root.querySelector(`[data-step="${index}"]`);
  step.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  if (focus) step.querySelector('h2').focus({ preventScroll: true });
}

function wireEvents(c) {
  root.addEventListener('click', (e) => {
    const t = e.target.closest('button');
    if (!t) return;

    const intro = root.querySelector('[data-intro]');
    if (t.matches('[data-begin]')) {
      intro.hidden = true;
      timer.start();
      goTo(0);
    } else if (t.matches('[data-toggle]') && intro && !intro.hidden) {
      // Pressing the timer's Start before beginning also opens the case.
      // (The Timer itself handles starting the clock.)
      intro.hidden = true;
      goTo(0, { focus: false });
    } else if (t.matches('[data-next]')) {
      t.closest('.step-actions').hidden = true;
      goTo(Number(t.dataset.next));
    } else if (t.matches('[data-goto]')) {
      goTo(Number(t.dataset.goto));
    } else if (t.matches('[data-reveal]')) {
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      const open = t.getAttribute('aria-expanded') !== 'true';
      panel.hidden = !open;
      t.setAttribute('aria-expanded', String(open));
      t.textContent = open ? t.dataset.label.replace(/^Show/, 'Hide') : t.dataset.label;
    } else if (t.matches('[data-show-clarifiers]')) {
      const list = document.getElementById('clarifier-list');
      list.hidden = false;
      t.setAttribute('aria-expanded', 'true');
      t.hidden = true;
      list.querySelector('summary').focus();
    } else if (t.matches('[data-show-exhibit]')) {
      const block = root.querySelector(`[data-exhibit="${t.dataset.showExhibit}"]`);
      block.hidden = false;
      t.closest('.step-actions').hidden = true;
      block.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      block.querySelector('.exhibit-title').setAttribute('tabindex', '-1');
      block.querySelector('.exhibit-title').focus({ preventScroll: true });
    }
  });

  initRubric(root.querySelector('.score'), {
    caseId: c.id,
    mode,
    getSeconds: () => timer.seconds,
    onSaved: () => timer.pause(),
  });
  if (mode === 'partner') wirePartner(root, c);
}

async function init() {
  if (!caseId) {
    root.innerHTML = `<h1>No case selected</h1><p><a href="index.html">Browse all cases</a></p>`;
    return;
  }
  let c;
  try {
    const res = await fetch(`data/cases/${encodeURIComponent(caseId)}.json`);
    if (!res.ok) throw new Error(res.statusText);
    c = await res.json();
  } catch {
    root.innerHTML = `<h1>Case not found</h1><p>We couldn't find that case. <a href="index.html">Browse all cases</a></p>`;
    return;
  }
  renderPage(c);
  timer = new Timer({ root: root.querySelector('[data-timer]'), targetMinutes: c.time_minutes });
  wireEvents(c);
}

init();
