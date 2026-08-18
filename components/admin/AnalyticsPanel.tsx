"use client";

import { useEffect, useState } from "react";
import {
  getRangeDates,
  getTotalViews,
  getViewsByPage,
  getViewsByDay,
  RangeKey,
} from "@/lib/analytics";

export default function AnalyticsPanel() {
  const [range, setRange] = useState<RangeKey>("week");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [total, setTotal] = useState<number | null>(null);
  const [byPage, setByPage] = useState<{ path: string; count: number }[]>([]);
  const [byDay, setByDay] = useState<{ day: string; count: number }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (range === "custom" && (!customStart || !customEnd)) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range, customStart, customEnd]);

  async function load() {
    setLoading(true);
    const { start, end } = getRangeDates(range, customStart, customEnd);
    const [t, pages, days] = await Promise.all([
      getTotalViews(start, end),
      getViewsByPage(start, end),
      getViewsByDay(start, end),
    ]);
    setTotal(t);
    setByPage(pages);
    setByDay(days);
    setLoading(false);
  }

  const maxDay = Math.max(1, ...byDay.map((d) => d.count));

  return (
    <div className="analytics-panel">
      <div className="analytics-range-buttons">
        {(["week", "month", "year", "custom"] as RangeKey[]).map((r) => (
          <button
            key={r}
            type="button"
            className={`analytics-range-btn ${range === r ? "active" : ""}`}
            onClick={() => setRange(r)}
          >
            {r === "week" ? "Week" : r === "month" ? "Month" : r === "year" ? "Year" : "Custom"}
          </button>
        ))}
      </div>

      {range === "custom" && (
        <div className="analytics-custom-dates">
          <input
            type="date"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
          />
          <span>to</span>
          <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} />
        </div>
      )}

      {loading ? (
        <p className="analytics-loading">Loading...</p>
      ) : (
        <>
          <div className="analytics-total-card">
            <span className="analytics-total-label">Total Visits</span>
            <span className="analytics-total-number">{total ?? 0}</span>
          </div>

          <div className="analytics-chart">
            {byDay.length === 0 && <p className="analytics-empty">No views in this period yet.</p>}
            {byDay.map((d) => (
              <div key={d.day} className="analytics-bar-wrap" title={`${d.day}: ${d.count} views`}>
                <div
                  className="analytics-bar"
                  style={{ height: `${(d.count / maxDay) * 100}%` }}
                />
                <span className="analytics-bar-label">{d.day.slice(5)}</span>
              </div>
            ))}
          </div>

          <h4 className="analytics-subheading">By Page</h4>
          <table className="analytics-table">
            <tbody>
              {byPage.length === 0 && (
                <tr>
                  <td colSpan={2}>No data yet.</td>
                </tr>
              )}
              {byPage.map((p) => (
                <tr key={p.path}>
                  <td>{p.path}</td>
                  <td>{p.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
