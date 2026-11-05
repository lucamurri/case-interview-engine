/**
 * storage.js — saves practice attempts in the browser (localStorage).
 *
 * Nothing leaves the user's device. The saved data looks like:
 * {
 *   version: 1,
 *   attempts: [
 *     { caseId, mode, date, seconds, scores: { structure, math, judgment, synthesis, communication }, notes }
 *   ],
 *   drills: [
 *     { date, category, length, correct, total, seconds }
 *   ],
 *   fit: [
 *     { date, theme, question, seconds, scores: { relevance, structure, ownership, impact, reflection }, notes }
 *   ],
 *   stories: [
 *     { id, title, situation, task, action, result, lesson, themes: [] }
 *   ]
 * }
 */
const KEY = 'cie.progress.v1';

const empty = () => ({ version: 1, attempts: [], drills: [], fit: [], stories: [] });

/** Read saved progress (returns an empty record if none or if unreadable). */
export function loadProgress() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY));
    if (data && Array.isArray(data.attempts)) {
      return {
        ...data,
        drills: Array.isArray(data.drills) ? data.drills : [],
        fit: Array.isArray(data.fit) ? data.fit : [],
        stories: Array.isArray(data.stories) ? data.stories : [],
      };
    }
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

/** Save one mental-math drill result. */
export function addDrillResult(result) {
  const data = loadProgress();
  data.drills.push({ ...result, date: new Date().toISOString() });
  return saveProgress(data);
}

/** Save one fit-question practice attempt. */
export function addFitAttempt(attempt) {
  const data = loadProgress();
  data.fit.push({ ...attempt, date: new Date().toISOString() });
  return saveProgress(data);
}

/** All saved stories. */
export const loadStories = () => loadProgress().stories;

/** Add a story, or replace the one with the same id. */
export function saveStory(story) {
  const data = loadProgress();
  const i = data.stories.findIndex((s) => s.id === story.id);
  if (i >= 0) data.stories[i] = story;
  else data.stories.push(story);
  return saveProgress(data);
}

export function deleteStory(id) {
  const data = loadProgress();
  data.stories = data.stories.filter((s) => s.id !== id);
  return saveProgress(data);
}

/** Delete all saved progress. */
export function resetProgress() {
  return saveProgress(empty());
}

/**
 * Merge an exported file back in (e.g. when moving to a new device).
 * Entries already present (same date + case/category) are skipped.
 * Returns the number of entries added, or throws if the file isn't valid.
 */
export function importProgress(json) {
  const incoming = JSON.parse(json);
  if (!incoming || !Array.isArray(incoming.attempts)) throw new Error('This file is not a Case Interview Engine export.');
  const data = loadProgress();
  const key = (e) => `${e.date}|${e.caseId ?? e.category}`;
  const seen = new Set([...data.attempts, ...data.drills].map(key));
  let added = 0;
  for (const a of incoming.attempts) {
    if (a && a.caseId && a.date && a.scores && !seen.has(key(a))) {
      data.attempts.push(a);
      added++;
    }
  }
  for (const d of incoming.drills || []) {
    if (d && d.category && d.date && !seen.has(key(d))) {
      data.drills.push(d);
      added++;
    }
  }
  const fitSeen = new Set(data.fit.map((f) => `${f.date}|${f.theme}`));
  for (const f of incoming.fit || []) {
    if (f && f.theme && f.date && f.scores && !fitSeen.has(`${f.date}|${f.theme}`)) {
      data.fit.push(f);
      added++;
    }
  }
  const storyIds = new Set(data.stories.map((s) => s.id));
  for (const st of incoming.stories || []) {
    if (st && st.id && typeof st.title === 'string' && !storyIds.has(st.id)) {
      data.stories.push(st);
      added++;
    }
  }
  if (!saveProgress(data)) throw new Error('Your browser refused to save the data.');
  return added;
}
