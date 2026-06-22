const ALLOWED_EXTENSIONS = ["pdf", "docx", "txt"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MIN_JD_LENGTH = 50;

/**
 * Validate the uploaded resume file.
 * @param {File} file
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateFile(file) {
  if (!file) {
    return { valid: false, error: "Please upload a resume file." };
  }

  const ext = file.name.split(".").pop().toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return { valid: false, error: `Invalid file type (.${ext}). Accepted: PDF, DOCX, TXT.` };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "File too large. Maximum size is 5 MB." };
  }

  return { valid: true };
}

/**
 * Validate the job description text.
 * @param {string} text
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateJobDescription(text) {
  if (!text || text.trim().length === 0) {
    return { valid: false, error: "Please paste a job description." };
  }

  if (text.trim().length < MIN_JD_LENGTH) {
    return { valid: false, error: `Job description must be at least ${MIN_JD_LENGTH} characters.` };
  }

  return { valid: true };
}
