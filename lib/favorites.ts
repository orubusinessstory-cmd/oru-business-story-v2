import { supabase } from "./supabaseClient";

const KEY = "oru-favorites";
export const FAVORITES_EVENT = "oru-favorites-changed";

function getLocalFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function setLocalFavorites(slugs: string[]) {
  window.localStorage.setItem(KEY, JSON.stringify(slugs));
}

function notifyChanged() {
  window.dispatchEvent(new Event(FAVORITES_EVENT));
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function getFavorites(): Promise<string[]> {
  const user = await getCurrentUser();
  if (user) {
    const { data, error } = await supabase.from("favorites").select("idea_slug").eq("user_id", user.id);
    if (error) return [];
    return (data ?? []).map((row) => row.idea_slug as string);
  }
  return getLocalFavorites();
}

export async function isFavorite(slug: string): Promise<boolean> {
  const favs = await getFavorites();
  return favs.includes(slug);
}

export async function toggleFavorite(slug: string): Promise<boolean> {
  const user = await getCurrentUser();

  if (user) {
    const favs = await getFavorites();
    const exists = favs.includes(slug);
    if (exists) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("idea_slug", slug);
    } else {
      await supabase.from("favorites").insert({ user_id: user.id, idea_slug: slug });
    }
    notifyChanged();
    return !exists;
  }

  const current = getLocalFavorites();
  const exists = current.includes(slug);
  const next = exists ? current.filter((s) => s !== slug) : [...current, slug];
  setLocalFavorites(next);
  notifyChanged();
  return !exists;
}

// Called right after a successful sign-in — uploads anything saved locally
// (while signed out) to the account, then clears the local copy so the
// account's cloud list becomes the single source of truth going forward.
export async function mergeLocalFavoritesIntoAccount(userId: string) {
  const local = getLocalFavorites();
  if (local.length === 0) return;
  const rows = local.map((slug) => ({ user_id: userId, idea_slug: slug }));
  await supabase.from("favorites").upsert(rows, { onConflict: "user_id,idea_slug" });
  setLocalFavorites([]);
  notifyChanged();
}
