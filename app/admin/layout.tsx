import "./admin-preview.css";
import Link from "next/link";
import "./admin.css";
import { logout } from "./actions";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          Oru <span>Admin</span>
        </div>
        <nav className="admin-nav">
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/categories">Categories</Link>
          <Link href="/admin/businesses">Businesses</Link>
          <Link href="/admin/users">Users</Link>
          <a href="/" target="_blank" rel="noopener noreferrer">
            View Site ↗
          </a>
        </nav>
        <form action={logout} className="admin-logout-form">
          <button type="submit" className="admin-logout-btn">
            Log out
          </button>
        </form>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
