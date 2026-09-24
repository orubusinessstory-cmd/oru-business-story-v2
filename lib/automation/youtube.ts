// SERVER-ONLY. Talks to the YouTube Data API v3. YOUTUBE_API_KEY must never
// be exposed to the browser — this file must only ever be imported from
// server code (route handlers / server actions).
//
// Free quota: 10,000 units/day. channels.list = 1 unit, playlistItems.list =
// 1 unit — a daily sync costs 2 units total, nowhere close to the limit.

const CHANNEL_HANDLE = "@OruBusinessStory";

export type YouTubeVideo = {
  videoId: string;
  title: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  publishedAt: string;
};

async function getUploadsPlaylistId(apiKey: string): Promise<string> {
  const url = new URL("https://www.googleapis.com/youtube/v3/channels");
  url.searchParams.set("part", "contentDetails");
  url.searchParams.set("forHandle", CHANNEL_HANDLE);
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`YouTube channel lookup failed (${res.status}): ${(await res.text()).slice(0, 300)}`);
  }
  const data = await res.json();
  const playlistId = data?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!playlistId) {
    throw new Error(`Could not resolve the uploads playlist for ${CHANNEL_HANDLE} — check the handle is correct.`);
  }
  return playlistId;
}

export async function fetchLatestVideos(maxResults = 15): Promise<YouTubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("Missing YOUTUBE_API_KEY environment variable.");

  const playlistId = await getUploadsPlaylistId(apiKey);

  const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("playlistId", playlistId);
  url.searchParams.set("maxResults", String(maxResults));
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`YouTube playlistItems failed (${res.status}): ${(await res.text()).slice(0, 300)}`);
  }
  const data = await res.json();

  return (data.items ?? [])
    .filter((item: any) => item.snippet?.resourceId?.videoId)
    .map((item: any) => {
      const videoId = item.snippet.resourceId.videoId;
      return {
        videoId,
        title: item.snippet.title as string,
        youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
        thumbnailUrl:
          item.snippet.thumbnails?.high?.url ??
          item.snippet.thumbnails?.default?.url ??
          `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        publishedAt: item.snippet.publishedAt,
      };
    });
}
