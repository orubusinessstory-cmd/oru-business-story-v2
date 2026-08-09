import { createVideo } from "../../actions";

export default function NewVideoPage() {
  return (
    <>
      <h1>Add Video</h1>
      <p className="admin-sub">Add a YouTube video to show in the Videos tab.</p>

      <form action={createVideo} className="admin-form">
        <label>Title</label>
        <input type="text" name="title" required />

        <label>YouTube Video Link</label>
        <input type="url" name="youtube_url" required placeholder="https://youtube.com/watch?v=..." />

        <label>Thumbnail Image URL (optional)</label>
        <input type="url" name="thumbnail_url" placeholder="https://..." />
        <p className="admin-hint">
          Leave blank to show a plain play button instead of a thumbnail. You can grab a YouTube
          thumbnail link like https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg
        </p>

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn-primary">
            Publish
          </button>
          <a href="/admin/videos" className="admin-btn-secondary">
            Cancel
          </a>
        </div>
      </form>
    </>
  );
}
