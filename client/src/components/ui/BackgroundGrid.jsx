/**
 * BackgroundGrid — Aceternity style technical dot/grid matrix background with radial fade mask.
 */
export function BackgroundGrid({
  type = "dots", // "dots" | "grid"
  className = "",
  mask = true,
  opacity = 0.45,
}) {
  return (
    <div
      className={`bg-grid-layer bg-grid-${type} ${mask ? "bg-grid-mask" : ""} ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    />
  );
}
