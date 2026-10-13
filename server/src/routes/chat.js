import { Router } from "express";
import { sessions } from "./upload.js";
import { chatCompletion } from "../services/groqClient.js";
import {
  buildSystemPrompt,
  buildChatMessages,
} from "../prompts/systemPrompt.js";

const router = Router();

/**
 * POST /api/chat
 * Send a message to the AI about the uploaded datasheet.
 * Supports both regular and streamed responses.
 */
router.post("/", async (req, res, next) => {
  try {
    const { sessionId, message, stream = false } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        error: "No message provided",
        message: "Please provide a question about the datasheet.",
      });
    }

    // Get the session (datasheet context)
    let datasheetText = "";
    let session = null;

    if (sessionId && sessions.has(sessionId)) {
      session = sessions.get(sessionId);
      datasheetText = session.rawText;

      // If tables were extracted, prepend a structured summary
      if (session.tableSummary) {
        datasheetText =
          `## Extracted Structured Data\n${session.tableSummary}\n\n## Full Datasheet Text\n${datasheetText}`;
      }
    }

    // Build the prompt
    const systemPrompt = buildSystemPrompt(datasheetText);
    const conversationHistory = session?.chatHistory || [];
    const messages = buildChatMessages(
      systemPrompt,
      conversationHistory,
      message
    );

    if (stream) {
      // Obtain the stream from Groq BEFORE committing HTTP headers
      const streamResponse = await chatCompletion(messages, { stream: true });

      // Once stream is obtained, set headers for SSE
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      let fullResponse = "";

      try {
        for await (const chunk of streamResponse) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            fullResponse += content;
            res.write(`data: ${JSON.stringify({ content })}\n\n`);
          }
        }
      } catch (streamErr) {
        console.error("Stream reading error:", streamErr);
        res.write(`data: ${JSON.stringify({ error: streamErr.message })}\n\n`);
      }

      // Save to chat history
      if (session) {
        session.chatHistory.push(
          { role: "user", content: message },
          { role: "assistant", content: fullResponse }
        );
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } else {
      // Regular response
      const result = await chatCompletion(messages);

      // Save to chat history
      if (session) {
        session.chatHistory.push(
          { role: "user", content: message },
          { role: "assistant", content: result.content }
        );
      }

      res.json({
        response: result.content,
        model: result.model,
        usage: result.usage,
        sessionId: session?.id || null,
      });
    }
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/chat/history/:sessionId
 * Get the chat history for a session.
 */
router.get("/history/:sessionId", (req, res) => {
  const { sessionId } = req.params;

  if (!sessions.has(sessionId)) {
    return res.status(404).json({
      error: "Session not found",
      message: "The specified session does not exist or has expired.",
    });
  }

  const session = sessions.get(sessionId);
  res.json({
    sessionId,
    fileName: session.fileName,
    history: session.chatHistory,
    createdAt: session.createdAt,
  });
});

export default router;
