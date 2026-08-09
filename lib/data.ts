import { supabase } from "./supabaseClient";

export type TagColor = "blue" | "green" | "purple" | "orange";

export type Category = {
  slug: string;
  name: string;
  icon: string;
};

export type BusinessIdea = {
  slug: string;
  title: string;
  categorySlug: string;
  tag: string;
  tagColor: TagColor;
  description: string;
  profitPotential: "High" | "Medium" | "Low";
  investmentRange: string;
  icon: string;
  imageUrl?: string | null;
  featured?: boolean;
  content: string;
  relatedVideoUrl?: string | null;
};

export type Video = {
  id: string;
  title: string;
  youtubeUrl: string;
  thumbnailUrl: string | null;
};

// Maps a Supabase row (snake_case) to our app's shape (camelCase)
function mapIdea(row: any): BusinessIdea {
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

function mapVideo(row: any): Video {
  return {
    id: row.id,
    title: row.title,
    youtubeUrl: row.youtube_url,
    thumbnailUrl: row.thumbnail_url,
  };
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from("categories").select("*");
  if (error) {
    console.error("getCategories error:", error.message);
    return [];
  }
  return data as Category[];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabase.from("categories").select("*").eq("slug", slug).single();
  if (error) {
    console.error("getCategoryBySlug error:", error.message);
    return null;
  }
  return data as Category;
}

export async function getIdeasByCategory(categorySlug: string): Promise<BusinessIdea[]> {
  const { data, error } = await supabase
    .from("ideas")
    .select("*")
    .eq("category_slug", categorySlug)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getIdeasByCategory error:", error.message);
    return [];
  }
  return (data ?? []).map(mapIdea);
}

export async function getFeaturedIdeas(): Promise<BusinessIdea[]> {
  const { data, error } = await supabase
    .from("ideas")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getFeaturedIdeas error:", error.message);
    return [];
  }
  return (data ?? []).map(mapIdea);
}

export async function getLatestIdeas(limit: number = 6): Promise<BusinessIdea[]> {
  const { data, error } = await supabase
    .from("ideas")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("getLatestIdeas error:", error.message);
    return [];
  }
  return (data ?? []).map(mapIdea);
}

export async function getIdeaBySlug(slug: string): Promise<BusinessIdea | null> {
  const { data, error } = await supabase.from("ideas").select("*").eq("slug", slug).single();
  if (error) {
    console.error("getIdeaBySlug error:", error.message);
    return null;
  }
  return mapIdea(data);
}

export async function getIdeaCountByCategory(categorySlug: string): Promise<number> {
  const { count, error } = await supabase
    .from("ideas")
    .select("*", { count: "exact", head: true })
    .eq("category_slug", categorySlug);
  if (error) {
    console.error("getIdeaCountByCategory error:", error.message);
    return 0;
  }
  return count ?? 0;
}

export async function getAllIdeaSlugs(): Promise<string[]> {
  const { data, error } = await supabase.from("ideas").select("slug");
  if (error) return [];
  return (data ?? []).map((row) => row.slug);
}

export async function getAllCategorySlugs(): Promise<string[]> {
  const { data, error } = await supabase.from("categories").select("slug");
  if (error) return [];
  return (data ?? []).map((row) => row.slug);
}

export async function getVideos(): Promise<Video[]> {
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getVideos error:", error.message);
    return [];
  }
  return (data ?? []).map(mapVideo);
}
