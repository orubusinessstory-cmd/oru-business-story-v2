import Link from "next/link";
import { NavIcons } from "./Icons";
import FavoriteButton from "./FavoriteButton";
import MenuDrawer from "./MenuDrawer";
import NotificationsBell from "./NotificationsBell";
import type { BusinessIdea } from "@/lib/data";

export function Header() {
  return (
    <div className="topbar">
      <MenuDrawer />
      <Link href="/" className="logo-link">
        <img src="/logo-header.png" alt="Oru Business Story" className="logo-img" />
      </Link>
      <NotificationsBell />
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
        <div className="card-meta-grid">
          <div className="meta-block">
            <span className="meta-label">📈 Profit</span>
            <span className={`profit ${idea.profitPotential.toLowerCase()}`}>{idea.profitPotential}</span>
          </div>
          <div className="meta-block">
            <span className="meta-label">💰 Investment</span>
            <span className="meta-value">{idea.investmentRange}</span>
          </div>
        </div>
      </div>
      <FavoriteButton slug={idea.slug} />
    </Link>
  );
}
