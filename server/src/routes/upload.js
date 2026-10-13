import { Router } from "express";
import { uploadMiddleware } from "../middleware/upload.js";
import {
  extractTextFromPDF,
  cleanExtractedText,
} from "../services/pdfParser.js";
import { extractTables, getQuickSummary } from "../services/tableExtractor.js";

const router = Router();

import fs from "fs";
import path from "path";

const SESSIONS_FILE = path.resolve("./uploads/.sessions.json");

function loadSessions() {
  const map = new Map();
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      const data = JSON.parse(fs.readFileSync(SESSIONS_FILE, "utf-8"));
      for (const item of data) {
        map.set(item.id, item);
      }
    }
  } catch (err) {
    console.warn("Could not load sessions cache:", err.message);
  }
  return map;
}

export const sessions = loadSessions();

export function saveSessions() {
  try {
    const list = Array.from(sessions.values());
    fs.mkdirSync(path.dirname(SESSIONS_FILE), { recursive: true });
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not save sessions cache:", err.message);
  }
}

/**
 * POST /api/upload
 * Upload a PDF datasheet or paste raw text.
 * Returns a session ID and extracted data.
 */
router.post("/", uploadMiddleware.single("datasheet"), async (req, res, next) => {
  try {
    let rawText = "";
    let fileName = "";
    let numPages = 0;
    let isScanned = false;

    if (req.file) {
      // PDF file uploaded
      fileName = req.file.originalname;

      if (req.file.mimetype === "application/pdf") {
        const result = await extractTextFromPDF(req.file.path);
        rawText = result.text;
        numPages = result.numPages;
        isScanned = result.isLikelyScanned;
      } else if (req.file.mimetype === "text/plain") {
        const fs = await import("fs");
        rawText = fs.readFileSync(req.file.path, "utf-8");
      } else {
        // Image file — would need OCR (Phase 3)
        return res.status(422).json({
          error: "OCR not yet implemented",
          message:
            "Image-based datasheets require OCR processing, which will be available in Phase 3. Please upload a text-based PDF instead.",
        });
      }
    } else if (req.body.text) {
      // Raw text pasted
      rawText = req.body.text;
      fileName = "Pasted Text";
    } else {
      return res.status(400).json({
        error: "No input provided",
        message: "Please upload a PDF file or paste datasheet text.",
      });
    }

    // Clean and process the text
    const cleanedText = cleanExtractedText(rawText);

    // Extract structured tables
    const tables = extractTables(cleanedText);
    const tableSummary = getQuickSummary(tables);

    // Create a session
    const sessionId = crypto.randomUUID();
    sessions.set(sessionId, {
      id: sessionId,
      fileName,
      rawText: cleanedText,
      tables,
      tableSummary,
      numPages,
      isScanned,
      chatHistory: [],
      createdAt: new Date().toISOString(),
    });
    saveSessions();

    res.json({
      sessionId,
      fileName,
      numPages,
      isScanned,
      textLength: cleanedText.length,
      textPreview: cleanedText.slice(0, 500) + (cleanedText.length > 500 ? "..." : ""),
      tables,
      message: isScanned
        ? "⚠️ This PDF appears to be scanned/image-based. Text extraction may be incomplete. OCR support coming in Phase 3."
        : `Successfully extracted ${cleanedText.length.toLocaleString()} characters from ${numPages || "N/A"} pages.`,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/upload/text
 * Alternative endpoint for pasting raw datasheet text.
 */
router.post("/text", async (req, res, next) => {
  try {
    const { text, title } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        error: "No text provided",
        message: "Please provide datasheet text in the request body.",
      });
    }

    const cleanedText = cleanExtractedText(text);
    const tables = extractTables(cleanedText);
    const tableSummary = getQuickSummary(tables);

    const sessionId = crypto.randomUUID();
    sessions.set(sessionId, {
      id: sessionId,
      fileName: title || "Pasted Text",
      rawText: cleanedText,
      tables,
      tableSummary,
      numPages: 0,
      isScanned: false,
      chatHistory: [],
      createdAt: new Date().toISOString(),
    });
    saveSessions();

    res.json({
      sessionId,
      fileName: title || "Pasted Text",
      textLength: cleanedText.length,
      textPreview: cleanedText.slice(0, 500) + (cleanedText.length > 500 ? "..." : ""),
      tables,
      message: `Successfully processed ${cleanedText.length.toLocaleString()} characters of pasted text.`,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
