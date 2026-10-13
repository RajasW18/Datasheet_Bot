/**
 * ShimmerButton — Magic UI / Aceternity inspired shimmering animated CTA button.
 */
export function ShimmerButton({
  children,
  onClick,
  className = "",
  shimmerColor = "rgba(255, 255, 255, 0.4)",
  shimmerSize = "0.08em",
  shimmerDuration = "3s",
  borderRadius = "12px",
  background = "linear-gradient(135deg, rgba(0, 212, 255, 0.9), rgba(59, 130, 246, 0.9))",
  disabled = false,
  type = "button",
  style = {},
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`shimmer-btn ${className}`}
      style={{
        "--shimmer-color": shimmerColor,
        "--shimmer-size": shimmerSize,
        "--shimmer-duration": shimmerDuration,
        "--radius": borderRadius,
        "--btn-bg": background,
        ...style,
      }}
      {...props}
    >
      {/* Shimmer sweep effect */}
      <span className="shimmer-sweep" />
      {/* Content */}
      <span className="shimmer-text">{children}</span>
    </button>
  );
}
