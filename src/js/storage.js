/**
 * storage.js — saves practice attempts in the browser (localStorage).
 *
 * Nothing leaves the user's device. The saved data looks like:
 * {
 *   version: 1,
 *   attempts: [
 *     { caseId, date, seconds, scores: { structure, math, judgment, synthesis, communication }, notes }
 *   ]
 * }
 */
const KEY = 'cie.progress.v1';

const empty = () => ({ version: 1, attempts: [] });

/** Read saved progress (returns an empty record if none or if unreadable). */
export function loadProgress() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY));
    if (data && Array.isArray(data.attempts)) return data;
  } catch {
    /* fall through */
  }
  return empty();
}

function saveProgress(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
    return true;
  } catch {
    return false; // storage full or blocked
  }
}

/** Add one attempt. Returns false if the browser refused to save it. */
export function addAttempt(attempt) {
  const data = loadProgress();
  data.attempts.push({ ...attempt, date: new Date().toISOString() });
  return saveProgress(data);
}

/** Average of an attempt's rubric scores, e.g. 3.8. */
export function averageScore(attempt) {
  const values = Object.values(attempt.scores || {}).map(Number).filter(Number.isFinite);
  return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
}

/** Summary for one case: number of attempts and best average score. */
export function caseStats(caseId, data = loadProgress()) {
  const attempts = data.attempts.filter((a) => a.caseId === caseId);
  const best = attempts.reduce((max, a) => Math.max(max, averageScore(a)), 0);
  return { attempts, count: attempts.length, best };
}
