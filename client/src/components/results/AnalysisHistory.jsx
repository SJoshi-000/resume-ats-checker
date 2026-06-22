import { motion } from "framer-motion";
import GlassCard from "../common/GlassCard";
import { getHistory, clearHistory } from "../../utils/historyStorage";
import { useState } from "react";

/**
 * Format a relative time string from an ISO timestamp.
 */
function timeAgo(isoString) {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diffMs = now - then;

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return new Date(isoString).toLocaleDateString();
}

/**
 * Get score color classes based on score value.
 */
function getScoreColor(score) {
  if (score >= 75) return "text-emerald-400";
  if (score >= 50) return "text-amber-400";
  return "text-rose-400";
}

function getScoreBg(score) {
  if (score >= 75) return "bg-emerald-500/10";
  if (score >= 50) return "bg-amber-500/10";
  return "bg-rose-500/10";
}

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.15 + i * 0.08, duration: 0.4, ease: "easeOut" },
  }),
};

/**
 * Analysis History — displays the last 5 analyses stored in localStorage.
 * Shows resume filename, ATS score, and relative timestamp.
 * Renders an empty state when no history exists.
 */
export default function AnalysisHistory() {
  const [history, setHistory] = useState(() => getHistory());

  const handleClear = () => {
    clearHistory();
    setHistory([]);
  };

  // ── Empty State ──
  if (history.length === 0) {
    return (
      <GlassCard>
        <div className="flex flex-col items-center text-center py-6 sm:py-8">
          {/* Clock icon */}
          <div className="w-14 h-14 rounded-xl bg-white/[0.03] border-2 border-dashed border-white/[0.08] flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-400">
            No analyses yet
          </p>
          <p className="text-xs text-gray-600 mt-1.5 max-w-xs leading-relaxed">
            Upload a resume and paste a job description above to run your first ATS analysis.
          </p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
          <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider" id="history-label">
          Recent Analyses
        </h3>
        <span className="ml-auto text-xs text-gray-600 tabular-nums" aria-label={`${history.length} of 5 slots used`}>
          {history.length} / 5
        </span>
      </div>

      {/* History list */}
      <div className="space-y-2" role="list" aria-labelledby="history-label">
        {history.map((entry, i) => (
          <motion.div
            key={`${entry.timestamp}-${i}`}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors duration-200"
            role="listitem"
            aria-label={`${entry.filename}, score ${entry.score}, ${timeAgo(entry.timestamp)}`}
          >
            {/* Score badge */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${getScoreBg(entry.score)} flex items-center justify-center`}>
              <span className={`text-sm font-bold tabular-nums ${getScoreColor(entry.score)}`}>
                {entry.score}
              </span>
            </div>

            {/* Filename + timestamp */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-300 truncate font-medium">
                {entry.filename}
              </p>
              <p className="text-xs text-gray-600 mt-0.5">
                {timeAgo(entry.timestamp)}
              </p>
            </div>

            {/* Score label */}
            <span className={`text-xs font-medium ${getScoreColor(entry.score)}`}>
              {entry.score >= 75 ? "Excellent" : entry.score >= 50 ? "Good" : "Needs Work"}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Clear button */}
      <div className="mt-4 flex justify-end">
        <button
          id="clear-history-btn"
          onClick={handleClear}
          className="text-xs text-gray-600 hover:text-gray-400 transition-colors duration-200 cursor-pointer"
          aria-label="Clear all analysis history"
        >
          Clear History
        </button>
      </div>
    </GlassCard>
  );
}
