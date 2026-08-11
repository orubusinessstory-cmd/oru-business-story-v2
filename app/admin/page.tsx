import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createClient();

  const [{ count: ideaCount }, { count: categoryCount }, { count: featuredCount }, { count: userCount }, { data: recentIdeas }] =
    await Promise.all([
      supabase.from("ideas").select("*", { count: "exact", head: true }),
      supabase.from("categories").select("*", { count: "exact", head: true }),
      supabase.from("ideas").select("*", { count: "exact", head: true }).eq("featured", true),
      supabase.from("admin_users").select("*", { count: "exact", head: true }),
      supabase.from("ideas").select("*").order("created_at", { ascending: false }).limit(5),
    ]);

  return (
    <>
      <div className="admin-welcome-banner">
        <div>
          <p className="admin-welcome-eyebrow">Welcome back,</p>
          <h1 className="admin-welcome-title">Admin 👋</h1>
          <p className="admin-welcome-sub">Here's what's happening with Oru Business Story today.</p>
        </div>
        <svg className="admin-welcome-art" width="150" height="120" viewBox="0 0 150 120" fill="none">
          <rect x="20" y="10" width="110" height="80" rx="8" fill="#fff" opacity="0.9" />
          <rect x="32" y="24" width="35" height="24" rx="3" fill="#dbeafe" />
          <rect x="32" y="52" width="50" height="6" rx="3" fill="#e5e7eb" />
          <rect x="32" y="62" width="35" height="6" rx="3" fill="#e5e7eb" />
          <circle cx="105" cy="60" r="16" fill="none" stroke="#93c5fd" strokeWidth="8" strokeDasharray="60 40" />
        </svg>
      </div>

      <div className="admin-stat-grid admin-stat-grid-4">
        <div className="admin-stat-card">
          <div className="admin-stat-icon tint-blue">💡</div>
          <div className="num">{ideaCount ?? 0}</div>
          <div className="label">Business Ideas</div>
          <Link href="/admin/businesses" className="admin-stat-link">
            View all →
          </Link>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon tint-green">📁</div>
          <div className="num">{categoryCount ?? 0}</div>
          <div className="label">Categories</div>
          <Link href="/admin/categories" className="admin-stat-link">
            View all →
          </Link>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon tint-purple">⭐</div>
          <div className="num">{featuredCount ?? 0}</div>
          <div className="label">Featured Ideas</div>
          <Link href="/admin/businesses" className="admin-stat-link">
            View all →
          </Link>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon tint-orange">👥</div>
          <div className="num">{userCount ?? 0}</div>
          <div className="label">Users</div>
          <Link href="/admin/users" className="admin-stat-link">
            View all →
          </Link>
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <h3 style={{ margin: 0 }}>Recent Business Ideas</h3>
          <Link href="/admin/businesses" className="admin-stat-link">
            View all →
          </Link>
        </div>
        {!recentIdeas || recentIdeas.length === 0 ? (
          <p className="admin-empty">No business ideas published yet.</p>
        ) : (
          <div className="admin-recent-list">
            {recentIdeas.map((idea) => (
              <Link key={idea.slug} href={`/admin/businesses/${idea.slug}/edit`} className="admin-recent-row">
                {idea.image_url ? (
                  <img src={idea.image_url} alt="" className="admin-recent-thumb" />
                ) : (
                  <div className="admin-recent-thumb admin-recent-thumb-icon">{idea.icon ?? "💼"}</div>
                )}
                <div className="admin-recent-body">
                  <span className="admin-recent-title">{idea.title}</span>
                  <span className={`badge ${idea.tag_color}`} style={{ marginBottom: 0 }}>
                    {idea.tag}
                  </span>
                </div>
                <span className="admin-recent-date">
                  {new Date(idea.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
                <span className="admin-status-pill">Published</span>
              </Link>
            ))}
          </div>
        )}
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
