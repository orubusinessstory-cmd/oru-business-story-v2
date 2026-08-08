import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateCategory } from "../../../actions";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!category) return notFound();

  const updateWithSlug = updateCategory.bind(null, category.slug);

  return (
    <>
      <h1>Edit Category</h1>
      <p className="admin-sub">Editing "{category.name}"</p>

      <form action={updateWithSlug} className="admin-form">
        <label>Slug</label>
        <input type="text" name="slug" defaultValue={category.slug} required pattern="[a-z0-9-]+" />

        <label>Name</label>
        <input type="text" name="name" defaultValue={category.name} required />

        <label>Icon</label>
        <input type="text" name="icon" defaultValue={category.icon} required />

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn-primary">
            Save Changes
          </button>
          <a href="/admin/categories" className="admin-btn-secondary">
            Cancel
          </a>
        </div>
      </form>
    </>
  );
}
