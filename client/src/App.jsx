import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ResumeUpload from "./components/upload/ResumeUpload";
import JobDescriptionInput from "./components/input/JobDescriptionInput";
import ResultsDashboard from "./components/results/ResultsDashboard";
import AnalysisHistory from "./components/results/AnalysisHistory";
import LoadingSkeleton from "./components/common/LoadingSkeleton";
import Footer from "./components/common/Footer";
import useAnalyze from "./hooks/useAnalyze";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function App() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const { analyze, loading, results, error, reset, filename } = useAnalyze();

  const canSubmit =
    file && jobDescription.trim().length >= 50 && !loading;

  const handleAnalyze = () => {
    if (!canSubmit) return;
    analyze(file, jobDescription);
  };

  const handleReset = () => {
    setFile(null);
    setJobDescription("");
    reset();
  };

  return (
    <div className="min-h-screen bg-dark-base text-white relative overflow-hidden">
      {/* Skip to content link for keyboard users */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[140px]" />
        <div className="absolute bottom-[-15%] right-[-5%] w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        {/* ── Hero Header ── */}
        <motion.header
          className="text-center mb-8 sm:mb-12 md:mb-16"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] mb-4 sm:mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
            <span className="text-xs font-medium tracking-wide text-gray-400 uppercase">
              ATS Optimization Tool
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
            <span className="block text-white">Resume ATS</span>
            <span className="block mt-1 bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              Checker
            </span>
          </h1>

          <p className="mt-4 sm:mt-5 max-w-xl mx-auto text-sm sm:text-base md:text-lg text-gray-400 leading-relaxed px-2">
            Upload your resume, paste a job description, and instantly discover
            how well your resume matches — with actionable suggestions to
            improve your ATS score.
          </p>
        </motion.header>

        {/* ── Main Content ── */}
        <main id="main-content">
          {/* ── Input Section ── */}
          <AnimatePresence mode="wait">
            {!results && !loading && (
              <motion.div
                key="inputs"
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <motion.div variants={fadeUp} custom={1}>
                    <ResumeUpload file={file} onFileChange={setFile} />
                  </motion.div>
                  <motion.div variants={fadeUp} custom={2}>
                    <JobDescriptionInput
                      value={jobDescription}
                      onChange={setJobDescription}
                    />
                  </motion.div>
                </div>

                {/* Error message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm text-center"
                      role="alert"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Analyze button */}
                <motion.div
                  className="flex justify-center"
                  variants={fadeUp}
                  custom={3}
                >
                  <button
                    id="analyze-btn"
                    onClick={handleAnalyze}
                    disabled={!canSubmit}
                    aria-label="Analyze resume against job description"
                    className="group relative px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl font-semibold text-sm sm:text-base transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed enabled:cursor-pointer"
                  >
                    {/* Gradient background */}
                    <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 opacity-90 group-enabled:group-hover:opacity-100 transition-opacity" />
                    {/* Glow */}
                    <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 opacity-0 group-enabled:group-hover:opacity-40 blur-xl transition-opacity" />
                    <span className="relative z-10 flex items-center gap-2 text-white">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714a2.25 2.25 0 0 0 .659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-1.47 4.42a2.25 2.25 0 0 1-2.137 1.58H8.607a2.25 2.25 0 0 1-2.137-1.58L5 14.5m14 0H5"
                        />
                      </svg>
                      Analyze Resume
                    </span>
                  </button>
                </motion.div>

                {/* ── Analysis History (on input screen) ── */}
                <motion.div variants={fadeUp} custom={4} className="mt-8 sm:mt-10">
                  <AnalysisHistory />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Loading Skeleton ── */}
          <AnimatePresence>
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="py-4 sm:py-8"
              >
                <LoadingSkeleton />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Results ── */}
          <AnimatePresence>
            {results && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ResultsDashboard results={results} filename={filename} />

                <motion.div
                  className="flex justify-center mt-8 sm:mt-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.8 } }}
                >
                  <button
                    id="reset-btn"
                    onClick={handleReset}
                    aria-label="Start a new analysis"
                    className="px-6 sm:px-8 py-3 rounded-xl text-sm font-medium text-gray-400 border border-white/10 hover:border-white/20 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300 cursor-pointer"
                  >
                    ← Analyze Another Resume
                  </button>
                </motion.div>

                {/* ── Analysis History (on results screen) ── */}
                <motion.div
                  className="mt-8 sm:mt-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 1 } }}
                >
                  <AnalysisHistory />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}
