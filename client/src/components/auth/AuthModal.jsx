import { useState } from "react";
import { X, Mail, Lock, User, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { ShimmerButton } from "../ui/ShimmerButton";

/**
 * AuthModal — High-end glassmorphism authentication modal.
 */
export function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [tab, setTab] = useState("signin"); // "signin" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const user = {
        name: name || (email ? email.split("@")[0] : "Hardware Engineer"),
        email: email || "engineer@datasheet-iq.dev",
        role: "Pro Hardware Architect",
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name || email || "engineer")}`,
      };
      onLoginSuccess(user);
      onClose();
    }, 600);
  };

  const handleGuestLogin = () => {
    const guest = {
      name: "Makerspace Guest",
      email: "guest@datasheet-iq.dev",
      role: "Makerspace Explorer",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=MakerspaceGuest",
    };
    onLoginSuccess(guest);
    onClose();
  };

  return (
    <div className="auth-backdrop" onClick={onClose}>
      <div
        className="auth-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Glow orb */}
        <div className="auth-glow-orb" />

        {/* Close Button */}
        <button className="auth-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo-badge">
            <Zap size={22} className="text-cyan" />
          </div>
          <h2 className="auth-title">
            {tab === "signin" ? "Welcome back to DatasheetIQ" : "Create your Engineer Account"}
          </h2>
          <p className="auth-subtitle">
            {tab === "signin"
              ? "Access your saved datasheets, pinouts, and custom pin maps."
              : "Start decoding datasheets and catching maximum rating violations."}
          </p>
        </div>

        {/* Instant Demo Button */}
        <button
          type="button"
          onClick={handleGuestLogin}
          className="auth-guest-btn"
        >
          <span className="guest-btn-content">
            <Zap size={16} className="text-cyan animate-pulse" />
            <span>Continue as <strong>Guest Engineer</strong></span>
          </span>
          <span className="guest-pill">Instant Demo</span>
        </button>

        <div className="auth-divider">
          <span>or continue with email</span>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tab-bar">
          <button
            type="button"
            className={`auth-tab-btn ${tab === "signin" ? "active" : ""}`}
            onClick={() => setTab("signin")}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${tab === "signup" ? "active" : ""}`}
            onClick={() => setTab("signup")}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {tab === "signup" && (
            <div className="auth-input-group">
              <label>Full Name</label>
              <div className="auth-input-wrapper">
                <User size={16} className="auth-input-icon" />
                <input
                  type="text"
                  placeholder="e.g. Linus Torvalds"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="auth-input-group">
            <label>Work or Personal Email</label>
            <div className="auth-input-wrapper">
              <Mail size={16} className="auth-input-icon" />
              <input
                type="email"
                placeholder="engineer@lab.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label>Password</label>
            <div className="auth-input-wrapper">
              <Lock size={16} className="auth-input-icon" />
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {tab === "signin" && (
            <div className="auth-row-between">
              <label className="auth-remember">
                <input type="checkbox" defaultChecked />
                <span>Remember this device</span>
              </label>
              <a href="#forgot" className="auth-link" onClick={(e) => e.preventDefault()}>
                Forgot password?
              </a>
            </div>
          )}

          <ShimmerButton
            type="submit"
            disabled={isLoading}
            className="auth-submit-btn"
          >
            {isLoading ? (
              <span className="flex-center gap-2">
                <span className="spinner-sm" /> Authenticating...
              </span>
            ) : (
              <span className="flex-center gap-2">
                <span>{tab === "signin" ? "Sign In to Workspace" : "Create Free Account"}</span>
                <ArrowRight size={16} />
              </span>
            )}
          </ShimmerButton>
        </form>

        {/* Social logins */}
        <div className="auth-social-row">
          <button
            type="button"
            className="auth-social-btn"
            onClick={handleGuestLogin}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>GitHub</span>
          </button>
          <button
            type="button"
            className="auth-social-btn"
            onClick={handleGuestLogin}
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              />
            </svg>
            <span>Google</span>
          </button>
        </div>

        <div className="auth-footer-note">
          <ShieldCheck size={14} className="text-emerald" />
          <span>Strict privacy • Your uploaded datasheets remain local to your session.</span>
        </div>
      </div>
    </div>
  );
}
