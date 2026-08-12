import Link from "next/link";
import { BottomNav, PageHero } from "@/components/Layout";
import { CategoryIcons } from "@/components/Icons";
import { getCategories, getIdeaCountByCategory } from "@/lib/data";

export const revalidate = 0;

const COLORS: Record<string, string> = {
  food: "blue",
  agriculture: "green",
  "small-business": "orange",
  online: "purple",
  manufacturing: "sky",
  retail: "yellow",
  "home-based": "teal",
};

export default async function CategoriesPage() {
  const categories = await getCategories();
  const counts = await Promise.all(categories.map((cat) => getIdeaCountByCategory(cat.slug)));

  return (
    <>
      <PageHero title="All Categories" subtitle="Explore business ideas by category" />
      <div className="category-row-list">
        {categories.map((cat, i) => {
          const count = counts[i];
          const color = COLORS[cat.slug] ?? "blue";
          return (
            <Link key={cat.slug} href={`/category/${cat.slug}`} className="category-row">
              <div className={`category-row-thumb tint-${color}`}>{CategoryIcons[cat.slug] ?? cat.icon}</div>
              <div className="category-row-body">
                <h3>{cat.name}</h3>
                <p>
                  {count} business {count === 1 ? "idea" : "ideas"}
                </p>
              </div>
              <div className={`category-row-arrow tint-${color}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>
      <BottomNav active="Categories" />
    </>
  );
}
