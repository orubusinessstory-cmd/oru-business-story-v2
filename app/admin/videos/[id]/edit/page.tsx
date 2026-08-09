import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateVideo } from "../../../actions";

export const dynamic = "force-dynamic";

export default async function EditVideoPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: video } = await supabase.from("videos").select("*").eq("id", params.id).single();

  if (!video) return notFound();

  const updateWithId = updateVideo.bind(null, video.id);

  return (
    <>
      <h1>Edit Video</h1>
      <p className="admin-sub">Editing "{video.title}"</p>

      <form action={updateWithId} className="admin-form">
        <label>Title</label>
        <input type="text" name="title" defaultValue={video.title} required />

        <label>YouTube Video Link</label>
        <input type="url" name="youtube_url" defaultValue={video.youtube_url} required />
        <p className="admin-hint">
          The thumbnail is pulled automatically from the video — no need to add one yourself.
        </p>

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn-primary">
            Save Changes
          </button>
          <a href="/admin/videos" className="admin-btn-secondary">
            Cancel
          </a>
        </div>
      </form>
    </>
  );
}
