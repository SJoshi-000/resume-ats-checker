import { motion } from "framer-motion";

/**
 * Skeleton block — a single shimmering placeholder element.
 */
function SkeletonBlock({ className = "" }) {
  return (
    <div
      className={`skeleton-shimmer rounded-lg bg-white/[0.04] ${className}`}
      aria-hidden="true"
    />
  );
}

/**
 * Skeleton chip — small pill-shaped placeholder.
 */
function SkeletonChip({ className = "" }) {
  return (
    <div
      className={`skeleton-shimmer rounded-full bg-white/[0.04] h-7 ${className}`}
      aria-hidden="true"
    />
  );
}

const stagger = {
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * Full-page loading skeleton that mimics the results dashboard layout.
 * Replaces the bouncing dots loader for a more polished experience.
 */
export default function LoadingSkeleton() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="space-y-6"
      role="status"
      aria-label="Analyzing your resume, please wait"
    >
      {/* Pulsing status message */}
      <motion.div variants={fadeUp} className="flex justify-center mb-2">
        <motion.p
          className="text-gray-400 text-base font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Analyzing your resume…
        </motion.p>
      </motion.div>

      {/* ── Score Card Skeleton ── */}
      <motion.div variants={fadeUp}>
        <div className="glass-elevated rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center py-10">
          <SkeletonBlock className="w-24 h-3 mb-6" />
          {/* Ring placeholder */}
          <div className="relative w-[180px] h-[180px] rounded-full flex items-center justify-center">
            <div className="absolute inset-0 rounded-full skeleton-shimmer bg-white/[0.03]" />
            <div className="w-[160px] h-[160px] rounded-full bg-dark-base relative z-10 flex items-center justify-center">
              <SkeletonBlock className="w-16 h-10 rounded-md" />
            </div>
          </div>
          <SkeletonBlock className="w-20 h-4 mt-4" />
          <SkeletonBlock className="w-64 h-3 mt-6" />
          <SkeletonBlock className="w-48 h-3 mt-2" />
        </div>
      </motion.div>

      {/* ── Strengths Skeleton ── */}
      <motion.div variants={fadeUp}>
        <div className="glass rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-5">
            <SkeletonBlock className="w-8 h-8 rounded-lg" />
            <SkeletonBlock className="w-36 h-4" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02]">
                <SkeletonBlock className="w-9 h-9 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <SkeletonBlock className="w-28 h-3.5" />
                  <SkeletonBlock className="w-full h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Keyword Lists Skeleton ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((col) => (
          <motion.div key={col} variants={fadeUp}>
            <div className="glass rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-5">
                <SkeletonBlock className="w-8 h-8 rounded-lg" />
                <SkeletonBlock className="w-32 h-4" />
                <div className="ml-auto">
                  <SkeletonBlock className="w-6 h-4" />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {[60, 80, 50, 90, 65, 75, 55, 70].map((w, i) => (
                  <SkeletonChip key={i} style={{ width: `${w}px` }} />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Skill Breakdown Skeleton ── */}
      <motion.div variants={fadeUp}>
        <div className="glass rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            <SkeletonBlock className="w-8 h-8 rounded-lg" />
            <SkeletonBlock className="w-44 h-4" />
          </div>
          <div className="space-y-5">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="flex items-center gap-2 mb-2">
                  <SkeletonBlock className="w-6 h-6 rounded-md" />
                  <SkeletonBlock className="w-20 h-3.5" />
                  <div className="ml-auto">
                    <SkeletonBlock className="w-10 h-3.5" />
                  </div>
                </div>
                <SkeletonBlock className="w-full h-1.5 rounded-full mb-2.5" />
                <div className="flex flex-wrap gap-1.5">
                  {[45, 55, 60, 50].map((w, j) => (
                    <SkeletonChip key={j} className="h-5" style={{ width: `${w}px` }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Suggestions Skeleton ── */}
      <motion.div variants={fadeUp}>
        <div className="glass rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-5">
            <SkeletonBlock className="w-8 h-8 rounded-lg" />
            <SkeletonBlock className="w-28 h-4" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <SkeletonBlock className="w-6 h-6 rounded-md flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <SkeletonBlock className="w-full h-3" />
                  <SkeletonBlock className="w-3/4 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Screen-reader only live region */}
      <div className="sr-only" aria-live="polite">
        Analyzing your resume. Results will appear shortly.
      </div>
    </motion.div>
  );
}
