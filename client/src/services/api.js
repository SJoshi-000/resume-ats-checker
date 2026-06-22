import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 30000,
});

/**
 * POST /api/analyze
 * Sends resume file + job description for ATS analysis.
 * @param {FormData} formData - Must contain 'resume' (file) and 'jobDescription' (string)
 * @returns {Promise<{ score, matchedKeywords, missingKeywords, suggestions }>}
 */
export async function postAnalyze(formData) {
  const response = await api.post("/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export default api;
