import { ReviewResult } from "../hooks/useReview";
import { DiffViewer } from "./DiffViewer";
import { ScoreGauge } from "./ScoreGauge";
import { SeverityBadge } from "./SeverityBadge";
import { IssueCard } from "./IssueCard";

interface Props {
  result: ReviewResult | null;
  streaming: boolean;
  rawStream: string;
  error: string | null;
  cacheHit: boolean;
  originalCode: string;
}

export function ReviewPanel({
  result,
  streaming,
  rawStream,
  error,
  cacheHit,
  originalCode,
}: Props) {
  if (error) {
    return (
      <div
        style={{
          padding: "1rem",
          color: "#ef4444",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span>⚠</span> {error}
      </div>
    );
  }

  if (streaming && !result) {
    return (
      <div style={{ padding: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 16,
            color: "#a78bfa",
          }}
        >
          <span style={{ fontSize: 18 }}>⚙</span>
          <span style={{ fontWeight: "bold", fontSize: 15 }}>
            Analyzing your code...
          </span>
        </div>

        {/* Progress dots */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          {["Connecting", "Reading code", "Generating review"].map(
            (label, i) => (
              <div
                key={i}
                style={{
                  padding: "4px 10px",
                  background:
                    rawStream.length > i * 100 ? "#4f46e5" : "#1f2937",
                  borderRadius: 20,
                  fontSize: 11,
                  color: rawStream.length > i * 100 ? "#fff" : "#6b7280",
                  transition: "all 0.3s",
                }}
              >
                {label}
              </div>
            ),
          )}
        </div>

        {rawStream && (
          <pre
            style={{
              fontFamily: "monospace",
              fontSize: 11,
              color: "#4b5563",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              background: "#1f2937",
              padding: 12,
              borderRadius: 6,
              maxHeight: 200,
              overflowY: "auto",
            }}
          >
            {rawStream}
          </pre>
        )}
      </div>
    );
  }

  if (!result) return null;

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      {/* Score + Summary */}
      <div style={{ padding: "1.25rem 1.25rem 0" }}>
        {cacheHit && (
          <div style={{ marginBottom: 12, fontSize: 12, color: "#10b981" }}>
            ⚡ Served from cache
          </div>
        )}
        <ScoreGauge score={result.score} />
        <p style={{ color: "#d1d5db", marginBottom: 20, lineHeight: 1.6 }}>
          {result.summary}
        </p>
      </div>

      {/* Issue Cards */}
      <div style={{ padding: "0 1.25rem" }}>
        {result.bugs.length > 0 && (
          <IssueCard
            title="Bugs"
            count={result.bugs.length}
            accentColor="#ef4444"
          >
            {result.bugs.map((bug, i) => (
              <div
                key={i}
                style={{
                  marginBottom: 10,
                  display: "flex",
                  gap: 8,
                  alignItems: "flex-start",
                }}
              >
                <SeverityBadge severity={bug.severity} />
                <div>
                  <span style={{ color: "#6b7280", fontSize: 12 }}>
                    Line {bug.line} —{" "}
                  </span>
                  <span style={{ color: "#e5e7eb", fontSize: 13 }}>
                    {bug.issue}
                  </span>
                </div>
              </div>
            ))}
          </IssueCard>
        )}

        {result.performance.length > 0 && (
          <IssueCard
            title="Performance"
            count={result.performance.length}
            accentColor="#f59e0b"
          >
            {result.performance.map((p, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ color: "#e5e7eb", fontSize: 13 }}>{p.issue}</div>
                <div style={{ color: "#6b7280", fontSize: 12, marginTop: 3 }}>
                  → {p.suggestion}
                </div>
              </div>
            ))}
          </IssueCard>
        )}

        {result.security.length > 0 && (
          <IssueCard
            title="Security"
            count={result.security.length}
            accentColor="#f87171"
          >
            {result.security.map((s, i) => (
              <div
                key={i}
                style={{
                  marginBottom: 10,
                  display: "flex",
                  gap: 8,
                  alignItems: "flex-start",
                }}
              >
                <SeverityBadge severity={s.severity} />
                <span style={{ color: "#e5e7eb", fontSize: 13 }}>
                  {s.issue}
                </span>
              </div>
            ))}
          </IssueCard>
        )}
      </div>

      {/* Diff Viewer */}
      {result.rewrite && (
        <div style={{ padding: "0.5rem 1.25rem 1.5rem" }}>
          <h3
            style={{
              color: "#a78bfa",
              marginBottom: 12,
              fontSize: 16,
              fontWeight: "bold",
              paddingTop: 8,
            }}
          >
            AI Rewrite
          </h3>
          <div
            style={{
              border: "1px solid #374151",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                background: "#1f2937",
                borderBottom: "1px solid #374151",
              }}
            >
              <div
                style={{
                  padding: "8px 16px",
                  fontSize: 12,
                  fontWeight: "bold",
                  color: "#9ca3af",
                  borderRight: "1px solid #374151",
                }}
              >
                Your Code
              </div>
              <div
                style={{
                  padding: "8px 16px",
                  fontSize: 12,
                  fontWeight: "bold",
                  color: "#9ca3af",
                }}
              >
                Suggested Rewrite
              </div>
            </div>
            <div style={{ overflow: "auto" }}>
              <DiffViewer original={originalCode} rewritten={result.rewrite} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
