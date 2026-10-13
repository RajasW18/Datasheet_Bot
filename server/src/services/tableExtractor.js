/**
 * Table Extractor — Heuristic-based extraction of parameter tables
 * from datasheet text. Identifies electrical characteristics,
 * absolute maximum ratings, pin configurations, etc.
 */

/**
 * Extract structured parameter tables from raw datasheet text.
 * Uses pattern matching to find common datasheet table formats.
 *
 * @param {string} text - Raw extracted text from a datasheet
 * @returns {Array} Array of extracted table objects
 */
export function extractTables(text) {
  const tables = [];

  // Extract Absolute Maximum Ratings
  const maxRatings = extractSection(text, [
    /absolute\s+maximum\s+ratings?/i,
    /maximum\s+ratings?/i,
  ]);
  if (maxRatings) {
    tables.push({
      type: "absolute_maximum_ratings",
      title: "Absolute Maximum Ratings",
      priority: "critical",
      data: parseParameterRows(maxRatings),
    });
  }

  // Extract Electrical Characteristics
  const elecChar = extractSection(text, [
    /electrical\s+characteristics?/i,
    /dc\s+characteristics?/i,
    /operating\s+characteristics?/i,
  ]);
  if (elecChar) {
    tables.push({
      type: "electrical_characteristics",
      title: "Electrical Characteristics",
      priority: "high",
      data: parseParameterRows(elecChar),
    });
  }

  // Extract Pin Configuration
  const pinConfig = extractSection(text, [
    /pin\s+(configuration|description|assignment|function)/i,
    /pinout/i,
  ]);
  if (pinConfig) {
    tables.push({
      type: "pin_configuration",
      title: "Pin Configuration",
      priority: "medium",
      data: parsePinRows(pinConfig),
    });
  }

  // Extract Recommended Operating Conditions
  const recOp = extractSection(text, [
    /recommended\s+operating\s+conditions?/i,
    /operating\s+conditions?/i,
  ]);
  if (recOp) {
    tables.push({
      type: "recommended_operating",
      title: "Recommended Operating Conditions",
      priority: "high",
      data: parseParameterRows(recOp),
    });
  }

  return tables;
}

/**
 * Extract a section of text between a header pattern and the next major header.
 */
function extractSection(text, headerPatterns) {
  for (const pattern of headerPatterns) {
    const match = text.match(pattern);
    if (match) {
      const startIdx = match.index + match[0].length;
      // Find the next major section header (all caps line or numbered heading)
      const nextHeader = text
        .slice(startIdx)
        .search(/\n[A-Z][A-Z\s]{5,}\n|\n\d+\.\s+[A-Z]/);
      const endIdx =
        nextHeader !== -1 ? startIdx + nextHeader : startIdx + 2000;
      return text.slice(startIdx, Math.min(endIdx, text.length));
    }
  }
  return null;
}

/**
 * Parse parameter rows from a text block.
 * Handles common formats like: Parameter | Symbol | Min | Typ | Max | Unit
 */
function parseParameterRows(text) {
  const rows = [];
  const lines = text.split("\n").filter((l) => l.trim().length > 0);

  for (const line of lines) {
    // Try to parse tab/space-separated parameter rows
    // Common patterns: Name  Symbol  Min  Typ  Max  Unit
    const parts = line
      .split(/\t+|\s{2,}/)
      .map((p) => p.trim())
      .filter(Boolean);

    if (parts.length >= 3) {
      // Try to identify if this looks like a data row (has numbers)
      const hasNumbers = parts.some((p) => /[\d.]+/.test(p));
      if (hasNumbers) {
        rows.push({
          parameter: parts[0],
          values: parts.slice(1),
          raw: line.trim(),
        });
      }
    }
  }

  return rows;
}

/**
 * Parse pin description rows.
 */
function parsePinRows(text) {
  const rows = [];
  const lines = text.split("\n").filter((l) => l.trim().length > 0);

  for (const line of lines) {
    // Match patterns like: 1  VCC  Power supply
    const pinMatch = line.match(/^\s*(\d+)\s+(\S+)\s+(.*)/);
    if (pinMatch) {
      rows.push({
        pin: pinMatch[1],
        name: pinMatch[2],
        description: pinMatch[3].trim(),
      });
    }
  }

  return rows;
}

/**
 * Get a quick summary of critical parameters for the chat context.
 */
export function getQuickSummary(tables) {
  const summary = [];

  for (const table of tables) {
    summary.push(`### ${table.title}`);
    if (table.data.length > 0) {
      for (const row of table.data.slice(0, 10)) {
        summary.push(`- ${row.raw || `${row.parameter}: ${row.values?.join(" | ")}`}`);
      }
    }
    summary.push("");
  }

  return summary.join("\n");
}

export default { extractTables, getQuickSummary };
