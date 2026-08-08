import { BottomNav, PageHero } from "@/components/Layout";

export default function ProfilePage() {
  return (
    <>
      <PageHero title="Profile" />
      <p className="empty-state">Sign in to save favorites and track your progress.</p>
      <BottomNav active="Profile" />
    </>
  );
}
