import "./automation.css";
import { createClient } from "@/lib/supabase/server";
import { AUTOMATION_CATEGORIES } from "@/lib/automation/categories";
import { setAutomationEnabled, updateAutomationPublishTime, runAutomationNow } from "../actions";
import GenerateNowButton from "./GenerateNowButton";

export const dynamic = "force-dynamic";

function formatIST(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function categoryName(slug: string | null) {
  if (!slug) return "—";
  return AUTOMATION_CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;
}

export default async function AutomationPage() {
  const supabase = createClient();

  const { data: settings } = await supabase.from("automation_settings").select("*").eq("id", 1).maybeSingle();
  const { data: history } = await supabase
    .from("automation_history")
    .select("*")
    .order("run_at", { ascending: false })
    .limit(20);

  if (!settings) {
    return (
      <>
        <h1>Automation</h1>
        <p className="admin-sub">Automatic Daily Business Content System.</p>
        <div className="admin-card">
          <p style={{ margin: 0 }}>
            Setup ഇതുവരെ complete ആയിട്ടില്ല — <code>supabase/automation-setup.sql</code> Supabase SQL
            Editor-ൽ run ചെയ്തിട്ടില്ല എന്ന് തോന്നുന്നു. അത് run ചെയ്ത ശേഷം ഈ page reload ചെയ്യുക.
          </p>
        </div>
      </>
    );
  }

  const isOn = settings.is_enabled === true;
  const nextCategory = AUTOMATION_CATEGORIES[settings.next_category_index % AUTOMATION_CATEGORIES.length];

  return (
    <>
      <h1>Automation</h1>
      <p className="admin-sub">Automatic Daily Business Content System — Claude AI generates and publishes one new business idea article every day.</p>

      <div className="admin-card automation-status-card">
        <div>
          <div className="automation-status-row">
            <span className={`automation-dot ${isOn ? "on" : "off"}`} />
            <strong>Automation is currently {isOn ? "ON" : "OFF"}</strong>
          </div>
          <p className="admin-hint" style={{ marginTop: 6 }}>
            {isOn
              ? `Next article will be from the "${nextCategory.name}" category, at approximately ${settings.publish_time} IST.`
              : "Turn this on to start publishing one AI-generated business idea article automatically every day."}
          </p>
        </div>
        <div className="automation-toggle-buttons">
          <form
            action={async () => {
              "use server";
              await setAutomationEnabled(true);
            }}
          >
            <button type="submit" className={`admin-btn-primary ${isOn ? "" : "automation-btn-inactive"}`} disabled={isOn}>
              Turn ON
            </button>
          </form>
          <form
            action={async () => {
              "use server";
              await setAutomationEnabled(false);
            }}
          >
            <button type="submit" className="admin-btn-danger" disabled={!isOn}>
              Turn OFF
            </button>
          </form>
        </div>
      </div>

      <div className="admin-card">
        <h3 style={{ marginTop: 0 }}>Publishing Time</h3>
        <p className="admin-hint" style={{ marginTop: -8, marginBottom: 14 }}>
          Cron job daily ഒരു തവണ ഈ സമയത്തിനടുത്ത് (Vercel Hobby plan-ൽ ± 1 hour വരെ വ്യത്യാസം വരാം) run
          ആകും. സമയം മാറ്റാൻ ഇവിടെ save ചെയ്യുക, എന്നിട്ട് <code>vercel.json</code>-ലെ cron schedule ഈ
          സമയത്തിന് അനുസരിച്ച് update ചെയ്ത് redeploy ചെയ്യുക (താഴെ README-യിൽ exact steps ഉണ്ട്).
        </p>
        <form action={updateAutomationPublishTime} style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input
            type="time"
            name="publish_time"
            defaultValue={settings.publish_time ?? "09:00"}
            required
            style={{ border: "1px solid #d1d5db", borderRadius: 8, padding: "9px 12px", fontSize: 14 }}
          />
          <button type="submit" className="admin-btn-secondary">
            Save Time
          </button>
        </form>
      </div>

      <div className="admin-card">
        <h3 style={{ marginTop: 0 }}>Last Generated Article</h3>
        {settings.last_generated_slug ? (
          <div className="automation-last-article">
            <div>
              <div className="automation-last-title">{settings.last_generated_title}</div>
              <div className="admin-hint" style={{ marginTop: 4 }}>
                {categoryName(settings.last_generated_category)} · {formatIST(settings.last_run_at)}
              </div>
            </div>
            <a href={`/admin/businesses/${settings.last_generated_slug}/edit`} className="admin-btn-secondary">
              Edit →
            </a>
          </div>
        ) : (
          <p className="admin-empty">No article has been generated yet.</p>
        )}
      </div>

      <div className="admin-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <h3 style={{ margin: 0 }}>Automation History</h3>
          <form action={runAutomationNow}>
            <GenerateNowButton />
          </form>
        </div>
        <p className="admin-hint" style={{ marginTop: -2, marginBottom: 14 }}>
          "Generate Now" ഇന്ന് ഒരു article already generate ചെയ്തിട്ടുണ്ടെങ്കിലും force ആയി ഒരു പുതിയ
          article ഉണ്ടാക്കും — automation test ചെയ്യാൻ ഉപയോഗിക്കുക.
        </p>

        {!history || history.length === 0 ? (
          <p className="admin-empty">No automation runs yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date &amp; Time</th>
                <th>Category</th>
                <th>Article</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((row) => (
                <tr key={row.id}>
                  <td>{formatIST(row.run_at)}</td>
                  <td>{categoryName(row.category_slug)}</td>
                  <td>
                    {row.idea_slug ? (
                      <a href={`/admin/businesses/${row.idea_slug}/edit`}>{row.idea_title}</a>
                    ) : row.error_message ? (
                      <span className="admin-hint">{row.error_message}</span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    <span className={`automation-status-badge ${row.status}`}>
                      {row.status === "success" ? "Published" : row.status === "failed" ? "Failed" : "Skipped"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
