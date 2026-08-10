"use client";

import { useState } from "react";
import Link from "next/link";
import { MenuIcon } from "./Icons";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Categories", href: "/categories" },
  { label: "Search", href: "/search" },
  { label: "Favorites", href: "/favorites" },
  { label: "Videos", href: "/videos" },
  { label: "Profile", href: "/profile" },
];

export default function MenuDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="icon-btn" aria-label="Menu" onClick={() => setOpen(true)}>
        <MenuIcon />
      </button>

      {open && (
        <div className="drawer-overlay" onClick={() => setOpen(false)}>
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-head">
              <img src="/logo.png" alt="Oru Business Story" className="logo-img" style={{ height: 40 }} />
              <button className="icon-btn" aria-label="Close menu" onClick={() => setOpen(false)}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <nav className="drawer-links">
              {LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="drawer-link" onClick={() => setOpen(false)}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
