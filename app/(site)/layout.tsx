import "./notifications.css";
import "./menu-drawer.css";
import "./profile.css";
import "./favorites-button.css";
import "./search.css";
import "./videos.css";
import "./latest-ideas.css";
import "./image-fix.css";
import "./article-content.css";
import "./globals.css";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <div className="shell">{children}</div>;
}
