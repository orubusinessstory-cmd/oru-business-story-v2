import Link from "next/link";
import { BellIcon, BookmarkIcon, MenuIcon, NavIcons } from "./Icons";
import type { BusinessIdea } from "@/lib/data";

export function Header() {
  return (
    <div className="topbar">
      <button className="icon-btn" aria-label="Menu">
        <MenuIcon />
      </button>
      <Link href="/" className="logo">
        <div className="oru">Oru</div>
        <div className="sub">BUSINESS STORY</div>
      </Link>
      <button className="icon-btn bell-dot" aria-label="Notifications">
        <BellIcon />
      </button>
    </div>
  );
}

export function PageHero({ title, backHref = "/" }: { title: string; backHref?: string }) {
  return (
    <div className="page-hero">
      <Link href={backHref} className="back-btn" aria-label="Back">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </Link>
      <h1>{title}</h1>
    </div>
  );
}

export function BottomNav({ active = "Home" }: { active?: string }) {
  const items: { label: keyof typeof NavIcons; href: string }[] = [
    { label: "Home", href: "/" },
    { label: "Categories", href: "/categories" },
    { label: "Favorites", href: "/favorites" },
    { label: "Videos", href: "/videos" },
    { label: "Profile", href: "/profile" },
  ];
  return (
    <div className="bottomnav">
      {items.map((item) => (
        <Link key={item.label} href={item.href} className={`navitem ${active === item.label ? "active" : ""}`}>
          {NavIcons[item.label]}
          {item.label}
        </Link>
      ))}
    </div>
  );
}

export function IdeaCard({ idea }: { idea: BusinessIdea }) {
  return (
    <Link href={`/idea/${idea.slug}`} className="card">
      {idea.imageUrl ? (
        <div className="thumb thumb-image" style={{ backgroundImage: `url(${idea.imageUrl})` }} />
      ) : (
        <div className="thumb">{idea.icon}</div>
      )}
      <div className="card-body">
        <h3 className="card-title">{idea.title}</h3>
        <span className={`badge ${idea.tagColor}`}>{idea.tag}</span>
        <p className="card-desc">{idea.description}</p>
        <div className="card-meta">
          <span>📊 Profit Potential</span>
          <span className={`profit ${idea.profitPotential.toLowerCase()}`}>{idea.profitPotential}</span>
          <span className="divider">|</span>
          <span>{idea.investmentRange}</span>
        </div>
      </div>
      <span className="bookmark">
        <BookmarkIcon />
      </span>
    </Link>
  );
}
