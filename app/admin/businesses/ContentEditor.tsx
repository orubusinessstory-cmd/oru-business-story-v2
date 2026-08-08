"use client";

import { useRef } from "react";

export default function ContentEditor({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function insertTable() {
    const template =
      "\n\n| Column 1 | Column 2 | Column 3 |\n| --- | --- | --- |\n| Value | Value | Value |\n| Value | Value | Value |\n\n";
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    el.value = el.value.slice(0, start) + template + el.value.slice(end);
    el.focus();
  }

  function insertBold() {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    const selected = el.value.slice(start, end) || "bold text";
    el.value = el.value.slice(0, start) + `**${selected}**` + el.value.slice(end);
    el.focus();
  }

  function insertHeading() {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart ?? el.value.length;
    el.value = el.value.slice(0, start) + "\n\n## Heading\n\n" + el.value.slice(start);
    el.focus();
  }

  return (
    <div>
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
        required
        style={{ minHeight: 240 }}
      />
      <p className="admin-hint">
        Tap where you want it, then tap a button above to insert. Leave a blank line between
        paragraphs. Tables and headings use the buttons above — no need to type the symbols
        yourself.
      </p>
    </div>
  );
}
