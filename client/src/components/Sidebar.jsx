import { FileText, Plus, Cpu } from "lucide-react";

/**
 * Sidebar — Session list and navigation.
 */
export function Sidebar({ sessions, activeSessionId, onSelectSession, onNewSession }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Cpu size={22} />
          </div>
          <div className="sidebar-logo-text">
            <h1>DatasheetIQ</h1>
            <span>AI Hardware Assistant</span>
          </div>
        </div>
      </div>

      <div className="sidebar-sessions">
        <div className="sidebar-sessions-title">Sessions</div>
        {sessions.length === 0 ? (
          <div style={{ padding: "12px", color: "var(--text-tertiary)", fontSize: "var(--text-xs)" }}>
            Upload a datasheet to start
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className={`session-item ${session.id === activeSessionId ? "active" : ""}`}
              onClick={() => onSelectSession(session.id)}
            >
              <FileText size={16} className="session-item-icon" />
              <div className="session-item-text">
                <div className="session-item-name">{session.fileName}</div>
                <div className="session-item-date">
                  {new Date(session.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <button className="sidebar-new-btn" onClick={onNewSession}>
        <Plus size={16} />
        New Analysis
      </button>
    </aside>
  );
}
