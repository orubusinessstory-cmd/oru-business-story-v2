import { BottomNav, IdeaCard, PageHero } from "@/components/Layout";
import { SearchIcon } from "@/components/Icons";
import { searchIdeas } from "@/lib/data";

export const revalidate = 0;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q ?? "";
  const results = q ? await searchIdeas(q) : [];

  return (
    <>
      <PageHero title="Search" />
      <div style={{ padding: "0 20px 16px" }}>
        <form action="/search" method="get" className="search-bar search-bar-page">
          <SearchIcon />
          <input type="search" name="q" defaultValue={q} placeholder="Search business ideas, industries..." autoFocus />
        </form>
      </div>

      {!q ? (
        <p className="empty-state">Type something above to search business ideas.</p>
      ) : results.length === 0 ? (
        <p className="empty-state">No results for "{q}". Try a different word.</p>
      ) : (
        <>
          <p className="search-count">
            {results.length} result{results.length === 1 ? "" : "s"} for "{q}"
          </p>
          <div className="cards">
            {results.map((idea) => (
              <IdeaCard key={idea.slug} idea={idea} />
            ))}
          </div>
        </>
      )}

      <BottomNav active="Home" />
    </>
  );
}
