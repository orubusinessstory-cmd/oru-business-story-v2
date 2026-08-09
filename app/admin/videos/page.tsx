import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteVideo } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminVideosPage() {
  const supabase = createClient();
  const { data: videos } = await supabase.from("videos").select("*").order("created_at", { ascending: false });

  return (
    <>
      <div className="admin-toolbar">
        <div>
          <h1 style={{ marginBottom: 4 }}>Videos</h1>
          <p className="admin-sub" style={{ marginBottom: 0 }}>
            Manage the videos shown in the Videos tab on the site.
          </p>
        </div>
        <a href="/admin/videos/new" className="admin-btn-primary">
          + Add Video
        </a>
      </div>

      {!videos || videos.length === 0 ? (
        <p className="admin-empty">No videos yet.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Thumbnail</th>
              <th>Title</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video) => (
              <tr key={video.id}>
                <td>
                  {video.thumbnail_url ? (
                    <img
                      src={video.thumbnail_url}
                      alt=""
                      style={{ width: 80, height: 45, objectFit: "cover", borderRadius: 6, display: "block" }}
                    />
                  ) : (
                    "—"
                  )}
                </td>
                <td>{video.title}</td>
                <td>
                  <div className="admin-row-actions">
                    <Link href={`/admin/videos/${video.id}/edit`} className="admin-btn-secondary">
                      Edit
                    </Link>
                    <form
                      action={async () => {
                        "use server";
                        await deleteVideo(video.id);
                      }}
                    >
                      <button type="submit" className="admin-btn-danger">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
