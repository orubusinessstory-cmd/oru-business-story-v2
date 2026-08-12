"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebarNav, pageTitleFor } from "./AdminSidebarNav";

export default function AdminShell({
  logoutAction,
  children,
}: {
  logoutAction: () => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const title = pageTitleFor(pathname ?? "/admin");

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${open ? "open" : ""}`}>
        <div className="admin-logo">
          <img src="/logo-mark.png" alt="" className="admin-logo-mark" />
          <span className="admin-logo-badge">ADMIN</span>
        </div>
        <AdminSidebarNav onNavigate={() => setOpen(false)} />
        <div className="admin-sidebar-bottom">
          <a href="/" target="_blank" rel="noopener noreferrer" className="admin-view-site-btn">
            View Site ↗
          </a>
          <form action={logoutAction}>
            <button type="submit" className="admin-logout-btn" style={{ width: "100%" }}>
              Log out
            </button>
          </form>
        </div>
      </aside>

      {open && <div className="admin-sidebar-overlay" onClick={() => setOpen(false)} />}

      <div className="admin-content">
        <div className="admin-topbar">
          <button className="admin-hamburger" aria-label="Menu" onClick={() => setOpen(true)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <h2 className="admin-topbar-title">{title}</h2>
          <div className="admin-topbar-right">
            <div className="admin-avatar">A</div>
            <div className="admin-avatar-label">
              <span>Admin</span>
              <span className="admin-avatar-sub">Super Admin</span>
            </div>
          </div>
        </div>
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
