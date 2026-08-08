import { createCategory } from "../../actions";

export default function NewCategoryPage() {
  return (
    <>
      <h1>Add Category</h1>
      <p className="admin-sub">Create a new category for organizing business ideas.</p>

      <form action={createCategory} className="admin-form">
        <label>Slug (lowercase, no spaces — e.g. "retail")</label>
        <input type="text" name="slug" required pattern="[a-z0-9-]+" />

        <label>Name (e.g. "Retail")</label>
        <input type="text" name="name" required />

        <label>Icon (a single emoji, e.g. 🛍️)</label>
        <input type="text" name="icon" required />

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn-primary">
            Create Category
          </button>
          <a href="/admin/categories" className="admin-btn-secondary">
            Cancel
          </a>
        </div>
      </form>
    </>
  );
}
