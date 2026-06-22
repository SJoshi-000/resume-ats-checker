import GlassCard from "../common/GlassCard";

const MIN_LENGTH = 50;

/**
 * Job description textarea with character count, validation hint, and accessibility.
 */
export default function JobDescriptionInput({ value, onChange }) {
  const charCount = value.length;
  const isValid = charCount >= MIN_LENGTH;

  return (
    <GlassCard className="h-full flex flex-col">
      {/* Section label */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
          <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
        </div>
        <label
          htmlFor="job-description-input"
          className="text-sm font-semibold text-gray-300 uppercase tracking-wider cursor-pointer"
        >
          Job Description
        </label>
      </div>

      {/* Textarea */}
      <div className="relative flex-1 flex flex-col">
        <textarea
          id="job-description-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={"Paste the job description here…\n\nExample:\nWe are looking for a Full Stack Developer with experience in React, Node.js, MongoDB, Docker, and AWS…"}
          aria-label="Job description text"
          aria-describedby="jd-char-hint"
          aria-required="true"
          className="flex-1 w-full min-h-[200px] resize-none rounded-xl bg-white/[0.02] border border-white/[0.06] 
                     focus:border-violet-500/40 focus:bg-white/[0.03] focus:ring-1 focus:ring-violet-500/20
                     outline-none px-4 py-3.5 text-sm text-gray-200 placeholder-gray-600 
                     transition-all duration-300 leading-relaxed"
        />

        {/* Character count */}
        <div className="flex items-center justify-between mt-3 px-1" id="jd-char-hint">
          <p className={`text-xs transition-colors duration-200 ${isValid ? "text-gray-600" : "text-gray-500"}`}>
            {!isValid && charCount > 0 && (
              <span className="text-amber-500/70" role="status">
                {MIN_LENGTH - charCount} more characters needed
              </span>
            )}
            {!isValid && charCount === 0 && (
              <span>Minimum {MIN_LENGTH} characters</span>
            )}
            {isValid && (
              <span className="text-emerald-500/60" role="status">✓ Ready</span>
            )}
          </p>
          <span className={`text-xs tabular-nums ${isValid ? "text-emerald-500/50" : "text-gray-600"}`} aria-label={`${charCount} characters entered`}>
            {charCount}
          </span>
        </div>
      </div>
    </GlassCard>
  );
}
