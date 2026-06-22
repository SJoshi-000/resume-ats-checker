import { motion } from "framer-motion";
import GlassCard from "../common/GlassCard";

const categoryIcons = {
  Frontend: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
    </svg>
  ),
  Backend: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
    </svg>
  ),
  Database: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
    </svg>
  ),
  DevOps: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
    </svg>
  ),
  Tools: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1 5.1a2.121 2.121 0 01-3-3l5.1-5.1m0 0L15 9.592m-7.58 5.578L12 9.592m0 0l4.95-4.95a2.121 2.121 0 113 3L15 12.592" />
    </svg>
  ),
};

const categoryColors = {
  Frontend: { bar: "bg-indigo-500", text: "text-indigo-400", bg: "bg-indigo-500/10" },
  Backend: { bar: "bg-violet-500", text: "text-violet-400", bg: "bg-violet-500/10" },
  Database: { bar: "bg-cyan-500", text: "text-cyan-400", bg: "bg-cyan-500/10" },
  DevOps: { bar: "bg-amber-500", text: "text-amber-400", bg: "bg-amber-500/10" },
  Tools: { bar: "bg-emerald-500", text: "text-emerald-400", bg: "bg-emerald-500/10" },
};

const barVariants = {
  hidden: { width: "0%" },
  visible: (pct) => ({
    width: `${pct}%`,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 },
  }),
};

const chipVariants = {
  hidden: { opacity: 0, scale: 0.7, y: 6 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { delay: 0.5 + i * 0.03, duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  }),
};

/**
 * Skill Category Breakdown — shows per-category percentage, matched, and missing skills.
 * @param {{ [category: string]: { percentage: number, matched: string[], missing: string[] } }} skillCategories
 */
export default function SkillBreakdown({ skillCategories }) {
  if (!skillCategories) return null;

  // Filter out categories with no keywords (percentage === -1)
  const activeCategories = Object.entries(skillCategories).filter(
    ([, data]) => data.percentage !== -1
  );

  if (activeCategories.length === 0) return null;

  return (
    <GlassCard>
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
          <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider" id="skill-breakdown-label">
          Skill Category Breakdown
        </h3>
      </div>

      {/* Categories */}
      <div className="space-y-5" role="list" aria-labelledby="skill-breakdown-label">
        {activeCategories.map(([catName, catData]) => {
          const colors = categoryColors[catName] || categoryColors.Tools;
          const icon = categoryIcons[catName] || categoryIcons.Tools;
          const pctColor =
            catData.percentage >= 75
              ? "text-emerald-400"
              : catData.percentage >= 50
                ? "text-amber-400"
                : "text-rose-400";
          const barColor =
            catData.percentage >= 75
              ? "bg-emerald-500"
              : catData.percentage >= 50
                ? "bg-amber-500"
                : "bg-rose-500";

          return (
            <div
              key={catName}
              role="listitem"
              aria-label={`${catName}: ${catData.percentage}% match, ${catData.matched.length} matched, ${catData.missing.length} missing`}
            >
              {/* Category row: icon + name + percentage */}
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-6 h-6 rounded-md ${colors.bg} flex items-center justify-center ${colors.text}`} aria-hidden="true">
                  {icon}
                </div>
                <span className="text-sm font-medium text-gray-300">{catName}</span>
                <span className={`ml-auto text-sm font-bold tabular-nums ${pctColor}`}>
                  {catData.percentage}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden mb-2.5" role="progressbar" aria-valuenow={catData.percentage} aria-valuemin={0} aria-valuemax={100} aria-label={`${catName} progress`}>
                <motion.div
                  className={`h-full rounded-full ${barColor}`}
                  variants={barVariants}
                  initial="hidden"
                  animate="visible"
                  custom={catData.percentage}
                />
              </div>

              {/* Matched + Missing chips */}
              <div className="flex flex-wrap gap-1.5">
                {catData.matched.map((kw, i) => (
                  <motion.span
                    key={`m-${kw}`}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={chipVariants}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/[0.15] transition-colors duration-200"
                  >
                    <span className="text-[9px]" aria-hidden="true">✔</span>
                    {kw}
                  </motion.span>
                ))}
                {catData.missing.map((kw, i) => (
                  <motion.span
                    key={`x-${kw}`}
                    custom={i + catData.matched.length}
                    initial="hidden"
                    animate="visible"
                    variants={chipVariants}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/[0.15] transition-colors duration-200"
                  >
                    <span className="text-[9px]" aria-hidden="true">✘</span>
                    {kw}
                  </motion.span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
