import GlassCard from "../common/GlassCard";
import AnimatedScore from "../common/AnimatedScore";

/**
 * ATS score display card with animated ring and interpretation.
 * Uses elevated glassmorphism for visual prominence.
 */
export default function ScoreCard({ score }) {
  const getMessage = (s) => {
    if (s >= 80) return "Your resume is a strong match! Fine-tune the missing keywords to aim for a perfect score.";
    if (s >= 60) return "Good match overall. Adding the missing keywords could significantly boost your chances.";
    if (s >= 40) return "Moderate match. Your resume needs more alignment with the job description keywords.";
    return "Low match. Consider reworking your resume to include the key skills and terms from the job posting.";
  };

  return (
    <GlassCard elevated className="flex flex-col items-center text-center py-10 sm:py-12">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-6">
        ATS Match Score
      </h3>

      <AnimatedScore score={score} />

      <p className="mt-6 max-w-sm text-sm text-gray-400 leading-relaxed px-4">
        {getMessage(score)}
      </p>
    </GlassCard>
  );
}
