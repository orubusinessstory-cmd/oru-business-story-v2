import { supabase } from "@/lib/supabaseClient";

export type RangeKey = "week" | "month" | "year" | "custom";

export function getRangeDates(range: RangeKey, customStart?: string, customEnd?: string) {
  const now = new Date();
  let start: Date;
  let end: Date = now;

  if (range === "week") {
    start = new Date(now);
    start.setDate(start.getDate() - 7);
  } else if (range === "month") {
    start = new Date(now);
    start.setMonth(start.getMonth() - 1);
  } else if (range === "year") {
    start = new Date(now);
    start.setFullYear(start.getFullYear() - 1);
  } else {
    start = customStart ? new Date(customStart) : new Date(new Date().setDate(now.getDate() - 7));
    end = customEnd ? new Date(customEnd) : new Date();
  }

  return { start, end };
}

// Total view count for the period (counts every visit, repeats included)
export async function getTotalViews(start: Date, end: Date) {
  const { count, error } = await supabase
    .from("page_views")
    .select("*", { count: "exact", head: true })
    .gte("created_at", start.toISOString())
    .lte("created_at", end.toISOString());

  if (error) throw error;
  return count ?? 0;
}

// Breakdown: how many views each page got in the period
export async function getViewsByPage(start: Date, end: Date) {
  const { data, error } = await supabase
    .from("page_views")
    .select("path")
    .gte("created_at", start.toISOString())
    .lte("created_at", end.toISOString());

  if (error) throw error;

  const counts: Record<string, number> = {};
  (data || []).forEach((row) => {
    counts[row.path] = (counts[row.path] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count);
}

// Breakdown: how many total views per calendar day (for the chart)
export async function getViewsByDay(start: Date, end: Date) {
  const { data, error } = await supabase
    .from("page_views")
    .select("created_at")
    .gte("created_at", start.toISOString())
    .lte("created_at", end.toISOString());

  if (error) throw error;

  const counts: Record<string, number> = {};
  (data || []).forEach((row) => {
    const day = new Date(row.created_at).toISOString().slice(0, 10);
    counts[day] = (counts[day] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([day, count]) => ({ day, count }))
    .sort((a, b) => a.day.localeCompare(b.day));
}
