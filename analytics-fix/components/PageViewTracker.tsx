"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

// Logs one row to `page_views` every time the route changes.
// Skips /admin so admin browsing doesn't inflate visitor stats.
export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith("/admin")) return;

    supabase.from("page_views").insert({ path: pathname }).then(() => {
      // fire and forget — no need to handle the result
    });
  }, [pathname]);

  return null;
}
