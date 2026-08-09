import { BottomNav, PageHero } from "@/components/Layout";
import ShareButton from "@/components/ShareButton";

const YOUTUBE_URL = "https://youtube.com/@orubusinessstory?si=ENZ0n736zs5XZW4i";
const CONTACT_EMAIL = "orubusinessstory@gmail.com";

export default function ProfilePage() {
  return (
    <>
      <PageHero title="Profile" />

      <div className="profile-card">
        <div className="profile-avatar">🎬</div>
        <h2>Oru Business Story</h2>
        <p className="profile-tagline">
          Real business ideas across Food, Agriculture, Small Business, Online & Manufacturing.
        </p>
        <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className="profile-btn-primary">
          ▶ Subscribe on YouTube
        </a>
      </div>

      <div className="profile-section">
        <p className="profile-section-title">Contact</p>
        <a href={`mailto:${CONTACT_EMAIL}`} className="profile-link-row">
          <span>✉️ {CONTACT_EMAIL}</span>
          <span className="profile-chevron">›</span>
        </a>
      </div>

      <div className="profile-section">
        <p className="profile-section-title">App</p>
        <ShareButton />
        <a href={`mailto:${CONTACT_EMAIL}?subject=Feedback on Oru Business Story app`} className="profile-link-row">
          <span>💬 Send Feedback</span>
          <span className="profile-chevron">›</span>
        </a>
        <p className="profile-version">Version 1.0</p>
      </div>

      <BottomNav active="Profile" />
    </>
  );
}
