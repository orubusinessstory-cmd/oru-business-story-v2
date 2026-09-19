// SERVER-ONLY. Searches Unsplash for one photo matching an English query and
// returns a hotlinkable URL + the attribution Unsplash's API Guidelines
// require when you display one of their photos (https://unsplash.com/documentation).
//
// Needs UNSPLASH_ACCESS_KEY (server-only env var). Get a free "Demo" key at
// https://unsplash.com/oauth/applications — the free tier (50 requests/hour)
// is more than enough for one request a day.

export type UnsplashPhoto = {
  imageUrl: string;
  photographerName: string;
  photographerProfileUrl: string;
};

const APP_NAME = "oru-business-story";

export async function searchBusinessPhoto(query: string): Promise<UnsplashPhoto | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) return null; // Unsplash key not configured — caller falls back to icon, nothing breaks

  try {
    const searchUrl = new URL("https://api.unsplash.com/search/photos");
    searchUrl.searchParams.set("query", query);
    searchUrl.searchParams.set("per_page", "1");
    searchUrl.searchParams.set("orientation", "landscape");
    searchUrl.searchParams.set("content_filter", "high");

    const res = await fetch(searchUrl.toString(), {
      headers: { Authorization: `Client-ID ${accessKey}` },
    });
    if (!res.ok) return null;

    const data = await res.json();
    const photo = data?.results?.[0];
    if (!photo) return null;

    // Unsplash API Guidelines require triggering this download event whenever
    // a photo obtained via the API is actually used/displayed. Best-effort —
    // never let a failure here block publishing the article.
    if (photo.links?.download_location) {
      fetch(`${photo.links.download_location}&client_id=${accessKey}`).catch(() => {});
    }

    return {
      imageUrl: `${photo.urls.regular}${photo.urls.regular.includes("?") ? "&" : "?"}utm_source=${APP_NAME}&utm_medium=referral`,
      photographerName: photo.user?.name ?? "Unsplash",
      photographerProfileUrl: `${photo.user?.links?.html ?? "https://unsplash.com"}?utm_source=${APP_NAME}&utm_medium=referral`,
    };
  } catch {
    return null; // network hiccup etc. — image is optional, never fail the whole run for this
  }
}
