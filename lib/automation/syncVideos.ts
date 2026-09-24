import { createAdminClient } from "@/lib/supabase/admin";
import { fetchLatestVideos } from "./youtube";

function extractVideoId(url: string | null): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export async function syncYouTubeVideos(): Promise<{ added: number; error?: string }> {
  try {
    const latest = await fetchLatestVideos(15);
    const supabase = createAdminClient();

    const { data: existing, error: fetchError } = await supabase.from("videos").select("youtube_url");
    if (fetchError) throw new Error(fetchError.message);

    const existingIds = new Set(
      (existing ?? []).map((v: any) => extractVideoId(v.youtube_url)).filter((id): id is string => !!id)
    );

    const newOnes = latest.filter((v) => !existingIds.has(v.videoId));
    if (newOnes.length === 0) return { added: 0 };

    const { error: insertError } = await supabase.from("videos").insert(
      newOnes.map((v) => ({
        title: v.title,
        youtube_url: v.youtubeUrl,
        thumbnail_url: v.thumbnailUrl,
      }))
    );
    if (insertError) throw new Error(insertError.message);

    return { added: newOnes.length };
  } catch (err: any) {
    return { added: 0, error: err?.message ?? String(err) };
  }
}
