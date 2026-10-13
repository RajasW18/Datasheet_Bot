import fs from "fs";
import pdf from "pdf-parse";

/**
 * Extract text content from a PDF file.
 * Handles both text-based and partially-scanned PDFs.
 *
 * @param {string} filePath - Absolute path to the PDF file
 * @returns {Object} Extracted text + metadata
 */
export async function extractTextFromPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);

  try {
    const data = await pdf(dataBuffer);

    return {
      text: data.text,
      numPages: data.numpages,
      info: data.info,
      metadata: data.metadata,
      // If very little text was extracted, the PDF might be image-based
      isLikelyScanned: data.text.trim().length < 100 && data.numpages > 0,
    };
  } catch (error) {
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
}

/**
 * Clean and normalize extracted text.
 * Fixes common OCR artifacts and normalizes whitespace.
 */
export function cleanExtractedText(rawText) {
  return rawText
    // Normalize line endings
    .replace(/\r\n/g, "\n")
    // Collapse excessive whitespace but preserve table alignment
    .replace(/[ \t]{3,}/g, "  ")
    // Remove form feed characters
    .replace(/\f/g, "\n---PAGE BREAK---\n")
    // Trim lines
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    // Collapse more than 3 consecutive newlines
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}

/**
 * Extract text from a buffer (for in-memory PDF processing).
 */
export async function extractTextFromBuffer(buffer) {
  try {
    const data = await pdf(buffer);
    return {
      text: data.text,
      numPages: data.numpages,
      info: data.info,
      isLikelyScanned: data.text.trim().length < 100 && data.numpages > 0,
    };
  } catch (error) {
    throw new Error(`Failed to parse PDF buffer: ${error.message}`);
  }
}

export default { extractTextFromPDF, extractTextFromBuffer, cleanExtractedText };
