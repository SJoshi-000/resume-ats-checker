import { motion } from "framer-motion";
import GlassCard from "../common/GlassCard";

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 0.15 + i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

/**
 * Icons for different strength types.
 */
const strengthIcons = {
  score: (
    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
    </svg>
  ),
  category: (
    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.745 3.745 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
    </svg>
  ),
  core: (
    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  ),
  coverage: (
    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
    </svg>
  ),
};

/**
 * Derive strengths from analysis results data.
 */
function deriveStrengths(score, matchedKeywords, skillCategories, breakdown) {
  const strengths = [];

  // 1. Overall score strength
  if (score >= 80) {
    strengths.push({
      icon: "score",
      title: "Excellent ATS Match",
      description: `Your resume scores ${score}/100 — a strong match for this position.`,
    });
  } else if (score >= 65) {
    strengths.push({
      icon: "score",
      title: "Good ATS Compatibility",
      description: `Your resume scores ${score}/100, showing solid alignment with the role.`,
    });
  }

  // 2. Strong categories (≥75% match)
  if (skillCategories) {
    const strongCats = Object.entries(skillCategories)
      .filter(([, data]) => data.percentage >= 75 && data.percentage !== -1)
      .sort((a, b) => b[1].percentage - a[1].percentage);

    for (const [catName, catData] of strongCats.slice(0, 3)) {
      strengths.push({
        icon: "category",
        title: `Strong ${catName} Skills`,
        description: `${catData.percentage}% match — ${catData.matched.slice(0, 3).join(", ")}${catData.matched.length > 3 ? ` +${catData.matched.length - 3} more` : ""}.`,
      });
    }
  }

  // 3. Core requirements coverage
  if (breakdown?.core) {
    const coreTotal = breakdown.core.matched.length + breakdown.core.missing.length;
    if (coreTotal > 0 && breakdown.core.matched.length > 0) {
      const corePct = Math.round((breakdown.core.matched.length / coreTotal) * 100);
      if (corePct >= 60) {
        strengths.push({
          icon: "core",
          title: "Core Requirements Covered",
          description: `${breakdown.core.matched.length}/${coreTotal} required skills matched (${corePct}%).`,
        });
      }
    }
  }

  // 4. Keyword coverage
  if (matchedKeywords.length >= 8) {
    strengths.push({
      icon: "coverage",
      title: "Broad Keyword Coverage",
      description: `${matchedKeywords.length} keywords matched across the job description.`,
    });
  }

  return strengths.slice(0, 6);
}

/**
 * Resume Strengths — highlights what's already working well.
 */
export default function ResumeStrengths({ score, matchedKeywords, skillCategories, breakdown }) {
  const strengths = deriveStrengths(score, matchedKeywords, skillCategories, breakdown);

  if (strengths.length === 0) return null;

  return (
    <GlassCard>
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V3a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m.729-10.5a3.375 3.375 0 0 0-3.375 3.375v1.5a3.375 3.375 0 1 0 6.75 0V13.5a.75.75 0 0 0-.75-.75H6.633Z" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
          Resume Strengths
        </h3>
        <span className="ml-auto text-xs text-emerald-500/60 tabular-nums">
          {strengths.length} found
        </span>
      </div>

      {/* Strength items */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        role="list"
        aria-label="Resume strengths"
      >
        {strengths.map((item, i) => (
          <motion.div
            key={i}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/10 hover:border-emerald-500/20 transition-colors duration-200"
            role="listitem"
          >
            <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              {strengthIcons[item.icon]}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-200">{item.title}</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}
