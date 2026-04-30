import ReactDiffViewer, { DiffMethod } from "react-diff-viewer-continued";

interface Props {
  original: string;
  rewritten: string;
}

export function DiffViewer({ original, rewritten }: Props) {
  return (
    <ReactDiffViewer
      oldValue={original}
      newValue={rewritten}
      splitView={true}
      compareMethod={DiffMethod.WORDS}
      useDarkTheme={true}
      styles={{
        contentText: {
          fontSize: 12,
          fontFamily: "monospace",
          wordBreak: "break-all",
        },
      }}
    />
  );
}
