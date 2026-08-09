"use client";

import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ContentEditor({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState(defaultValue ?? "");
  const [tab, setTab] = useState<"edit" | "preview">("edit");

  function sync() {
    if (ref.current) setValue(ref.current.value);
  }

  function insertTable() {
    const template =
      "\n\n| Column 1 | Column 2 | Column 3 |\n| --- | --- | --- |\n| Value | Value | Value |\n| Value | Value | Value |\n\n";
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    el.value = el.value.slice(0, start) + template + el.value.slice(end);
    el.focus();
    sync();
  }

  function insertBold() {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    const selected = el.value.slice(start, end) || "bold text";
    el.value = el.value.slice(0, start) + `**${selected}**` + el.value.slice(end);
    el.focus();
    sync();
  }

  function insertHeading() {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart ?? el.value.length;
    el.value = el.value.slice(0, start) + "\n\n## Heading\n\n" + el.value.slice(start);
    el.focus();
    sync();
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <button
          type="button"
          onClick={() => setTab("edit")}
          className={tab === "edit" ? "admin-btn-primary" : "admin-btn-secondary"}
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => setTab("preview")}
          className={tab === "preview" ? "admin-btn-primary" : "admin-btn-secondary"}
        >
          Preview
        </button>
      </div>

      {tab === "edit" && (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
            <button type="button" onClick={insertTable} className="admin-btn-secondary">
              + Insert Table
            </button>
            <button type="button" onClick={insertHeading} className="admin-btn-secondary">
              + Insert Heading
            </button>
            <button type="button" onClick={insertBold} className="admin-btn-secondary">
              Bold
            </button>
          </div>
          <textarea
            ref={ref}
            name={name}
            defaultValue={defaultValue}
            onChange={sync}
            required
            style={{ minHeight: 240 }}
          />
          <p className="admin-hint">
            Tap where you want it, then tap a button above to insert. Leave a blank line between
            paragraphs. Switch to Preview any time to check how it will look on the site.
          </p>
        </>
      )}

      {tab === "preview" && (
        <div className="admin-content-preview">
          {value.trim() ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
          ) : (
            <p className="admin-hint">Nothing to preview yet — start typing in the Edit tab.</p>
          )}
        </div>
      )}
    </div>
  );
}
