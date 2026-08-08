import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteIdea } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminBusinessesPage() {
  const supabase = createClient();
  const { data: ideas } = await supabase
    .from("ideas")
    .select("*, categories(name)")
    .order("created_at", { ascending: false });

  return (
    <>
      <div className="admin-toolbar">
        <div>
          <h1 style={{ marginBottom: 4 }}>Businesses</h1>
          <p className="admin-sub" style={{ marginBottom: 0 }}>
            Manage business idea articles shown on the site.
          </p>
        </div>
        <a href="/admin/businesses/new" className="admin-btn-primary">
          + Add Business
        </a>
      </div>

      {!ideas || ideas.length === 0 ? (
        <p className="admin-empty">No business ideas yet.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Category</th>
              <th>Featured</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {ideas.map((idea: any) => (
              <tr key={idea.slug}>
                <td>
                  {idea.image_url ? (
                    <img src={idea.image_url} alt="" style={{ width: 32, height: 32, objectFit: "cover", borderRadius: 6 }} />
                  ) : (
                    <span style={{ fontSize: 20 }}>{idea.icon}</span>
                  )}
                </td>
                <td>{idea.title}</td>
                <td style={{ color: "#6b7280" }}>{idea.categories?.name ?? idea.category_slug}</td>
                <td>{idea.featured ? "✅" : ""}</td>
                <td>
                  <div className="admin-row-actions">
                    <Link href={`/admin/businesses/${idea.slug}/edit`} className="admin-btn-secondary">
                      Edit
                    </Link>
                    <form
                      action={async () => {
                        "use server";
                        await deleteIdea(idea.slug);
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
