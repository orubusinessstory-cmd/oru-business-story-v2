"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { BellIcon } from "./Icons";

const SEEN_KEY = "oru-last-seen-notifications";

type NotifItem = {
  key: string;
  label: string;
  href: string;
  external?: boolean;
  createdAt: string;
};

export default function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotifItem[] | null>(null);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    async function load() {
      const [ideasRes, videosRes] = await Promise.all([
        supabase.from("ideas").select("slug,title,created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("videos").select("id,title,created_at").order("created_at", { ascending: false }).limit(5),
      ]);

      const ideaItems: NotifItem[] = (ideasRes.data ?? []).map((row: any) => ({
        key: `idea-${row.slug}`,
        label: `New idea: ${row.title}`,
        href: `/idea/${row.slug}`,
        createdAt: row.created_at,
      }));
      const videoItems: NotifItem[] = (videosRes.data ?? []).map((row: any) => ({
        key: `video-${row.id}`,
        label: `New video: ${row.title}`,
        href: `/videos`,
        createdAt: row.created_at,
      }));

      const combined = [...ideaItems, ...videoItems]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 6);

      setItems(combined);

      const lastSeen = typeof window !== "undefined" ? window.localStorage.getItem(SEEN_KEY) : null;
      const latest = combined[0]?.createdAt;
      if (latest && (!lastSeen || new Date(latest).getTime() > new Date(lastSeen).getTime())) {
        setHasUnread(true);
      }
    }
    load();
  }, []);

  function handleOpen() {
    setOpen(true);
    setHasUnread(false);
    if (items && items[0]) {
      window.localStorage.setItem(SEEN_KEY, items[0].createdAt);
    }
  }

  return (
    <>
      <button
        className={`icon-btn ${hasUnread ? "bell-dot" : ""}`}
        aria-label="Notifications"
        onClick={handleOpen}
      >
        <BellIcon />
      </button>

      {open && (
        <div className="notif-overlay" onClick={() => setOpen(false)}>
          <div className="notif-panel" onClick={(e) => e.stopPropagation()}>
            <p className="notif-title">Notifications</p>
            {items === null ? (
              <p className="notif-empty">Loading...</p>
            ) : items.length === 0 ? (
              <p className="notif-empty">Nothing yet — check back soon.</p>
            ) : (
              items.map((item) =>
                item.external ? (
                  <a
                    key={item.key}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="notif-item"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link key={item.key} href={item.href} className="notif-item" onClick={() => setOpen(false)}>
                    {item.label}
                  </Link>
                )
              )
            )}
          </div>
        </div>
      )}
    </>
  );
}
