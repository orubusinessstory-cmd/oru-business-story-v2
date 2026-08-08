import { createClient } from "@/lib/supabase/server";
import { addAdminUser, removeAdminUser } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const supabase = createClient();
  const { data: users } = await supabase.from("admin_users").select("*").order("created_at");

  return (
    <>
      <h1>Users</h1>
      <p className="admin-sub">
        People allowed to know about / manage this site. Adding someone here doesn't create their
        login automatically — after adding their email, create their actual sign-in account for
        them in Supabase → Authentication → Users, using the same email.
      </p>

      <div className="admin-card">
        <h3 style={{ marginTop: 0 }}>Add a team member</h3>
        <form action={addAdminUser} style={{ display: "flex", gap: 10 }}>
          <input
            type="email"
            name="email"
            required
            placeholder="teammate@email.com"
            style={{ flex: 1, border: "1px solid #d1d5db", borderRadius: 8, padding: "9px 12px", fontSize: 14 }}
          />
          <button type="submit" className="admin-btn-primary">
            Add
          </button>
        </form>
      </div>

      {!users || users.length === 0 ? (
        <p className="admin-empty">No team members added yet — it's just you.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Email</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.email}</td>
                <td>
                  <form
                    action={async () => {
                      "use server";
                      await removeAdminUser(u.id);
                    }}
                  >
                    <button type="submit" className="admin-btn-danger">
                      Remove
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
