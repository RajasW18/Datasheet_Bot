import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { ChatPanel } from "./components/ChatPanel";
import { ParameterPanel } from "./components/ParameterPanel";
import { LandingPage } from "./components/landing/LandingPage";
import { AuthModal } from "./components/auth/AuthModal";
import { useChat } from "./hooks/useChat";
import { useUpload } from "./hooks/useUpload";
import { checkHealth } from "./services/api";
import "./index.css";

function App() {
  // Navigation View: "landing" | "app"
  const [currentView, setCurrentView] = useState("landing");

  // User Authentication
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("datasheetiq_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Session management
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [toast, setToast] = useState(null);

  // Current session data
  const activeSession = sessions.find((s) => s.id === activeSessionId);

  // Hooks
  const {
    messages,
    isLoading,
    streamingContent,
    sendChat,
    clearMessages,
    messagesEndRef,
  } = useChat(activeSessionId);

  const {
    isUploading,
    progress,
    handleFileUpload: rawFileUpload,
    handleTextUpload: rawTextUpload,
  } = useUpload();

  // Check API health on mount
  useEffect(() => {
    const checkConnection = async () => {
      const health = await checkHealth();
      setIsConnected(health.status === "ok");
    };
    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  // Show toast notification
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // Auth Handlers
  const handleLoginSuccess = useCallback(
    (userData) => {
      setUser(userData);
      try {
        localStorage.setItem("datasheetiq_user", JSON.stringify(userData));
      } catch {
        // Ignore storage errors
      }
      showToast(`Welcome, ${userData.name}! Ready to analyze hardware.`, "success");
      setCurrentView("app");
    },
    [showToast]
  );

  const handleLogout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem("datasheetiq_user");
    } catch {
      // Ignore
    }
    showToast("Signed out successfully", "success");
  }, [showToast]);

  // Handle successful upload → create session
  const createSession = useCallback(
    (result) => {
      const newSession = {
        id: result.sessionId,
        fileName: result.fileName,
        tables: result.tables || [],
        textLength: result.textLength,
        numPages: result.numPages,
        isScanned: result.isScanned,
        createdAt: new Date().toISOString(),
      };

      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(result.sessionId);
      clearMessages();
      setCurrentView("app");
      showToast(result.message || "Datasheet loaded successfully!");
    },
    [clearMessages, showToast]
  );

  // File upload handler
  const handleFileUpload = useCallback(
    async (file) => {
      try {
        const result = await rawFileUpload(file);
        createSession(result);
      } catch (err) {
        showToast(err.message, "error");
      }
    },
    [rawFileUpload, createSession, showToast]
  );

  // Text upload handler
  const handleTextUpload = useCallback(
    async (text, title) => {
      try {
        const result = await rawTextUpload(text, title);
        createSession(result);
      } catch (err) {
        showToast(err.message, "error");
      }
    },
    [rawTextUpload, createSession, showToast]
  );

  // New session
  const handleNewSession = useCallback(() => {
    setActiveSessionId(null);
    clearMessages();
  }, [clearMessages]);

  // Export conversation as markdown
  const handleExport = useCallback(() => {
    if (messages.length === 0) return;

    const md = messages
      .map((m) => {
        const sender = m.role === "user" ? "**You**" : "**DatasheetIQ**";
        return `### ${sender}\n\n${m.content}\n\n---\n`;
      })
      .join("\n");

    const header = `# DatasheetIQ Analysis Report\n\n**File:** ${activeSession?.fileName || "N/A"}\n**Date:** ${new Date().toLocaleString()}\n\n---\n\n`;

    const blob = new Blob([header + md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `datasheetiq-report-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);

    showToast("Report exported as Markdown");
  }, [messages, activeSession, showToast]);

  // Clear conversation
  const handleClear = useCallback(() => {
    clearMessages();
    showToast("Conversation cleared");
  }, [clearMessages, showToast]);

  return (
    <>
      {/* ── View: Landing Page ── */}
      {currentView === "landing" ? (
        <LandingPage
          onEnterApp={() => setCurrentView("app")}
          onOpenAuth={() => setIsAuthOpen(true)}
          user={user}
        />
      ) : (
        /* ── View: Main Workbench App ── */
        <div className="app-layout">
          {/* Sidebar */}
          <Sidebar
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelectSession={(id) => {
              setActiveSessionId(id);
              clearMessages();
            }}
            onNewSession={handleNewSession}
          />

          {/* Main Content */}
          <div className="main-content">
            <Header
              fileName={activeSession?.fileName}
              isConnected={isConnected}
              onExport={handleExport}
              onClear={handleClear}
              onSwitchToLanding={() => setCurrentView("landing")}
              user={user}
              onOpenAuth={() => setIsAuthOpen(true)}
              onLogout={handleLogout}
            />

            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
              {/* Main area — Welcome or Chat */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                {!activeSessionId ? (
                  <WelcomeScreen
                    onFileUpload={handleFileUpload}
                    onTextUpload={handleTextUpload}
                    isUploading={isUploading}
                    progress={progress}
                  />
                ) : (
                  <ChatPanel
                    messages={messages}
                    isLoading={isLoading}
                    streamingContent={streamingContent}
                    onSendMessage={sendChat}
                    messagesEndRef={messagesEndRef}
                    fileName={activeSession?.fileName}
                  />
                )}
              </div>

              {/* Parameter Panel — shown when a session is active */}
              {activeSessionId && activeSession?.tables?.length > 0 && (
                <ParameterPanel tables={activeSession.tables} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Auth Modal ── */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* ── Toast Notification ── */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === "error" ? "❌" : "✅"} {toast.message}
        </div>
      )}
    </>
  );
}

export default App;
