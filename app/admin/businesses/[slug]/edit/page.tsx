import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateIdea } from "../../../actions";

export const dynamic = "force-dynamic";

export default async function EditBusinessPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const [{ data: idea }, { data: categories }] = await Promise.all([
    supabase.from("ideas").select("*").eq("slug", params.slug).single(),
    supabase.from("categories").select("*").order("name"),
  ]);

  if (!idea) return notFound();

  const updateWithSlug = updateIdea.bind(null, idea.slug);

  return (
    <>
      <h1>Edit Business Idea</h1>
      <p className="admin-sub">Editing "{idea.title}"</p>

      <form action={updateWithSlug} className="admin-form" encType="multipart/form-data">
        <label>Slug</label>
        <input type="text" name="slug" defaultValue={idea.slug} required pattern="[a-z0-9-]+" />

        <label>Title</label>
        <input type="text" name="title" defaultValue={idea.title} required />

        <label>Category</label>
        <select name="category_slug" defaultValue={idea.category_slug} required>
          {(categories ?? []).map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>

        <label>Tag</label>
        <input type="text" name="tag" defaultValue={idea.tag} required />

        <label>Tag Color</label>
        <select name="tag_color" defaultValue={idea.tag_color} required>
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="purple">Purple</option>
          <option value="orange">Orange</option>
        </select>

        <label>Short Description</label>
        <input type="text" name="description" defaultValue={idea.description} required />

        <label>Profit Potential</label>
        <select name="profit_potential" defaultValue={idea.profit_potential} required>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <label>Investment Range</label>
        <input type="text" name="investment_range" defaultValue={idea.investment_range} required />

        {idea.image_url && (
          <div>
            <label>Current Photo</label>
            <img
              src={idea.image_url}
              alt=""
              style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 10, display: "block" }}
            />
          </div>
        )}
        <label>{idea.image_url ? "Replace Photo (optional)" : "Photo (optional)"}</label>
        <input type="file" name="image" accept="image/*" />
        <input type="hidden" name="existing_image_url" value={idea.image_url ?? ""} />

        <div className="admin-checkbox-row">
          <input type="checkbox" name="featured" id="featured" defaultChecked={idea.featured} />
          <label htmlFor="featured" style={{ marginBottom: 0 }}>
            Show in Featured Business Ideas on the home page
          </label>
        </div>

        <label>Article Content</label>
        <textarea name="content" defaultValue={idea.content} required style={{ minHeight: 240 }} />
        <p className="admin-hint">
          Leave a blank line between paragraphs. You can use plain markdown if you want tables,
          headings, or bold text (e.g. **bold**, | table | syntax |).
        </p>

        <label>Related YouTube Video (optional — paste the video link)</label>
        <input
          type="url"
          name="related_video_url"
          defaultValue={idea.related_video_url ?? ""}
          placeholder="https://youtube.com/watch?v=..."
        />

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn-primary">
            Save Changes
          </button>
          <a href="/admin/businesses" className="admin-btn-secondary">
            Cancel
          </a>
        </div>
      </form>
    </>
  );
}
