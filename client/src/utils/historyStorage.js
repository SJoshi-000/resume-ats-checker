const STORAGE_KEY = "ats-analysis-history";
const MAX_ENTRIES = 5;

/**
 * Save an analysis result to localStorage history.
 * Keeps only the last 5 entries (most recent first).
 * @param {{ filename: string, score: number, timestamp: string, skillCategories?: object }} entry
 */
export function saveAnalysis(entry) {
  try {
    const history = getHistory();
    history.unshift({
      filename: entry.filename || "Unknown",
      score: entry.score,
      timestamp: entry.timestamp || new Date().toISOString(),
      skillCategories: entry.skillCategories || null,
    });

    // Cap at MAX_ENTRIES
    if (history.length > MAX_ENTRIES) {
      history.length = MAX_ENTRIES;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // localStorage may be unavailable (private browsing, full quota, etc.)
  }
}

/**
 * Get the analysis history from localStorage.
 * @returns {Array<{ filename: string, score: number, timestamp: string, skillCategories?: object }>}
 */
export function getHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Clear all analysis history from localStorage.
 */
export function clearHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
