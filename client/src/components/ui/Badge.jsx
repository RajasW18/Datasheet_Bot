/**
 * Badge — Status pill with animated radar glow and micro-badge aesthetics.
 */
export function Badge({
  children,
  variant = "cyan", // cyan, emerald, amber, purple
  dot = true,
  className = "",
  style = {},
}) {
  return (
    <span className={`badge-pill badge-${variant} ${className}`} style={style}>
      {dot && (
        <span className="badge-dot-wrapper">
          <span className="badge-dot-ping" />
          <span className="badge-dot" />
        </span>
      )}
      <span className="badge-label">{children}</span>
    </span>
  );
}
