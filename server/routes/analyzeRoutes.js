const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const { analyzeResume } = require("../controllers/analyzeController");

const router = express.Router();

/**
 * POST /api/analyze
 * Accepts a resume file (PDF/DOCX/TXT) and a job description string.
 * Returns ATS score, matched/missing keywords, and suggestions.
 */
router.post("/analyze", upload.single("resume"), analyzeResume);

module.exports = router;
