import { createClient } from "@/lib/supabase/server";
import { createIdea } from "../../actions";
import ContentEditor from "../ContentEditor";

export const dynamic = "force-dynamic";

export default async function NewBusinessPage() {
  const supabase = createClient();
  const { data: categories } = await supabase.from("categories").select("*").order("name");

  return (
    <>
      <h1>Add Business Idea</h1>
      <p className="admin-sub">Publish a new business idea article to the site.</p>

      <form action={createIdea} className="admin-form" encType="multipart/form-data">
        <label>Slug (unique, lowercase, no spaces — e.g. "mobile-car-detailing")</label>
        <input type="text" name="slug" required pattern="[a-z0-9-]+" />

        <label>Title</label>
        <input type="text" name="title" required />

        <label>Category</label>
        <select name="category_slug" required>
          {(categories ?? []).map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>

        <label>Tag (short label shown on the card, e.g. "Low Investment")</label>
        <input type="text" name="tag" required />

        <label>Tag Color</label>
        <select name="tag_color" required>
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="purple">Purple</option>
          <option value="orange">Orange</option>
        </select>

        <label>Short Description (shown on the card)</label>
        <input type="text" name="description" required />

        <label>Profit Potential</label>
        <select name="profit_potential" required>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <label>Investment Range (e.g. "₹ 1 – 3 Lakhs")</label>
        <input type="text" name="investment_range" required />

        <label>Photo (optional — shown instead of the emoji icon if uploaded)</label>
        <input type="file" name="image" accept="image/*" />

        <label>Icon (used only if no photo is uploaded — a single emoji, e.g. 🚗)</label>
        <input type="text" name="icon" required />

        <div className="admin-checkbox-row">
          <input type="checkbox" name="featured" id="featured" />
          <label htmlFor="featured" style={{ marginBottom: 0 }}>
            Show in Featured Business Ideas on the home page
          </label>
        </div>

        <label>Article Content</label>
        <ContentEditor name="content" />

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn-primary">
            Publish
          </button>
          <a href="/admin/businesses" className="admin-btn-secondary">
            Cancel
          </a>
        </div>
      </form>
    </>
  );
}
