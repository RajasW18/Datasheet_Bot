import { useState, useCallback, useRef, useEffect } from "react";
import { sendMessage, sendMessageStream } from "../services/api";

/**
 * useChat — Manages chat state, message history, and AI communication.
 */
export function useChat(sessionId) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  const sendChat = useCallback(
    async (userMessage, useStreaming = true) => {
      if (!userMessage.trim() || isLoading) return;

      setError(null);

      // Add user message immediately
      const userMsg = {
        id: Date.now(),
        role: "user",
        content: userMessage,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        if (useStreaming) {
          setStreamingContent("");
          try {
            const fullResponse = await sendMessageStream(
              sessionId,
              userMessage,
              (partial) => {
                setStreamingContent(partial);
              }
            );

            // Replace streaming content with final message
            setStreamingContent("");
            const assistantMsg = {
              id: Date.now() + 1,
              role: "assistant",
              content: fullResponse,
              timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, assistantMsg]);
            return;
          } catch (streamErr) {
            console.warn(
              "Streaming error, falling back to standard completion:",
              streamErr.message
            );
          }
        }

        const result = await sendMessage(sessionId, userMessage);
        setStreamingContent("");
        const assistantMsg = {
          id: Date.now() + 1,
          role: "assistant",
          content: result.response,
          model: result.model,
          usage: result.usage,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        setError(err.message);
        const errorMsg = {
          id: Date.now() + 1,
          role: "assistant",
          content: `⚠️ **Error:** ${err.message}\n\nPlease check that the backend server is running and your Groq API key is configured.`,
          isError: true,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [sessionId, isLoading]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setStreamingContent("");
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    streamingContent,
    error,
    sendChat,
    clearMessages,
    messagesEndRef,
  };
}
