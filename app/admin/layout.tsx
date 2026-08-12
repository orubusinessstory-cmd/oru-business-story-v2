import "./admin.css";
import "./admin-dashboard-v2.css";
import "./admin-mobile.css";
import { logout } from "./actions";
import AdminShell from "./AdminShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell logoutAction={logout}>{children}</AdminShell>;
}
