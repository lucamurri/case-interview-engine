/**
 * library.js — the case library on the home page.
 *
 * Loads data/index.json, builds the filter dropdowns, and shows matching
 * cases. Filters are mirrored in the URL (e.g. ?type=pricing) so a filtered
 * view can be bookmarked or shared.
 */
import { LABELS, label, escapeHtml, difficultyBadge } from './labels.js';
import { loadProgress, caseStats } from './storage.js';

const form = document.querySelector('[data-filters]');
const list = document.querySelector('[data-case-list]');
const count = document.querySelector('[data-count]');
const empty = document.querySelector('[data-empty]');
const FILTERS = ['type', 'industry', 'difficulty', 'format'];

let cases = [];

/** Fill each dropdown with "All" plus the values defined in labels.js. */
function buildFilters() {
  for (const field of FILTERS) {
    const select = form.elements[field];
    const all = { type: 'All types', industry: 'All industries', difficulty: 'All levels', format: 'All formats' }[field];
    select.innerHTML =
      `<option value="">${all}</option>` +
      Object.entries(LABELS[field])
        .map(([value, text]) => `<option value="${value}">${escapeHtml(text)}</option>`)
        .join('');
  }
}

/** Restore filters from the URL on page load. */
function readUrl() {
  const params = new URLSearchParams(location.search);
  form.elements.q.value = params.get('q') || '';
  for (const field of FILTERS) {
    const v = params.get(field);
    if (v && LABELS[field][v]) form.elements[field].value = v;
  }
}

function writeUrl() {
  const params = new URLSearchParams();
  if (form.elements.q.value.trim()) params.set('q', form.elements.q.value.trim());
  for (const field of FILTERS) if (form.elements[field].value) params.set(field, form.elements[field].value);
  const qs = params.toString();
  history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
}

/** Text a search query is matched against. */
const searchText = (c) =>
  [c.title, c.summary, c.sub_industry, ...FILTERS.map((f) => label(f, c[f]))].join(' ').toLowerCase();

function matches(c) {
  for (const field of FILTERS) {
    const v = form.elements[field].value;
    if (v && c[field] !== v) return false;
  }
  const words = form.elements.q.value.toLowerCase().split(/\s+/).filter(Boolean);
  const text = searchText(c);
  return words.every((w) => text.includes(w));
}

function card(c, progress) {
  const stats = caseStats(c.id, progress);
  const status = stats.count
    ? `<span class="status done">Completed · best ${stats.best.toFixed(1)}/5</span>`
    : `<span class="status">Not started</span>`;
  return `
    <li class="case-card">
      <article>
        <p class="card-kicker">${escapeHtml(label('type', c.type))}</p>
        <h2><a class="card-link" href="case.html?id=${encodeURIComponent(c.id)}">${escapeHtml(c.title)}</a></h2>
        <p class="card-summary">${escapeHtml(c.summary)}</p>
        <ul class="tags" aria-label="Case details">
          <li>${escapeHtml(label('industry', c.industry))}</li>
          <li>${escapeHtml(label('format', c.format))}</li>
          <li>${escapeHtml(c.time_minutes)} min</li>
        </ul>
        <div class="card-foot">${difficultyBadge(c.difficulty)}${status}</div>
      </article>
    </li>`;
}

function render() {
  const progress = loadProgress();
  const shown = cases.filter(matches);
  list.innerHTML = shown.map((c) => card(c, progress)).join('');
  empty.hidden = shown.length > 0;
  count.textContent = shown.length === cases.length ? `${cases.length} cases` : `Showing ${shown.length} of ${cases.length} cases`;
  writeUrl();
}

async function init() {
  buildFilters();
  readUrl();
  try {
    const res = await fetch('data/index.json');
    if (!res.ok) throw new Error(res.statusText);
    cases = await res.json();
  } catch {
    count.textContent = 'Sorry — the case list could not be loaded. Please refresh the page.';
    return;
  }
  // Order: beginner → advanced, then alphabetically.
  const order = { beginner: 0, intermediate: 1, advanced: 2 };
  cases.sort((a, b) => order[a.difficulty] - order[b.difficulty] || a.title.localeCompare(b.title));
  render();
  form.addEventListener('input', render);
  form.addEventListener('submit', (e) => e.preventDefault());
  // "reset" fires before the fields are cleared, so render on the next tick.
  form.addEventListener('reset', () => setTimeout(render));
}

init();
