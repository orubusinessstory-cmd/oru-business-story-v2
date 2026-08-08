import Link from "next/link";
import { BottomNav, PageHero } from "@/components/Layout";
import { getCategories, getIdeaCountByCategory } from "@/lib/data";

export const revalidate = 0;

export default async function CategoriesPage() {
  const categories = await getCategories();
  const counts = await Promise.all(categories.map((cat) => getIdeaCountByCategory(cat.slug)));

  return (
    <>
      <PageHero title="All Categories" />
      <div className="cards" style={{ paddingTop: 20 }}>
        {categories.map((cat, i) => {
          const count = counts[i];
          return (
            <Link key={cat.slug} href={`/category/${cat.slug}`} className="card" style={{ alignItems: "center" }}>
              <div className="thumb">{cat.icon}</div>
              <div className="card-body">
                <h3 className="card-title">{cat.name}</h3>
                <p className="card-desc">
                  {count} business {count === 1 ? "idea" : "ideas"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
      <BottomNav active="Categories" />
    </>
  );
}
