interface Props {
  severity: "critical" | "warning" | "info";
}

const CONFIG = {
  critical: { bg: "#7f1d1d", color: "#fca5a5", label: "CRITICAL" },
  warning:  { bg: "#78350f", color: "#fcd34d", label: "WARNING"  },
  info:     { bg: "#1e3a5f", color: "#93c5fd", label: "INFO"     },
};

export function SeverityBadge({ severity }: Props) {
  const { bg, color, label } = CONFIG[severity];
  return (
    <span style={{
      background: bg,
      color,
      fontSize: 10,
      fontWeight: "bold",
      padding: "2px 6px",
      borderRadius: 4,
      letterSpacing: "0.05em",
    }}>
      {label}
    </span>
  );
}
