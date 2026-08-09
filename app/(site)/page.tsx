import Link from "next/link";
import { Header, BottomNav, IdeaCard } from "@/components/Layout";
import { FilterIcon, GridIcon, SearchIcon } from "@/components/Icons";
import { getCategories, getFeaturedIdeas, getLatestIdeas } from "@/lib/data";

export const revalidate = 0;

export default async function HomePage() {
  const [categories, featured, latest] = await Promise.all([
    getCategories(),
    getFeaturedIdeas(),
    getLatestIdeas(3),
  ]);

  return (
    <>
      <Header />

      <div className="hero">
        <div className="rocket-wrap">
          <svg viewBox="0 0 100 130" width="150" height="170">
            <path d="M50 5 C65 20 68 45 65 70 L35 70 C32 45 35 20 50 5 Z" fill="#fff" />
            <path d="M50 5 C60 18 63 38 62 55 L38 55 C37 38 40 18 50 5 Z" fill="#93c5fd" opacity="0.5" />
            <circle cx="50" cy="38" r="9" fill="#1d4ed8" />
            <circle cx="50" cy="38" r="5" fill="#3b82f6" />
            <path d="M35 55 L20 75 L35 72 Z" fill="#2563eb" />
            <path d="M65 55 L80 75 L65 72 Z" fill="#2563eb" />
            <path d="M42 70 L58 70 L54 88 L46 88 Z" fill="#e5e7eb" />
            <path d="M45 88 C45 95 42 105 38 112" stroke="#93c5fd" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.8" />
            <path d="M55 88 C58 97 62 108 66 116" stroke="#3b82f6" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.6" />
            <path d="M38 112 C55 100 90 95 96 60" stroke="#bfdbfe" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="2 6" opacity="0.8" />
          </svg>
        </div>
        <div className="bars">
          <div style={{ height: 26 }} />
          <div style={{ height: 38 }} />
          <div style={{ height: 52 }} />
          <div style={{ height: 68 }} />
          <div style={{ height: 86 }} />
        </div>
        <p className="hero-eyebrow">Discover</p>
        <h1 className="hero-title">
          Profitable
          <br />
          Business Ideas
        </h1>
        <p className="hero-sub">Real ideas. Real opportunities. Real success.</p>
        <form action="/search" method="get" className="search-bar">
          <SearchIcon />
          <input type="search" name="q" placeholder="Search business ideas, industries..." />
          <button type="button" className="filter-btn" aria-label="Filters">
            <FilterIcon />
          </button>
        </form>
      </div>

      <div className="section">
        <div className="section-head">
          <h2>Explore by Category</h2>
          <Link href="/categories" className="view-all">
            View all
          </Link>
        </div>
        <div className="chips">
          <Link href="/categories" className="chip active">
            <GridIcon />
            All
          </Link>
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/category/${cat.slug}`} className="chip">
              <span>{cat.icon}</span>
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <h2>Latest Ideas</h2>
          <Link href="/categories" className="view-all">
            View all
          </Link>
        </div>
      </div>
      <div className="cards">
        {latest.map((idea) => (
          <IdeaCard key={idea.slug} idea={idea} />
        ))}
      </div>

      <div className="section">
        <div className="section-head">
          <h2>Featured Business Ideas</h2>
        </div>
      </div>
      <div className="latest-scroll">
        {featured.map((idea) => (
          <Link key={idea.slug} href={`/idea/${idea.slug}`} className="latest-card">
            {idea.imageUrl ? (
              <div className="latest-thumb" style={{ backgroundImage: `url(${idea.imageUrl})` }} />
            ) : (
              <div className="latest-thumb latest-thumb-icon">{idea.icon}</div>
            )}
            <p className="latest-title">{idea.title}</p>
            <span className={`badge ${idea.tagColor}`} style={{ marginBottom: 0 }}>
              {idea.tag}
            </span>
          </Link>
        ))}
        <Link href="/categories" className="latest-card latest-view-all">
          <span className="latest-view-all-arrow">→</span>
          <p className="latest-title">View All</p>
        </Link>
      </div>

      <BottomNav active="Home" />
    </>
  );
}
