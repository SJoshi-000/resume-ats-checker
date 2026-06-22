import { motion } from "framer-motion";
import ScoreCard from "./ScoreCard";
import ResumeStrengths from "./ResumeStrengths";
import KeywordList from "./KeywordList";
import CriticalKeywords from "./CriticalKeywords";
import SkillBreakdown from "./SkillBreakdown";
import Suggestions from "./Suggestions";
import NextSteps from "./NextSteps";
import DownloadReport from "./DownloadReport";

const stagger = {
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * Main results container — renders score, strengths, keywords, critical keywords,
 * skill breakdown, suggestions, next steps, and download.
 */
export default function ResultsDashboard({ results, filename }) {
  const {
    score,
    matchedKeywords,
    missingKeywords,
    suggestions,
    skillCategories,
    breakdown,
  } = results;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="space-y-6"
      role="region"
      aria-label="Analysis results"
    >
      {/* Score */}
      <motion.div variants={fadeUp}>
        <ScoreCard score={score} />
      </motion.div>

      {/* Resume Strengths */}
      <motion.div variants={fadeUp}>
        <ResumeStrengths
          score={score}
          matchedKeywords={matchedKeywords}
          skillCategories={skillCategories}
          breakdown={breakdown}
        />
      </motion.div>

      {/* Keywords — side by side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={fadeUp}>
          <KeywordList type="matched" keywords={matchedKeywords} />
        </motion.div>
        <motion.div variants={fadeUp}>
          <KeywordList type="missing" keywords={missingKeywords} />
        </motion.div>
      </div>

      {/* Critical Missing Keywords */}
      <motion.div variants={fadeUp}>
        <CriticalKeywords
          breakdown={breakdown}
          skillCategories={skillCategories}
        />
      </motion.div>

      {/* Skill Category Breakdown */}
      <motion.div variants={fadeUp}>
        <SkillBreakdown skillCategories={skillCategories} />
      </motion.div>

      {/* Suggestions */}
      <motion.div variants={fadeUp}>
        <Suggestions suggestions={suggestions} />
      </motion.div>

      {/* Recommended Next Steps */}
      <motion.div variants={fadeUp}>
        <NextSteps
          score={score}
          missingKeywords={missingKeywords}
          breakdown={breakdown}
          skillCategories={skillCategories}
        />
      </motion.div>

      {/* Download Report */}
      <motion.div variants={fadeUp} className="flex justify-center">
        <DownloadReport results={results} filename={filename} />
      </motion.div>
    </motion.div>
  );
}
