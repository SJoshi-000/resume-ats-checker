const fs = require("fs");
const path = require("path");
const { parsePdf } = require("../utils/pdfParser");
const { parseDocx } = require("../utils/docxParser");
const { calculateAtsScore } = require("../utils/atsScorer");

/**
 * POST /api/analyze
 * Extracts resume text, runs ATS analysis against the job description,
 * and returns score + keywords + suggestions.
 */
async function analyzeResume(req, res, next) {
  const file = req.file;
  const { jobDescription } = req.body;

  // ── Validate inputs ──
  if (!file) {
    return res.status(400).json({ error: "No resume file uploaded." });
  }

  if (!jobDescription || jobDescription.trim().length < 50) {
    // Clean up the uploaded file before returning error
    cleanup(file.path);
    return res.status(400).json({
      error: "Job description is required and must be at least 50 characters.",
    });
  }

  try {
    // ── Extract text from resume ──
    const ext = path.extname(file.originalname).toLowerCase();
    let resumeText = "";

    switch (ext) {
      case ".pdf":
        resumeText = await parsePdf(file.path);
        break;
      case ".docx":
        resumeText = await parseDocx(file.path);
        break;
      case ".txt":
        resumeText = fs.readFileSync(file.path, "utf-8");
        break;
      default:
        cleanup(file.path);
        return res.status(400).json({ error: `Unsupported file type: ${ext}` });
    }

    if (!resumeText || resumeText.trim().length === 0) {
      cleanup(file.path);
      return res.status(400).json({
        error: "Could not extract text from the resume. The file may be empty or image-based.",
      });
    }

    // ── Run ATS analysis ──
    const results = calculateAtsScore(resumeText, jobDescription);

    // ── Clean up uploaded file ──
    cleanup(file.path);

    // ── Return results ──
    return res.json(results);
  } catch (err) {
    cleanup(file?.path);
    next(err);
  }
}

/**
 * Silently delete a file if it exists.
 */
function cleanup(filePath) {
  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch {
      // ignore cleanup errors
    }
  }
}

module.exports = { analyzeResume };
