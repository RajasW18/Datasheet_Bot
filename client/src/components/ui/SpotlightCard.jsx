import { useState, useRef } from "react";

/**
 * SpotlightCard — Aceternity / ReactBits inspired card with cursor-tracking spotlight glow.
 */
export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(0, 212, 255, 0.15)",
  borderColor = "rgba(0, 212, 255, 0.4)",
  onClick,
  style = {},
  ...props
}) {
  const cardRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`spotlight-card ${className}`}
      style={{
        "--mouse-x": `${position.x}px`,
        "--mouse-y": `${position.y}px`,
        "--spotlight-color": spotlightColor,
        "--border-glow-color": borderColor,
        ...style,
      }}
      {...props}
    >
      {/* Dynamic radial glow overlay */}
      <div
        className="spotlight-overlay"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      {/* Content wrapper */}
      <div className="spotlight-content">{children}</div>
    </div>
  );
}
