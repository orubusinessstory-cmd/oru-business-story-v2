import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteCategory } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const supabase = createClient();
  const { data: categories } = await supabase.from("categories").select("*").order("name");

  return (
    <>
      <div className="admin-toolbar">
        <div>
          <h1 style={{ marginBottom: 4 }}>Categories</h1>
          <p className="admin-sub" style={{ marginBottom: 0 }}>
            Manage the categories businesses are organized under.
          </p>
        </div>
        <a href="/admin/categories/new" className="admin-btn-primary">
          + Add Category
        </a>
      </div>

      {!categories || categories.length === 0 ? (
        <p className="admin-empty">No categories yet.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Icon</th>
              <th>Name</th>
              <th>Slug</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.slug}>
                <td style={{ fontSize: 20 }}>{cat.icon}</td>
                <td>{cat.name}</td>
                <td style={{ color: "#6b7280" }}>{cat.slug}</td>
                <td>
                  <div className="admin-row-actions">
                    <Link href={`/admin/categories/${cat.slug}/edit`} className="admin-btn-secondary">
                      Edit
                    </Link>
                    <form
                      action={async () => {
                        "use server";
                        await deleteCategory(cat.slug);
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
