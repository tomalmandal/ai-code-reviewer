import { useState, useCallback } from "react";

export interface ReviewResult {
  score: number;
  summary: string;
  bugs: Array<{
    line: number;
    issue: string;
    severity: "critical" | "warning" | "info";
  }>;
  performance: Array<{ issue: string; suggestion: string }>;
  security: Array<{ issue: string; severity: "critical" | "warning" }>;
  rewrite: string;
}

export function useReview() {
  const [streaming, setStreaming] = useState(false);
  const [rawStream, setRawStream] = useState("");
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cacheHit, setCacheHit] = useState(false);

  const review = useCallback(async (code: string, language: string) => {
    setStreaming(true);
    setRawStream("");
    setResult(null);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/review`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, language }),
        },
      );

      if (!response.ok) {
        const errData = await response.json();
        setError(errData.error || "Request failed");
        setStreaming(false);
        return;
      }

      setCacheHit(response.headers.get("X-Cache") === "HIT");

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop()!;

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();

          if (data === "[DONE]") {
            try {
              // strip markdown code fences if present
              const cleaned = accumulated
                .replace(/^```json\s*/i, "")
                .replace(/^```\s*/i, "")
                .replace(/```\s*$/i, "")
                .trim();
              const parsed = JSON.parse(cleaned);
              setResult(parsed);
            } catch {
              setError("Failed to parse review response");
            }
            setStreaming(false);
            return;
          }

          try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
              setError(parsed.error);
              setStreaming(false);
              return;
            }
            if (parsed.chunk) {
              accumulated += parsed.chunk;
              setRawStream(accumulated);
            }
          } catch {
            // incomplete chunk — skip
          }
        }
      }
    } catch {
      setError("Failed to connect to review service");
      setStreaming(false);
    }
  }, []);

  return { review, streaming, rawStream, result, error, cacheHit };
}
