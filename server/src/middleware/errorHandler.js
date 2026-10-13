/**
 * Global error handler middleware
 */
export function errorHandler(err, req, res, _next) {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  if (res.headersSent) {
    return _next(err);
  }

  // Multer errors
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      error: "File too large",
      message: "Maximum file size is 50MB.",
    });
  }

  if (err.message?.includes("Unsupported file type")) {
    return res.status(415).json({
      error: "Unsupported file type",
      message: err.message,
    });
  }

  // Groq API errors
  if (err.status === 413 || err.message?.includes("Request too large") || err.message?.includes("tokens per minute")) {
    return res.status(413).json({
      error: "Token limit exceeded",
      message:
        "The request exceeded the AI rate limit (Tokens Per Minute). Please wait a moment or ask a more specific question.",
    });
  }

  if (err.status === 429) {
    return res.status(429).json({
      error: "Rate limited",
      message:
        "Too many requests to the AI service. Please wait a moment and try again.",
    });
  }

  if (err.code === "context_length_exceeded") {
    return res.status(422).json({
      error: "Datasheet too large",
      message:
        "The datasheet text is too long for the AI model. Try uploading a specific section instead.",
    });
  }

  // Parse embedded JSON error messages from SDKs
  let friendlyMessage = err.message || "Something went wrong. Please try again.";
  try {
    const jsonMatch = friendlyMessage.match(/\{.*\}$/s);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed?.error?.message) {
        friendlyMessage = parsed.error.message;
      }
    }
  } catch {
    // Keep original message if parsing fails
  }

  // Generic error
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    error: "AI Service Error",
    message: friendlyMessage,
  });
}
