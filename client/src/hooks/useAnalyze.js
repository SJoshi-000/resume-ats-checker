import { useState, useCallback } from "react";
import { postAnalyze } from "../services/api";
import { validateFile, validateJobDescription } from "../utils/validators";
import { saveAnalysis } from "../utils/historyStorage";

/**
 * Custom hook managing ATS analysis state.
 * Returns { analyze, loading, results, error, reset, filename }
 */
export default function useAnalyze() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [filename, setFilename] = useState("");

  const analyze = useCallback(async (file, jobDescription) => {
    // Client-side validation
    const fileCheck = validateFile(file);
    if (!fileCheck.valid) {
      setError(fileCheck.error);
      return;
    }

    const jdCheck = validateJobDescription(jobDescription);
    if (!jdCheck.valid) {
      setError(jdCheck.error);
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);
    setFilename(file.name || "Resume");

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDescription);

      const data = await postAnalyze(formData);
      setResults(data);

      // Save to analysis history
      saveAnalysis({
        filename: file.name || "Unknown",
        score: data.score,
        timestamp: new Date().toISOString(),
        skillCategories: data.skillCategories || null,
      });
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.message ||
        "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResults(null);
    setError(null);
    setLoading(false);
    setFilename("");
  }, []);

  return { analyze, loading, results, error, reset, filename };
}
