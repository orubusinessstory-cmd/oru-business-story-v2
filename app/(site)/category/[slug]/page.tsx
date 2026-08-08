import { notFound } from "next/navigation";
import { BottomNav, IdeaCard, PageHero } from "@/components/Layout";
import { getAllCategorySlugs, getCategoryBySlug, getIdeasByCategory } from "@/lib/data";

export const revalidate = 0;

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) return notFound();

  const ideas = await getIdeasByCategory(category.slug);

  return (
    <>
      <PageHero title={category.name} backHref="/categories" />
      <div className="cards" style={{ paddingTop: 20 }}>
        {ideas.length === 0 ? (
          <p className="empty-state">No business ideas in this category yet.</p>
        ) : (
          ideas.map((idea) => <IdeaCard key={idea.slug} idea={idea} />)
        )}
      </div>
      <BottomNav active="Categories" />
    </>
  );
}
