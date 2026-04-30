import { useState, ReactNode } from "react";

interface Props {
  title: string;
  count: number;
  accentColor: string;
  children: ReactNode;
}

export function IssueCard({ title, count, accentColor, children }: Props) {
  const [open, setOpen] = useState(true);

  return (
    <div style={{ marginBottom: 12, border: "1px solid #374151", borderRadius: 8, overflow: "hidden" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 14px",
          background: "#1f2937",
          border: "none",
          cursor: "pointer",
          color: "#f9fafb",
        }}
      >
        <span style={{ fontWeight: "bold", color: accentColor }}>{title}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ background: accentColor, color: "#000", borderRadius: 12, padding: "1px 8px", fontSize: 12, fontWeight: "bold" }}>
            {count}
          </span>
          <span style={{ color: "#9ca3af", fontSize: 12 }}>{open ? "▲" : "▼"}</span>
        </span>
      </button>
      {open && (
        <div style={{ padding: "10px 14px", background: "#111827" }}>
          {children}
        </div>
      )}
    </div>
  );
}
