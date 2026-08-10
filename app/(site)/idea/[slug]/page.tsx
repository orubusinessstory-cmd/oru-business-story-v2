import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BottomNav, PageHero } from "@/components/Layout";
import FavoriteButton from "@/components/FavoriteButton";
import IdeaShareButton from "@/components/IdeaShareButton";
import { getAllIdeaSlugs, getCategoryBySlug, getIdeaBySlug } from "@/lib/data";

export const revalidate = 0;

export async function generateStaticParams() {
  const slugs = await getAllIdeaSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function IdeaPage({ params }: { params: { slug: string } }) {
  const idea = await getIdeaBySlug(params.slug);
  if (!idea) return notFound();

  const category = await getCategoryBySlug(idea.categorySlug);

  return (
    <>
      <PageHero title={idea.title} backHref={`/category/${idea.categorySlug}`} />
      <div className="section" style={{ paddingTop: 20, position: "relative" }}>
        <FavoriteButton slug={idea.slug} className="bookmark bookmark-article" />
        <IdeaShareButton slug={idea.slug} title={idea.title} />
        {idea.imageUrl ? (
          <div className="article-hero-image" style={{ backgroundImage: `url(${idea.imageUrl})` }} />
        ) : (
          <div className="article-hero-icon">{idea.icon}</div>
        )}
        <span className={`badge ${idea.tagColor}`}>{idea.tag}</span>
        {category && (
          <p className="card-desc" style={{ marginTop: 6 }}>
            {category.icon} {category.name}
          </p>
        )}
        <div className="card-meta-grid" style={{ margin: "14px 0 20px" }}>
          <div className="meta-block">
            <span className="meta-label">📈 Profit Potential</span>
            <span className={`profit ${idea.profitPotential.toLowerCase()}`}>{idea.profitPotential}</span>
          </div>
          <div className="meta-block">
            <span className="meta-label">💰 Investment</span>
            <span className="meta-value">{idea.investmentRange}</span>
          </div>
        </div>
        <div className="article-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{idea.content}</ReactMarkdown>
        </div>
        {idea.relatedVideoUrl && (
          <div className="article-video">
            <p className="section-label">🎥 Related Video</p>
            <a href={idea.relatedVideoUrl} target="_blank" rel="noopener noreferrer" className="article-video-link">
              Watch on YouTube ↗
            </a>
          </div>
        )}
      </div>
      <BottomNav active="Categories" />
    </>
  );
}
