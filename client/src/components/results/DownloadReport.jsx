import { useState } from "react";
import { motion } from "framer-motion";
import { generateAtsReport } from "../../utils/pdfReport";

/**
 * Download ATS Report button — generates and downloads a PDF report.
 * @param {object} results — Full analysis results from the API.
 * @param {string} [filename] — Original resume filename.
 */
export default function DownloadReport({ results, filename }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Small delay to show the loading state
      await new Promise((r) => setTimeout(r, 200));
      generateAtsReport(results, filename);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="relative">
      <motion.button
        id="download-report-btn"
        onClick={handleDownload}
        disabled={downloading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group relative inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-wait border border-indigo-500/30 hover:border-indigo-500/50 bg-indigo-500/[0.08] hover:bg-indigo-500/[0.14]"
        aria-label={downloading ? "Generating PDF report, please wait" : "Download ATS analysis report as PDF"}
        aria-busy={downloading}
      >
        {/* Icon */}
        {downloading ? (
          <svg className="w-4 h-4 text-indigo-400 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
        )}

        <span className="text-indigo-300 group-hover:text-indigo-200 transition-colors">
          {downloading ? "Generating..." : "Download ATS Report"}
        </span>
      </motion.button>

      {/* Screen reader live announcement */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {downloading ? "Generating PDF report..." : ""}
      </div>
    </div>
  );
}
