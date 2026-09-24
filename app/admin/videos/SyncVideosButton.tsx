"use client";

import { useFormStatus } from "react-dom";

export default function SyncVideosButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="admin-btn-secondary" disabled={pending}>
      {pending ? "Syncing..." : "↻ Sync from YouTube"}
    </button>
  );
}
