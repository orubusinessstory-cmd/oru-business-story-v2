import "./admin.css";
import "./admin-dashboard-v2.css";
import { logout } from "./actions";
import { AdminSidebarNav } from "./AdminSidebarNav";
import AdminTopbar from "./AdminTopbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <img src="/logo-mark.png" alt="" className="admin-logo-mark" />
          <span>
            ru<span className="admin-logo-badge">ADMIN</span>
          </span>
        </div>
        <AdminSidebarNav />
        <div className="admin-sidebar-bottom">
          <a href="/" target="_blank" rel="noopener noreferrer" className="admin-view-site-btn">
            View Site ↗
          </a>
          <form action={logout} className="admin-logout-form">
            <button type="submit" className="admin-logout-btn">
              Log out
            </button>
          </form>
        </div>
      </aside>
      <div className="admin-content">
        <AdminTopbar />
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
