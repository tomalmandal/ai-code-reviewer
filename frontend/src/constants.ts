export const SUPPORTED_LANGUAGES = ["javascript", "typescript", "python", "go", "java", "rust", "cpp"] as const;
export type Language = typeof SUPPORTED_LANGUAGES[number];
