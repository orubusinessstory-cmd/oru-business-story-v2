import "./globals.css";
import "./article-content.css";
import "./image-fix.css";
import "./latest-ideas.css";
import "./videos.css";
import "./search.css";
import "./favorites-button.css";
import "./menu-drawer.css";
import "./notifications.css";
import "./profile.css";
import "./logo.css";
import "./redesign.css";
import "./share-button.css";
import "./desktop-responsive.css";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <div className="shell">{children}</div>;
}
