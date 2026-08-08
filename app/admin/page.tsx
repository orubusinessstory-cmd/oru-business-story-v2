import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createClient();

  const [{ count: ideaCount }, { count: categoryCount }, { count: featuredCount }] = await Promise.all([
    supabase.from("ideas").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("ideas").select("*", { count: "exact", head: true }).eq("featured", true),
  ]);

  return (
    <>
      <h1>Dashboard</h1>
      <p className="admin-sub">Overview of your content and traffic.</p>

      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <div className="num">{ideaCount ?? 0}</div>
          <div className="label">Business Ideas</div>
        </div>
        <div className="admin-stat-card">
          <div className="num">{categoryCount ?? 0}</div>
          <div className="label">Categories</div>
        </div>
        <div className="admin-stat-card">
          <div className="num">{featuredCount ?? 0}</div>
          <div className="label">Featured Ideas</div>
        </div>
      </div>

      <div className="admin-card">
        <h3 style={{ marginTop: 0 }}>Views &amp; Traffic</h3>
        <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.6 }}>
          Page views, visitor counts, and traffic sources are tracked automatically by Vercel
          Analytics. Full charts and trends live on your Vercel dashboard, not in this panel.
        </p>
        <a
          href="https://vercel.com/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-btn-primary"
        >
          Open Vercel Analytics ↗
        </a>
      </div>

      <div className="admin-card">
        <h3 style={{ marginTop: 0 }}>Quick Actions</h3>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a href="/admin/businesses/new" className="admin-btn-secondary">
            + Add Business Idea
          </a>
          <a href="/admin/categories/new" className="admin-btn-secondary">
            + Add Category
          </a>
          <a href="/" target="_blank" rel="noopener noreferrer" className="admin-btn-secondary">
            View Live Site ↗
          </a>
        </div>
      </div>
    </>
  );
}
