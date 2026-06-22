import { motion } from "framer-motion";
import GlassCard from "../common/GlassCard";

const stepVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.2 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

const priorityConfig = {
  critical: {
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/15",
    dot: "bg-rose-400",
    line: "from-rose-500/40 via-rose-500/10 to-transparent",
    label: "Critical",
  },
  high: {
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/15",
    dot: "bg-amber-400",
    line: "from-amber-500/40 via-amber-500/10 to-transparent",
    label: "High",
  },
  medium: {
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/15",
    dot: "bg-blue-400",
    line: "from-blue-500/40 via-blue-500/10 to-transparent",
    label: "Medium",
  },
  low: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/15",
    dot: "bg-emerald-400",
    line: "from-emerald-500/40 via-emerald-500/10 to-transparent",
    label: "Refine",
  },
};

/**
 * Generate prioritized next steps from analysis data.
 */
function generateNextSteps(score, missingKeywords, breakdown, skillCategories) {
  const steps = [];

  // 1. Critical: Add core missing skills
  if (breakdown?.core?.missing?.length > 0) {
    const top = breakdown.core.missing.slice(0, 3).join(", ");
    steps.push({
      priority: "critical",
      title: "Add Required Skills",
      description: `Include ${top} in your resume — these are explicitly required in the job description.`,
    });
  }

  // 2. High: Strengthen weak categories
  if (skillCategories) {
    const weakCats = Object.entries(skillCategories)
      .filter(([, data]) => data.percentage >= 0 && data.percentage < 50 && data.missing.length > 0)
      .sort((a, b) => a[1].percentage - b[1].percentage);

    if (weakCats.length > 0) {
      const [catName, catData] = weakCats[0];
      steps.push({
        priority: "high",
        title: `Boost ${catName} Section`,
        description: `Only ${catData.percentage}% match. Add: ${catData.missing.slice(0, 3).join(", ")}.`,
      });
    }
  }

  // 3. Medium: Add secondary skills
  if (breakdown?.secondary?.missing?.length > 0) {
    const count = breakdown.secondary.missing.length;
    const top = breakdown.secondary.missing.slice(0, 3).join(", ");
    steps.push({
      priority: "medium",
      title: "Include Supporting Skills",
      description: `${count} secondary keyword${count > 1 ? "s" : ""} missing. Consider adding: ${top}.`,
    });
  }

  // 4. Score-based recommendations
  if (score < 50) {
    steps.push({
      priority: "high",
      title: "Tailor Your Resume",
      description: "Your resume needs significant alignment. Mirror the exact terminology from the job posting.",
    });
  } else if (score < 75) {
    steps.push({
      priority: "medium",
      title: "Quantify Achievements",
      description: "Add metrics (percentages, dollar amounts, team sizes) to demonstrate measurable impact.",
    });
  }

  // 5. Format recommendation
  if (missingKeywords.length > 5) {
    steps.push({
      priority: "medium",
      title: "Update Skills Section",
      description: "Create a dedicated Skills section listing technologies from the job description.",
    });
  }

  // 6. Refinement
  if (score >= 60) {
    steps.push({
      priority: "low",
      title: "Polish & Format",
      description: "Use a clean, ATS-friendly format. Avoid tables, columns, headers/footers, and images.",
    });
  }

  return steps.slice(0, 5);
}

/**
 * Recommended Next Steps — actionable, prioritized improvement timeline.
 */
export default function NextSteps({ score, missingKeywords, breakdown, skillCategories }) {
  const steps = generateNextSteps(score, missingKeywords, breakdown, skillCategories);

  if (steps.length === 0) return null;

  return (
    <GlassCard>
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/10 to-violet-500/10 flex items-center justify-center">
          <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
          Recommended Next Steps
        </h3>
      </div>

      {/* Timeline of steps */}
      <div className="relative" role="list" aria-label="Recommended next steps">
        {/* Vertical timeline line */}
        <div className="absolute left-[15px] top-3 bottom-3 w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent" />

        <div className="space-y-3">
          {steps.map((step, i) => {
            const config = priorityConfig[step.priority];
            return (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={stepVariants}
                className={`relative flex items-start gap-4 pl-2 pr-4 py-3 rounded-xl ${config.bg} border ${config.border} transition-colors duration-200`}
                role="listitem"
              >
                {/* Timeline dot */}
                <div className="flex-shrink-0 relative z-10 flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full ${config.bg} flex items-center justify-center`}>
                    <span className={`text-xs font-bold tabular-nums ${config.color}`}>
                      {i + 1}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <h4 className="text-sm font-medium text-gray-200">
                      {step.title}
                    </h4>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${config.bg} ${config.color}`}>
                      {config.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
}
