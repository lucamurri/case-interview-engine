/**
 * labels.js — human-readable names for the tag values used in case files.
 * The keys must match the allowed values in scripts/load-cases.js.
 */
export const LABELS = {
  type: {
    'market-sizing': 'Market sizing',
    profitability: 'Profitability',
    'market-entry': 'Market entry',
    pricing: 'Pricing',
    'm-and-a': 'M&A / investment',
    operations: 'Operations',
  },
  industry: {
    'pharma-healthcare': 'Pharma & healthcare',
    energy: 'Energy',
    'consumer-retail': 'Consumer & retail',
    'tech-ai': 'Tech & AI',
    other: 'Other',
  },
  difficulty: {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
  },
  format: {
    'interviewer-led': 'Interviewer-led',
    'candidate-led': 'Candidate-led',
  },
};

/** Difficulty as a 1–3 level, used for the dot indicator. */
export const DIFFICULTY_LEVEL = { beginner: 1, intermediate: 2, advanced: 3 };

/** Look up a label, falling back to the raw value. */
export const label = (field, value) => LABELS[field]?.[value] ?? value;

/** Escape text before putting it into HTML. */
export function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

/** Small HTML snippet for the difficulty dots + label. */
export function difficultyBadge(difficulty) {
  const level = DIFFICULTY_LEVEL[difficulty] || 0;
  const dots = [1, 2, 3].map((i) => `<span class="dot${i <= level ? ' on' : ''}"></span>`).join('');
  return `<span class="difficulty"><span class="dots" aria-hidden="true">${dots}</span>${escapeHtml(label('difficulty', difficulty))}</span>`;
}

/** Format seconds as m:ss (or h:mm:ss). */
export function formatDuration(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`;
}
