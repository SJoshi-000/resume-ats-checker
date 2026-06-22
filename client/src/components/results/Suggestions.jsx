import { motion } from "framer-motion";
import GlassCard from "../common/GlassCard";

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.4 + i * 0.08, duration: 0.4, ease: "easeOut" },
  }),
};

/**
 * Improvement suggestions list with lightbulb icons and accessibility.
 */
export default function Suggestions({ suggestions }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <GlassCard>
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
          <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider" id="suggestions-label">
          Suggestions
        </h3>
      </div>

      {/* Suggestion items */}
      <ul className="space-y-3" role="list" aria-labelledby="suggestions-label">
        {suggestions.map((suggestion, i) => (
          <motion.li
            key={i}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            className="flex items-start gap-3 group"
          >
            <span className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-md bg-amber-500/10 flex items-center justify-center text-[11px] font-bold text-amber-400/80 tabular-nums" aria-hidden="true">
              {i + 1}
            </span>
            <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-200">
              {suggestion}
            </p>
          </motion.li>
        ))}
      </ul>
    </GlassCard>
  );
}
