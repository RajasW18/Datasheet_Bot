/**
 * BorderBeam — Magic UI inspired moving beam animation on borders.
 */
export function BorderBeam({
  size = 200,
  duration = 8,
  delay = 0,
  colorFrom = "#00d4ff",
  colorTo = "#8b5cf6",
  className = "",
  style = {},
}) {
  return (
    <div
      className={`border-beam-container ${className}`}
      style={{
        "--beam-size": `${size}px`,
        "--beam-duration": `${duration}s`,
        "--beam-delay": `${delay}s`,
        "--beam-from": colorFrom,
        "--beam-to": colorTo,
        ...style,
      }}
    >
      <div className="border-beam-ray" />
    </div>
  );
}
