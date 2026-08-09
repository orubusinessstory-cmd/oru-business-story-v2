"use client";

import { useState } from "react";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = "https://oru-business-story-v2.vercel.app";
    const title = "Oru Business Story";
    const text = "Check out this app for business ideas!";

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        // user cancelled, do nothing
      }
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button type="button" onClick={handleShare} className="profile-link-row profile-link-btn">
      <span>📤 {copied ? "Link copied!" : "Share this app"}</span>
      <span className="profile-chevron">›</span>
    </button>
  );
}
