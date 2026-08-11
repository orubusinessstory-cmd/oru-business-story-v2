"use client";

import { usePathname } from "next/navigation";
import { pageTitleFor } from "./AdminSidebarNav";

export default function AdminTopbar() {
  const pathname = usePathname();
  const title = pageTitleFor(pathname ?? "/admin");

  return (
    <div className="admin-topbar">
      <h2 className="admin-topbar-title">{title}</h2>
      <div className="admin-topbar-right">
        <div className="admin-avatar">A</div>
        <div className="admin-avatar-label">
          <span>Admin</span>
          <span className="admin-avatar-sub">Super Admin</span>
        </div>
      </div>
    </div>
  );
}
