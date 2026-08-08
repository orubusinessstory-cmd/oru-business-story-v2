import { BottomNav, PageHero } from "@/components/Layout";

export default function ResourcesPage() {
  return (
    <>
      <PageHero title="Resources" />
      <p className="empty-state">Guides and tools for starting your business are coming soon.</p>
      <BottomNav active="Resources" />
    </>
  );
}
