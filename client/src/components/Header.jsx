import { FileText, Download, Trash2, Home, LogIn, LogOut, User as UserIcon, Cpu } from "lucide-react";

/**
 * Header — Top bar with file info, status, user auth, and actions.
 */
export function Header({
  fileName,
  isConnected,
  onExport,
  onClear,
  onSwitchToLanding,
  user,
  onOpenAuth,
  onLogout,
}) {
  return (
    <header className="header">
      <div className="header-left">
        <button
          className="header-nav-link"
          onClick={onSwitchToLanding}
          title="Return to Landing Page & Showcase"
        >
          <Home size={14} />
          <span>Showcase</span>
        </button>

        <span className="header-divider" />

        <div className="header-brand-tag" title="DatasheetIQ Hardware Intelligence">
          <Cpu size={15} className="text-cyan" />
          <span className="header-brand-name">DatasheetIQ</span>
          <span className="header-brand-badge">PRO</span>
        </div>

        {fileName ? (
          <div className="header-file-badge">
            <FileText size={14} />
            <span className="truncate-file">{fileName}</span>
          </div>
        ) : (
          <div className="header-file-badge">
            <span style={{ color: "var(--text-tertiary)" }}>Workbench Ready</span>
          </div>
        )}

        <div className="header-status">
          <span className={`status-dot ${isConnected ? "" : "error"}`} />
          <span>{isConnected ? "API Live" : "API Offline"}</span>
        </div>
      </div>

      <div className="header-right">
        {fileName && (
          <>
            <button className="header-btn" onClick={onExport} title="Export conversation">
              <Download size={14} />
              Export
            </button>
            <button className="header-btn" onClick={onClear} title="Clear conversation">
              <Trash2 size={14} />
              Clear
            </button>
          </>
        )}

        {/* User Auth Pill */}
        <div className="header-user-section">
          {user ? (
            <div className="header-user-pill">
              <img src={user.avatar} alt={user.name} className="user-avatar-tiny" />
              <span className="user-name-label">{user.name}</span>
              <button
                className="header-icon-btn"
                onClick={onLogout}
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut size={13} />
              </button>
            </div>
          ) : (
            <button className="header-signin-btn" onClick={onOpenAuth}>
              <LogIn size={14} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
