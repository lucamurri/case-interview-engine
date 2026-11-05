/**
 * fit.js — the fit (behavioral) interview practice page.
 *
 * Flow: pick a theme → get a random question → answer out loud against a
 * two-minute timer → self-score on five dimensions. Also holds the story
 * bank (STAR outlines tagged by theme). Everything is saved in the browser.
 */
import { FIT_THEMES, FIT_RUBRIC, FIT_TIPS } from './fit-questions.js';
import { Timer } from './timer.js';
import { addFitAttempt, loadProgress, loadStories, saveStory, deleteStory } from './storage.js';
import { escapeHtml, formatDuration } from './labels.js';

const $ = (sel) => document.querySelector(sel);
const setup = $('[data-setup]');
const play = $('[data-play]');
const SCALE = { 1: 'Struggled', 2: 'Weak', 3: 'Solid', 4: 'Strong', 5: 'Offer-level' };
const themeKeys = Object.keys(FIT_THEMES);

let current = null; // { theme, question }
let timer = null;
const asked = {}; // theme -> questions already shown this visit

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

$('[data-themes]').innerHTML =
  [['any', { name: 'Surprise me', blurb: 'A random question from any theme.' }], ...Object.entries(FIT_THEMES)]
    .map(
      ([key, t], i) => `
    <label class="choice"><input type="radio" name="theme" value="${key}"${i === 0 ? ' checked' : ''}>
      <span><strong>${t.name}</strong><small>${t.blurb}</small></span></label>`,
    )
    .join('');

function showSetupInfo() {
  const theme = setup.elements.theme.value;
  $('[data-listen]').innerHTML = theme === 'any' ? 'Tip: start with one theme at a time, then mix it up closer to your interview.' : `<strong>What interviewers listen for:</strong> ${escapeHtml(FIT_THEMES[theme].listenFor)}`;
  const past = loadProgress().fit.filter((f) => theme === 'any' || f.theme === theme);
  const avg = past.length ? past.reduce((s, f) => s + meanScore(f), 0) / past.length : null;
  $('[data-best]').textContent = past.length ? `You have practiced ${past.length} answer${past.length === 1 ? '' : 's'} here, average ${avg.toFixed(1)} / 5.` : '';
}
const meanScore = (f) => {
  const v = Object.values(f.scores || {}).map(Number).filter(Number.isFinite);
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0;
};
setup.addEventListener('change', showSetupInfo);
showSetupInfo();

setup.addEventListener('submit', (e) => {
  e.preventDefault();
  nextQuestion(setup.elements.theme.value);
});

// ---------------------------------------------------------------------------
// Question + timer + rubric
// ---------------------------------------------------------------------------

function pick(selection) {
  const theme = selection === 'any' ? themeKeys[Math.floor(Math.random() * themeKeys.length)] : selection;
  const all = FIT_THEMES[theme].questions;
  let seen = asked[theme] || (asked[theme] = []);
  if (seen.length >= all.length) seen = asked[theme] = [];
  const fresh = all.filter((q) => !seen.includes(q));
  const question = fresh[Math.floor(Math.random() * fresh.length)];
  seen.push(question);
  return { theme, question };
}

function nextQuestion(selection) {
  timer?.pause();
  current = { ...pick(selection), selection };
  setup.hidden = true;
  play.hidden = false;
  $('[data-theme-name]').textContent = FIT_THEMES[current.theme].name;
  $('[data-question]').textContent = current.question;
  timer = new Timer({ root: $('[data-timer]'), targetMinutes: 2 });
  renderRubric();
  renderStoryMatches();
  play.focus();
}

function renderRubric() {
  const groups = FIT_RUBRIC.map(
    (d) => `
    <fieldset class="score-group">
      <legend><strong>${d.name}</strong> <span class="muted">${d.hint}</span></legend>
      <div class="score-options">
        ${[1, 2, 3, 4, 5].map((n) => `<label class="score-option"><input type="radio" name="${d.key}" value="${n}" required><span><b>${n}</b><small>${SCALE[n]}</small></span></label>`).join('')}
      </div>
    </fieldset>`,
  ).join('');
  const host = $('[data-rubric-host]');
  host.innerHTML = `
    <form class="rubric" novalidate>
      ${groups}
      <div class="field"><label for="fit-notes">Notes for next time <span class="muted">(optional)</span></label><textarea id="fit-notes" name="notes" rows="2" maxlength="1000"></textarea></div>
      <p class="form-error" data-error role="alert" hidden></p>
      <button type="submit" class="button">Save my score</button>
      <div class="save-result" data-result aria-live="polite"></div>
    </form>`;
  const form = host.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const scores = {};
    const missing = FIT_RUBRIC.filter((d) => !form.elements[d.key].value);
    const error = form.querySelector('[data-error]');
    if (missing.length) {
      error.textContent = `Please score: ${missing.map((d) => d.name).join(', ')}.`;
      error.hidden = false;
      form.querySelector(`input[name="${missing[0].key}"]`).focus();
      return;
    }
    error.hidden = true;
    for (const d of FIT_RUBRIC) scores[d.key] = Number(form.elements[d.key].value);
    const attempt = { theme: current.theme, question: current.question, seconds: Math.round(timer.seconds), scores, notes: form.elements.notes.value.trim() };
    const ok = addFitAttempt(attempt);
    form.querySelector('[data-result]').textContent = ok
      ? `Saved. Average ${meanScore(attempt).toFixed(1)} / 5 in ${formatDuration(attempt.seconds)}.`
      : 'Sorry — your browser blocked saving (private browsing?). Your score was not stored.';
    form.reset();
  });
}

$('[data-another]').addEventListener('click', () => nextQuestion(current.selection));
$('[data-change]').addEventListener('click', () => {
  timer?.pause();
  play.hidden = true;
  setup.hidden = false;
  showSetupInfo();
  setup.querySelector('input:checked').focus();
});

function renderStoryMatches() {
  const matches = loadStories().filter((s) => (s.themes || []).includes(current.theme));
  $('[data-story-matches]').innerHTML = matches.length
    ? `<ul>${matches.map((s) => `<li><strong>${escapeHtml(s.title)}</strong></li>`).join('')}</ul>`
    : '<p class="muted">No saved story is tagged with this theme yet. Add one in your story bank below.</p>';
}

// ---------------------------------------------------------------------------
// Story bank
// ---------------------------------------------------------------------------

const storyList = $('[data-story-list]');
const storyForm = $('[data-story-form]');
const storyStatus = $('[data-story-status]');
const FIELDS = [['situation', 'Situation'], ['task', 'Task'], ['action', 'Action'], ['result', 'Result'], ['lesson', 'Lesson']];
let editingId = null;

$('[data-story-themes]').innerHTML = themeKeys.map((k) => `<label><input type="checkbox" name="themes" value="${k}"> ${FIT_THEMES[k].name}</label>`).join('');

function renderStories() {
  const stories = loadStories();
  storyList.innerHTML = stories.length
    ? `<ul class="story-list">${stories
        .map(
          (s) => `<li class="story-card">
        <h3>${escapeHtml(s.title)}</h3>
        <div class="story-tags">${(s.themes || []).filter((t) => FIT_THEMES[t]).map((t) => `<span class="story-tag">${escapeHtml(FIT_THEMES[t].name)}</span>`).join('')}</div>
        <details><summary>View outline</summary><dl>${FIELDS.filter(([k]) => s[k]).map(([k, n]) => `<dt>${n}</dt><dd>${escapeHtml(s[k])}</dd>`).join('')}</dl></details>
        <div class="button-row"><button class="button button-small button-quiet" type="button" data-edit="${escapeHtml(s.id)}">Edit</button><button class="button button-small button-quiet danger" type="button" data-delete="${escapeHtml(s.id)}">Delete</button></div>
      </li>`,
        )
        .join('')}</ul>`
    : '<p class="muted">No stories yet. Start with the accomplishment you are proudest of.</p>';
}

function resetStoryForm() {
  editingId = null;
  storyForm.reset();
  $('[data-story-form-title]').textContent = 'Add a story';
  $('[data-story-cancel]').hidden = true;
  $('[data-story-submit]').textContent = 'Save story';
}

storyList.addEventListener('click', (e) => {
  const edit = e.target.closest('[data-edit]');
  const del = e.target.closest('[data-delete]');
  if (edit) {
    const s = loadStories().find((x) => x.id === edit.dataset.edit);
    if (!s) return;
    editingId = s.id;
    storyForm.elements.title.value = s.title;
    for (const [k] of FIELDS) storyForm.elements[k].value = s[k] || '';
    for (const box of storyForm.querySelectorAll('input[name="themes"]')) box.checked = (s.themes || []).includes(box.value);
    $('[data-story-form-title]').textContent = 'Edit story';
    $('[data-story-cancel]').hidden = false;
    $('[data-story-submit]').textContent = 'Update story';
    storyStatus.textContent = '';
    storyForm.elements.title.focus();
    storyForm.scrollIntoView({ block: 'start' });
  } else if (del) {
    if (!confirm('Delete this story?')) return;
    deleteStory(del.dataset.delete);
    if (editingId === del.dataset.delete) resetStoryForm();
    renderStories();
    storyStatus.textContent = 'Story deleted.';
  }
});

$('[data-story-cancel]').addEventListener('click', resetStoryForm);

storyForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const error = $('[data-story-error]');
  const title = storyForm.elements.title.value.trim();
  if (!title) {
    error.textContent = 'Please give the story a short title.';
    error.hidden = false;
    storyForm.elements.title.focus();
    return;
  }
  error.hidden = true;
  const story = {
    id: editingId || `s${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    title,
    themes: [...storyForm.querySelectorAll('input[name="themes"]:checked')].map((b) => b.value),
  };
  for (const [k] of FIELDS) story[k] = storyForm.elements[k].value.trim();
  const ok = saveStory(story);
  storyStatus.textContent = ok ? (editingId ? 'Story updated.' : 'Story saved.') : 'Sorry — your browser blocked saving (private browsing?). The story was not stored.';
  if (ok) resetStoryForm();
  renderStories();
  if (current) renderStoryMatches();
});

renderStories();

// ---------------------------------------------------------------------------
// How to answer
// ---------------------------------------------------------------------------

$('[data-tips]').innerHTML = FIT_TIPS.map((t) => `<dt>${t.name}</dt><dd>${t.text}</dd>`).join('');
