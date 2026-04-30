import { useState } from "react";
import { CodeEditor } from "./components/CodeEditor";
import { ReviewPanel } from "./components/ReviewPanel";
import { useReview } from "./hooks/useReview";
import { SUPPORTED_LANGUAGES } from "./constants";

const DEFAULT_CODE = `function fetchUser(id) {
  const query = "SELECT * FROM users WHERE id = " + id;
  db.execute(query);
}`;

export default function App() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [language, setLanguage] = useState<string>("javascript");
  const [submittedCode, setSubmittedCode] = useState("");
  const { review, streaming, rawStream, result, error, cacheHit } = useReview();

  const handleReview = () => {
    setSubmittedCode(code);
    review(code, language);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111827",
        color: "#f9fafb",
        fontFamily: "sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px 24px",
          borderBottom: "1px solid #374151",
          display: "flex",
          gap: 12,
          alignItems: "center",
          position: "sticky",
          top: 0,
          background: "#111827",
          zIndex: 10,
        }}
      >
        <span style={{ fontWeight: "bold", fontSize: 18 }}>
          ⚡ AI Code Reviewer
        </span>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{
            background: "#1f2937",
            color: "#f9fafb",
            border: "1px solid #374151",
            borderRadius: 4,
            padding: "4px 8px",
          }}
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
        <button
          onClick={handleReview}
          disabled={streaming}
          style={{
            marginLeft: "auto",
            background: streaming ? "#374151" : "#6366f1",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "8px 20px",
            cursor: streaming ? "not-allowed" : "pointer",
            fontWeight: "bold",
            fontSize: 14,
          }}
        >
          {streaming ? "Analyzing..." : "Review Code"}
        </button>
      </div>

      {/* Editor Section */}
      <div style={{ padding: "24px 24px 0" }}>
        <div
          style={{
            border: "1px solid #374151",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "8px 14px",
              background: "#1f2937",
              borderBottom: "1px solid #374151",
              fontSize: 12,
              color: "#9ca3af",
            }}
          >
            YOUR CODE
          </div>
          <CodeEditor value={code} onChange={setCode} language={language} />
        </div>
      </div>

      {/* Review Results Section */}
      {(result || streaming || error) && (
        <div style={{ padding: "24px" }}>
          <div
            style={{
              border: "1px solid #374151",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "8px 14px",
                background: "#1f2937",
                borderBottom: "1px solid #374151",
                fontSize: 12,
                color: "#9ca3af",
              }}
            >
              REVIEW RESULTS
            </div>
            <div style={{ padding: "0" }}>
              <ReviewPanel
                result={result}
                streaming={streaming}
                rawStream={rawStream}
                error={error}
                cacheHit={cacheHit}
                originalCode={submittedCode}
              />
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!result && !streaming && !error && (
        <div
          style={{
            padding: "60px 24px",
            textAlign: "center",
            color: "#4b5563",
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 12 }}>👆</div>
          <div style={{ fontSize: 15 }}>
            Paste your code above and click{" "}
            <strong style={{ color: "#6366f1" }}>Review Code</strong>
          </div>
        </div>
      )}
    </div>
  );
}
