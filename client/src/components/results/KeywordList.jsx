import { motion } from "framer-motion";
import GlassCard from "../common/GlassCard";

const chipVariants = {
  hidden: { opacity: 0, scale: 0.7, y: 12 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: 0.3 + i * 0.05,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

/**
 * Keyword list with pill-style chips, stagger animation, and accessibility.
 * @param {"matched"|"missing"} type
 * @param {string[]} keywords
 */
export default function KeywordList({ type, keywords }) {
  const isMatched = type === "matched";

  const config = isMatched
    ? {
        title: "Matched Keywords",
        icon: "✔",
        chipBg: "bg-emerald-500/10",
        chipBorder: "border-emerald-500/20",
        chipText: "text-emerald-400",
        chipHover: "hover:bg-emerald-500/[0.15] hover:border-emerald-500/30",
        iconColor: "text-emerald-400",
        headerBg: "bg-emerald-500/10",
        headerIcon: "text-emerald-400",
      }
    : {
        title: "Missing Keywords",
        icon: "✘",
        chipBg: "bg-rose-500/10",
        chipBorder: "border-rose-500/20",
        chipText: "text-rose-400",
        chipHover: "hover:bg-rose-500/[0.15] hover:border-rose-500/30",
        iconColor: "text-rose-400",
        headerBg: "bg-rose-500/10",
        headerIcon: "text-rose-400",
      };

  return (
    <GlassCard>
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className={`w-8 h-8 rounded-lg ${config.headerBg} flex items-center justify-center`}>
          <span className={`text-sm font-bold ${config.headerIcon}`} aria-hidden="true">
            {config.icon}
          </span>
        </div>
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider" id={`${type}-keywords-label`}>
          {config.title}
        </h3>
        <span className="ml-auto text-xs text-gray-600 tabular-nums" aria-label={`${keywords.length} keywords`}>
          {keywords.length}
        </span>
      </div>

      {/* Keyword chips */}
      {keywords.length > 0 ? (
        <div
          className="flex flex-wrap gap-2"
          role="list"
          aria-labelledby={`${type}-keywords-label`}
        >
          {keywords.map((keyword, i) => (
            <motion.span
              key={keyword}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={chipVariants}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                border transition-all duration-200 cursor-default
                ${config.chipBg} ${config.chipBorder} ${config.chipText} ${config.chipHover}
              `}
              role="listitem"
              aria-label={`${keyword}, ${isMatched ? "matched" : "missing"}`}
            >
              <span className={`text-[10px] ${config.iconColor}`} aria-hidden="true">
                {config.icon}
              </span>
              {keyword}
            </motion.span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-600 italic">
          {isMatched ? "No keywords matched." : "All keywords matched!"}
        </p>
      )}
    </GlassCard>
  );
}
