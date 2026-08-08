import { BottomNav, PageHero } from "@/components/Layout";

export default function FavoritesPage() {
  return (
    <>
      <PageHero title="Favorites" />
      <p className="empty-state">
        You haven&apos;t saved any business ideas yet. Tap the bookmark icon on an idea to save it here.
      </p>
      <BottomNav active="Favorites" />
    </>
  );
}
