"use client";

import { useEffect, useState } from "react";
import { BottomNav, IdeaCard, PageHero } from "@/components/Layout";
import { FAVORITES_EVENT, getFavorites } from "@/lib/favorites";
import { supabase } from "@/lib/supabaseClient";
import type { BusinessIdea } from "@/lib/data";

function mapRow(row: any): BusinessIdea {
  return {
    slug: row.slug,
    title: row.title,
    categorySlug: row.category_slug,
    tag: row.tag,
    tagColor: row.tag_color,
    description: row.description,
    profitPotential: row.profit_potential,
    investmentRange: row.investment_range,
    icon: row.icon,
    imageUrl: row.image_url,
    featured: row.featured,
    content: row.content,
    relatedVideoUrl: row.related_video_url,
  };
}

export default function FavoritesPage() {
  const [ideas, setIdeas] = useState<BusinessIdea[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const slugs = await getFavorites();
      if (slugs.length === 0) {
        if (!cancelled) setIdeas([]);
        return;
      }
      const { data, error } = await supabase.from("ideas").select("*").in("slug", slugs);
      if (!cancelled) {
        setIdeas(error ? [] : (data ?? []).map(mapRow));
      }
    }

    load();
    window.addEventListener(FAVORITES_EVENT, load);
    return () => {
      cancelled = true;
      window.removeEventListener(FAVORITES_EVENT, load);
    };
  }, []);

  return (
    <>
      <PageHero title="Favorites" />
      {ideas === null ? (
        <p className="empty-state">Loading...</p>
      ) : ideas.length === 0 ? (
        <p className="empty-state">
          You haven't saved any business ideas yet. Tap the bookmark icon on any idea to save it here.
        </p>
      ) : (
        <div className="cards">
          {ideas.map((idea) => (
            <IdeaCard key={idea.slug} idea={idea} />
          ))}
        </div>
      )}
      <BottomNav active="Favorites" />
    </>
  );
}
