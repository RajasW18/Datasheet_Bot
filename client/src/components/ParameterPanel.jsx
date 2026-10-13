import { Table2, AlertTriangle, Gauge, Pin } from "lucide-react";

/**
 * ParameterPanel — Side panel showing extracted datasheet parameters.
 */
export function ParameterPanel({ tables }) {
  if (!tables || tables.length === 0) {
    return (
      <div className="param-tables-panel">
        <div className="param-tables-header">
          <Table2 size={16} />
          Extracted Parameters
        </div>
        <div className="empty-state" style={{ padding: "32px 16px" }}>
          <Table2
            size={32}
            style={{ opacity: 0.2, marginBottom: "12px", color: "var(--text-tertiary)" }}
          />
          <p style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>
            Parameter tables will appear here once extracted from the datasheet.
          </p>
        </div>
      </div>
    );
  }

  const getIcon = (type) => {
    switch (type) {
      case "absolute_maximum_ratings":
        return <AlertTriangle size={12} />;
      case "pin_configuration":
        return <Pin size={12} />;
      default:
        return <Gauge size={12} />;
    }
  };

  return (
    <div className="param-tables-panel">
      <div className="param-tables-header">
        <Table2 size={16} />
        Extracted Parameters
      </div>

      {tables.map((table, idx) => (
        <div key={idx} className="param-table-section">
          <div
            className={`param-table-title ${table.priority === "critical" ? "critical" : ""}`}
          >
            {getIcon(table.type)}
            {table.title}
          </div>

          {table.data.length > 0 ? (
            table.data.slice(0, 15).map((row, rowIdx) => (
              <div key={rowIdx} className="param-row">
                <span className="param-name">
                  {row.parameter || row.name || `Pin ${row.pin}`}
                </span>
                <span className="param-value">
                  {row.values
                    ? row.values.join(" | ")
                    : row.description || "—"}
                </span>
              </div>
            ))
          ) : (
            <div
              style={{
                padding: "8px",
                fontSize: "var(--text-xs)",
                color: "var(--text-tertiary)",
              }}
            >
              No structured data extracted
            </div>
          )}

          {table.data.length > 15 && (
            <div
              style={{
                padding: "4px 8px",
                fontSize: "var(--text-xs)",
                color: "var(--text-tertiary)",
                fontStyle: "italic",
              }}
            >
              +{table.data.length - 15} more rows
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
