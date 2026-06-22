const mammoth = require("mammoth");

/**
 * Extract plain text from a DOCX file.
 * @param {string} filePath — Absolute path to the DOCX file.
 * @returns {Promise<string>} — Extracted text content.
 */
async function parseDocx(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value || "";
}

module.exports = { parseDocx };
