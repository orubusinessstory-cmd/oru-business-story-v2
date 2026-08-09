import { BottomNav, PageHero } from "@/components/Layout";
import { getVideos } from "@/lib/data";

export const revalidate = 0;

export default async function VideosPage() {
  const videos = await getVideos();

  return (
    <>
      <PageHero title="Videos" />
      {videos.length === 0 ? (
        <p className="empty-state">No videos yet — check back soon.</p>
      ) : (
        <div className="video-list">
          {videos.map((video) => (
            <a
              key={video.id}
              href={video.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="video-card"
            >
              <div
                className="video-thumb"
                style={video.thumbnailUrl ? { backgroundImage: `url(${video.thumbnailUrl})` } : undefined}
              >
                <span className="video-play">▶</span>
              </div>
              <p className="video-title">{video.title}</p>
            </a>
          ))}
        </div>
      )}
      <BottomNav active="Videos" />
    </>
  );
}
