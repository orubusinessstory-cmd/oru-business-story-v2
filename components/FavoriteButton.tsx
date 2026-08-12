"use client";

import { useEffect, useState } from "react";
import { FAVORITES_EVENT, isFavorite, toggleFavorite } from "@/lib/favorites";

export default function FavoriteButton({ slug, className = "bookmark" }: { slug: string; className?: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function sync() {
      const result = await isFavorite(slug);
      if (!cancelled) setSaved(result);
    }
    sync();
    window.addEventListener(FAVORITES_EVENT, sync);
    return () => {
      cancelled = true;
      window.removeEventListener(FAVORITES_EVENT, sync);
    };
  }, [slug]);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const result = await toggleFavorite(slug);
    setSaved(result);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
      aria-label={saved ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={saved}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}
