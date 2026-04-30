import Editor from "@monaco-editor/react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  language: string;
}

export function CodeEditor({ value, onChange, language }: Props) {
  return (
    <Editor
      height="400px"
      language={language}
      value={value}
      onChange={(val) => onChange(val ?? "")}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: "on",
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
    />
  );
}
