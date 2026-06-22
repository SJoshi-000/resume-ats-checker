const fs = require("fs");
const pdfParse = require("pdf-parse");

/**
 * Extract plain text from a PDF file.
 * @param {string} filePath — Absolute path to the PDF file.
 * @returns {Promise<string>} — Extracted text content.
 */
async function parsePdf(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text || "";
}

module.exports = { parsePdf };
