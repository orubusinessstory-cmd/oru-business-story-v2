import { createClient } from "@supabase/supabase-js";

// SERVER-ONLY. Uses the Supabase service role key, which bypasses Row Level
// Security. Never import this file from a "use client" component and never
// expose SUPABASE_SERVICE_ROLE_KEY with a NEXT_PUBLIC_ prefix.
//
// This exists because the daily automation cron job runs with no logged-in
// admin session (no cookies), so it can't rely on the same anon-key +
// Supabase Auth session pattern the rest of the admin panel uses.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables."
    );
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
