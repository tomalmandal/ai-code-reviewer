import Groq from "groq-sdk";

function getClient() {
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
}

export const SUPPORTED_LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "go",
  "java",
  "rust",
  "cpp",
] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const REVIEW_PROMPT = (code: string, language: string) => `
You are an expert ${language} code reviewer. Analyze the following code and respond in this EXACT JSON format:

{
  "score": <0-100 overall quality score>,
  "summary": "<2 sentence overall assessment>",
  "bugs": [{"line": <line_number>, "issue": "<description>", "severity": "critical|warning|info"}],
  "performance": [{"issue": "<description>", "suggestion": "<how to fix>"}],
  "security": [{"issue": "<description>", "severity": "critical|warning"}],
  "rewrite": "<complete rewritten version of the code with all issues fixed>"
}

Scoring rules:
- Start at 100
- Deduct 20 per critical bug
- Deduct 10 per warning
- Deduct 5 per info issue
- Deduct 10 per security issue
- Deduct 5 per performance issue
- Never go below 0
- Clean, well-written code with no issues must score 90-100

Code to review:
\`\`\`${language}
${code}
\`\`\`

Return ONLY valid JSON. No markdown, no explanation outside the JSON. Do not wrap in code fences.
`;

export async function streamReview(
  code: string,
  language: string,
  onChunk: (chunk: string) => void,
  onDone: (full: string) => void,
): Promise<void> {
  let fullText = "";

  const stream = await getClient().chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: REVIEW_PROMPT(code, language) }],
    stream: true,
    max_tokens: 4096,
    temperature: 0,
  });

  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content || "";
    if (text) {
      fullText += text;
      onChunk(text);
    }
  }

  onDone(fullText);
}
