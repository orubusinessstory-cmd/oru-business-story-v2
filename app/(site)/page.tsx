import Link from "next/link";
import { Header, BottomNav, IdeaCard } from "@/components/Layout";
import { CategoryIcons, FilterIcon, GridIcon, SearchIcon } from "@/components/Icons";
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
            <g stroke="#fde68a" strokeWidth="3" strokeLinecap="round" opacity="0.9">
              <line x1="50" y1="2" x2="50" y2="12" />
              <line x1="28" y1="10" x2="35" y2="17" />
              <line x1="72" y1="10" x2="65" y2="17" />
              <line x1="18" y1="30" x2="28" y2="30" />
              <line x1="82" y1="30" x2="72" y2="30" />
            </g>
            <circle cx="50" cy="32" r="16" fill="#fde047" opacity="0.95" />
            <rect x="43" y="46" width="14" height="10" rx="2" fill="#93c5fd" />
            <rect x="45" y="57" width="10" height="4" rx="1" fill="#60a5fa" />
            <path
              d="M15 105 C35 105 45 95 50 70 C54 50 65 45 88 45"
              stroke="#fde68a"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="1 9"
            />
            <path d="M78 38 L92 45 L78 55 Z" fill="#fde047" />
          </svg>
        </div>
        <div className="bars">
          <div style={{ height: 26 }} />
          <div style={{ height: 38 }} />
          <div style={{ height: 52 }} />
          <div style={{ height: 68 }} />
          <div style={{ height: 86 }} />
        </div>
        <p className="hero-badge">Discover • Plan • Grow</p>
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
        <div className="category-grid">
          <Link href="/categories" className="category-tile active">
            <span className="category-tile-icon">
              <GridIcon />
            </span>
            All
          </Link>
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/category/${cat.slug}`} className="category-tile">
              <span className="category-tile-icon">{CategoryIcons[cat.slug] ?? cat.icon}</span>
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
