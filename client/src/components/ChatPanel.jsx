import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Send, Cpu, User, Zap } from "lucide-react";

/**
 * ChatPanel — Main chat interface with message history and input.
 */
export function ChatPanel({
  messages,
  isLoading,
  streamingContent,
  onSendMessage,
  messagesEndRef,
  fileName,
}) {
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 150) + "px";
    }
  }, [input]);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-layout">
      {/* Messages */}
      <div className="chat-messages">
        {messages.length === 0 && !isLoading && (
          <div className="empty-state">
            <Zap size={48} className="empty-state-icon" style={{ color: "var(--accent-cyan)" }} />
            <p className="empty-state-text">
              <strong style={{ color: "var(--text-primary)", display: "block", marginBottom: "8px", fontSize: "var(--text-lg)" }}>
                Datasheet loaded successfully
              </strong>
              Ask me anything about <strong>{fileName}</strong> — pinouts,
              specifications, maximum ratings, application circuits, or design validation.
            </p>
            {/* Suggestion chips */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                justifyContent: "center",
                marginTop: "24px",
              }}
            >
              {[
                "What are the absolute maximum ratings?",
                "Show me the pinout",
                "What voltage levels does it support?",
                "How do I connect this to an Arduino?",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setInput(suggestion);
                    // Focus the textarea
                    textareaRef.current?.focus();
                  }}
                  style={{
                    padding: "8px 16px",
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border-default)",
                    borderRadius: "var(--radius-full)",
                    color: "var(--text-secondary)",
                    fontSize: "var(--text-sm)",
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = "var(--border-accent)";
                    e.target.style.color = "var(--accent-cyan)";
                    e.target.style.background = "var(--accent-cyan-soft)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = "var(--border-default)";
                    e.target.style.color = "var(--text-secondary)";
                    e.target.style.background = "var(--bg-surface)";
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className="message">
            <div className={`message-avatar ${msg.role}`}>
              {msg.role === "user" ? (
                <User size={16} />
              ) : (
                <Cpu size={16} />
              )}
            </div>
            <div className="message-body">
              <div className="message-sender">
                {msg.role === "user" ? "You" : "DatasheetIQ"}
              </div>
              <div className="message-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}

        {/* Streaming response */}
        {isLoading && streamingContent && (
          <div className="message">
            <div className="message-avatar assistant">
              <Cpu size={16} />
            </div>
            <div className="message-body">
              <div className="message-sender">DatasheetIQ</div>
              <div className="message-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {streamingContent}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}

        {/* Typing indicator */}
        {isLoading && !streamingContent && (
          <div className="message">
            <div className="message-avatar assistant">
              <Cpu size={16} />
            </div>
            <div className="message-body">
              <div className="message-sender">DatasheetIQ</div>
              <div className="typing-indicator">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-container">
        <div className="chat-input-wrapper">
          <textarea
            ref={textareaRef}
            className="chat-input"
            placeholder="Ask about the datasheet — specs, pinouts, circuit design..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isLoading}
          />
          <button
            className="chat-send-btn"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            title="Send message"
          >
            <Send size={18} />
          </button>
        </div>
        <div className="chat-hint">
          Press <kbd>Enter</kbd> to send · <kbd>Shift + Enter</kbd> for new line
        </div>
      </div>
    </div>
  );
}
