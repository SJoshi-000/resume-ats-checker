import { motion } from "framer-motion";
import GlassCard from "../common/GlassCard";

const itemVariants = {
  hidden: { opacity: 0, x: -16, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { delay: 0.2 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

/**
 * Find the skill category a keyword belongs to.
 */
function findCategory(keyword, skillCategories) {
  if (!skillCategories) return null;
  for (const [catName, catData] of Object.entries(skillCategories)) {
    if (catData.missing.includes(keyword) || catData.matched.includes(keyword)) {
      return catName;
    }
  }
  return null;
}

const categoryColors = {
  Frontend: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  Backend: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  Database: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  DevOps: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Tools: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
};

/**
 * Top 5 most important missing keywords, sourced from breakdown.core.missing
 * with fallback to breakdown.secondary.missing.
 */
export default function CriticalKeywords({ breakdown, skillCategories }) {
  if (!breakdown) return null;

  // Collect top 5 from core, then secondary
  const critical = [];
  if (breakdown.core?.missing) {
    critical.push(...breakdown.core.missing.map((kw) => ({ keyword: kw, tier: "core" })));
  }
  if (critical.length < 5 && breakdown.secondary?.missing) {
    const remaining = 5 - critical.length;
    critical.push(
      ...breakdown.secondary.missing
        .slice(0, remaining)
        .map((kw) => ({ keyword: kw, tier: "secondary" }))
    );
  }

  // Cap at 5
  const top5 = critical.slice(0, 5);
  if (top5.length === 0) return null;

  return (
    <GlassCard elevated>
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
          <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
          Critical Missing Keywords
        </h3>
        <span className="ml-auto text-xs text-gray-600 tabular-nums">
          Top {top5.length}
        </span>
      </div>

      <p className="text-xs text-gray-500 mb-4 leading-relaxed">
        These high-priority keywords are strongly emphasized in the job description. Adding them could significantly improve your ATS score.
      </p>

      {/* Critical keyword items */}
      <div className="space-y-2.5" role="list" aria-label="Critical missing keywords">
        {top5.map(({ keyword, tier }, i) => {
          const category = findCategory(keyword, skillCategories);
          const catStyle = category && categoryColors[category]
            ? categoryColors[category]
            : "text-gray-400 bg-white/[0.04] border-white/10";

          return (
            <motion.div
              key={keyword}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-rose-500/[0.04] border border-rose-500/10 hover:border-rose-500/20 transition-colors duration-200"
              role="listitem"
            >
              {/* Priority number */}
              <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center text-xs font-bold text-rose-400 tabular-nums">
                {i + 1}
              </span>

              {/* Keyword name */}
              <span className="text-sm font-medium text-gray-200 flex-1">
                {keyword}
              </span>

              {/* Category badge */}
              {category && (
                <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border ${catStyle}`}>
                  {category}
                </span>
              )}

              {/* Tier badge */}
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                  tier === "core"
                    ? "text-rose-400 bg-rose-500/10"
                    : "text-amber-400 bg-amber-500/10"
                }`}
              >
                {tier === "core" ? "Required" : "Important"}
              </span>
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
}
