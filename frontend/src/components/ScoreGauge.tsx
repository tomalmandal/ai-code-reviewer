interface Props {
  score: number;
}

function getColor(score: number): string {
  if (score >= 80) return "#10b981";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
}

export function ScoreGauge({ score }: Props) {
  const radius = 54;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const progress = ((100 - score) / 100) * circumference;
  const color = getColor(score);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
      <svg height={radius * 2} width={radius * 2} style={{ transform: "rotate(-90deg)" }}>
        <circle stroke="#374151" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={progress}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div>
        <div style={{ fontSize: 52, fontWeight: "bold", color, lineHeight: 1 }}>
          {score}<span style={{ fontSize: 18, color: "#6b7280" }}>/100</span>
        </div>
        <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>
          {score >= 80 ? "Good code quality" : score >= 50 ? "Needs improvement" : "Critical issues found"}
        </div>
      </div>
    </div>
  );
}
