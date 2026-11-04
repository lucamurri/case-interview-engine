/**
 * progress.js — the "My progress" page.
 *
 * Summarizes saved case attempts and drill results, and lets the user
 * export (JSON / CSV), import, or delete their data. Everything happens
 * in the browser; nothing is uploaded.
 */
import { loadProgress, averageScore, importProgress, resetProgress } from './storage.js';
import { RUBRIC } from './rubric.js';
import { DRILL_CATEGORIES } from './drill-generators.js';
import { escapeHtml, formatDuration, label } from './labels.js';

const root = document.querySelector('[data-progress-root]');
const status = document.querySelector('[data-data-status]');
let caseIndex = {}; // id → { title, type, ... }

const fmtDate = (iso) => new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);

function tile(value, caption) {
  return `<div class="stat"><p class="stat-value">${value}</p><p class="stat-caption">${caption}</p></div>`;
}

function render() {
  const data = loadProgress();
  const { attempts, drills } = data;
  const total = Object.keys(caseIndex).length;

  if (!attempts.length && !drills.length) {
    root.innerHTML = `
      <div class="panel empty-panel">
        <h2>Nothing here yet</h2>
        <p>Finish a case and save your score, or complete a round of mental-math drills, and your progress will appear here.</p>
        <p class="button-row"><a class="button" href="index.html">Pick a case</a> <a class="button button-outline" href="drills.html">Try a drill</a></p>
      </div>`;
    return;
  }

  // --- Summary tiles ---
  const done = new Set(attempts.map((a) => a.caseId));
  const seconds = attempts.reduce((s, a) => s + (Number(a.seconds) || 0), 0) + drills.reduce((s, d) => s + (Number(d.seconds) || 0), 0);
  const drillAcc = drills.length ? mean(drills.map((d) => d.correct / d.total)) : null;
  const tiles = `
    <div class="stats">
      ${tile(`${done.size}<span class="muted"> / ${total}</span>`, 'cases completed')}
      ${tile(attempts.length, 'case attempts')}
      ${tile(attempts.length ? mean(attempts.map(averageScore)).toFixed(1) : '–', 'average score (out of 5)')}
      ${tile(formatDuration(seconds), 'total practice time')}
      ${tile(drills.length, 'drill rounds')}
      ${tile(drillAcc === null ? '–' : `${Math.round(drillAcc * 100)}%`, 'drill accuracy')}
    </div>`;

  // --- Average by rubric dimension (bars on a 0–5 scale) ---
  let dimensions = '';
  if (attempts.length) {
    const avgs = RUBRIC.map((d) => ({ ...d, avg: mean(attempts.map((a) => Number(a.scores?.[d.key])).filter(Number.isFinite)) }));
    const weakest = avgs.reduce((min, d) => (d.avg < min.avg ? d : min));
    dimensions = `
      <section class="panel" aria-labelledby="h-dims">
        <h2 id="h-dims">Scores by skill</h2>
        <div class="bar-chart"><ul class="bars">
          ${avgs.map((d) => `<li class="bar-row"><span class="bar-label">${d.name}</span><span class="bar-track"><span class="bar" style="width:${(d.avg / 5) * 100}%"></span></span><span class="bar-value">${d.avg.toFixed(1)}</span></li>`).join('')}
        </ul></div>
        <p class="tip">Focus next on <strong>${weakest.name.toLowerCase()}</strong> — your lowest average. ${weakest.key === 'math' ? '<a href="drills.html">Mental-math drills</a> help.' : `<a href="frameworks.html">The frameworks guide</a> may help.`}</p>
      </section>`;
  }

  // --- Coverage by case type ---
  const byType = {};
  for (const c of Object.values(caseIndex)) {
    byType[c.type] ??= { total: 0, done: 0 };
    byType[c.type].total++;
    if (done.has(c.id)) byType[c.type].done++;
  }
  const coverage = `
    <section class="panel" aria-labelledby="h-cov">
      <h2 id="h-cov">Coverage by case type</h2>
      <ul class="coverage">
        ${Object.entries(byType)
          .map(([t, v]) => `<li><a href="index.html?type=${t}">${escapeHtml(label('type', t))}</a><span>${v.done} / ${v.total}</span></li>`)
          .join('')}
      </ul>
    </section>`;

  // --- Attempts table ---
  const attemptRows = attempts
    .slice()
    .reverse()
    .map((a) => {
      const c = caseIndex[a.caseId];
      const title = c ? `<a href="case.html?id=${encodeURIComponent(a.caseId)}">${escapeHtml(c.title)}</a>` : escapeHtml(a.caseId);
      const scores = RUBRIC.map((d) => Number(a.scores?.[d.key]) || '–').join(' · ');
      return `<tr><td>${fmtDate(a.date)}</td><td class="wrap-cell">${title}</td><td>${a.mode === 'partner' ? 'Partner' : 'Solo'}</td><td>${formatDuration(a.seconds)}</td><td><strong>${averageScore(a).toFixed(1)}</strong></td><td>${scores}</td><td class="wrap-cell">${escapeHtml(a.notes || '')}</td></tr>`;
    })
    .join('');
  const attemptsTable = attempts.length
    ? `
    <section class="panel" aria-labelledby="h-att">
      <h2 id="h-att">Case attempts</h2>
      <div class="table-scroll" tabindex="0" role="region" aria-label="Case attempts"><table>
        <thead><tr><th scope="col">Date</th><th scope="col">Case</th><th scope="col">Mode</th><th scope="col">Time</th><th scope="col">Average</th><th scope="col"><abbr title="Structure · Math · Business judgment · Synthesis · Communication">Scores</abbr></th><th scope="col">Notes</th></tr></thead>
        <tbody>${attemptRows}</tbody>
      </table></div>
    </section>`
    : '';

  // --- Drills table ---
  const drillRows = drills
    .slice()
    .reverse()
    .map((d) => `<tr><td>${fmtDate(d.date)}</td><td>${escapeHtml(DRILL_CATEGORIES[d.category]?.name || d.category)}</td><td>${Number(d.correct)} / ${Number(d.total)}</td><td>${formatDuration(d.seconds)}</td></tr>`)
    .join('');
  const drillsTable = drills.length
    ? `
    <section class="panel" aria-labelledby="h-dr">
      <h2 id="h-dr">Drill rounds</h2>
      <div class="table-scroll" tabindex="0" role="region" aria-label="Drill rounds"><table>
        <thead><tr><th scope="col">Date</th><th scope="col">Drill</th><th scope="col">Correct</th><th scope="col">Time</th></tr></thead>
        <tbody>${drillRows}</tbody>
      </table></div>
    </section>`
    : '';

  root.innerHTML = tiles + dimensions + coverage + attemptsTable + drillsTable;
}

// ---------------------------------------------------------------------------
// Export / import / reset
// ---------------------------------------------------------------------------

function download(filename, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const today = () => new Date().toISOString().slice(0, 10);

/** Quote a value for CSV (wrap in quotes, double any inner quotes). */
const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
const toCsv = (rows) => rows.map((r) => r.map(csvCell).join(',')).join('\r\n');

function exportCsv(kind) {
  const data = loadProgress();
  if (kind === 'attempts') {
    const header = ['date', 'case_id', 'case_title', 'mode', 'seconds', ...RUBRIC.map((d) => d.key), 'average', 'notes'];
    const rows = data.attempts.map((a) => [a.date, a.caseId, caseIndex[a.caseId]?.title || '', a.mode || 'practice', a.seconds, ...RUBRIC.map((d) => a.scores?.[d.key]), averageScore(a).toFixed(2), a.notes || '']);
    download(`case-scores-${today()}.csv`, toCsv([header, ...rows]), 'text/csv');
  } else {
    const header = ['date', 'drill', 'correct', 'total', 'seconds'];
    const rows = data.drills.map((d) => [d.date, DRILL_CATEGORIES[d.category]?.name || d.category, d.correct, d.total, d.seconds]);
    download(`drill-results-${today()}.csv`, toCsv([header, ...rows]), 'text/csv');
  }
  status.textContent = 'Download started.';
}

document.querySelector('[data-export-json]').addEventListener('click', () => {
  download(`case-interview-engine-progress-${today()}.json`, JSON.stringify(loadProgress(), null, 2), 'application/json');
  status.textContent = 'Download started.';
});
document.querySelectorAll('[data-export-csv]').forEach((b) => b.addEventListener('click', () => exportCsv(b.dataset.exportCsv)));

document.querySelector('[data-import]').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const added = importProgress(await file.text());
    status.textContent = `Imported ${added} new ${added === 1 ? 'entry' : 'entries'}.`;
    render();
  } catch (err) {
    status.textContent = `Couldn't import that file: ${err.message}`;
  }
  e.target.value = '';
});

document.querySelector('[data-reset-progress]').addEventListener('click', () => {
  if (!confirm('Delete all saved scores and drill results from this browser? Consider exporting first. This cannot be undone.')) return;
  resetProgress();
  status.textContent = 'All progress deleted.';
  render();
});

async function init() {
  try {
    const list = await (await fetch('data/index.json')).json();
    caseIndex = Object.fromEntries(list.map((c) => [c.id, c]));
  } catch {
    /* the page still works without titles */
  }
  render();
}

init();
