export function slugify(text: string): string {
  const base = text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (base) return base;

  // Titles with no ASCII letters/numbers at all (e.g. a fully Malayalam
  // title) strip down to an empty string above — fall back to a short
  // random slug so the URL is never empty/broken.
  return `idea-${Math.random().toString(36).slice(2, 8)}`;
}