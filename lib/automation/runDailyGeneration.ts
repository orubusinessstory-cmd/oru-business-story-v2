import { createAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/slugify";
import { AUTOMATION_CATEGORIES } from "./categories";
import { generateBusinessArticle } from "./geminiClient";
import { searchBusinessPhoto } from "./unsplash";

const IST_TIME_ZONE = "Asia/Kolkata";

function todayIST(): string {
  // en-CA gives YYYY-MM-DD, which is what we want for a simple date comparison
  return new Intl.DateTimeFormat("en-CA", { timeZone: IST_TIME_ZONE }).format(new Date());
}

export type RunResult =
  | { status: "skipped"; reason: string }
  | { status: "success"; title: string; slug: string; categorySlug: string }
  | { status: "failed"; error: string };

// force = true bypasses the "already ran today" check (used by the manual
// "Generate Now" button in the admin panel). The daily cron never passes it.
export async function runDailyGeneration(force = false): Promise<RunResult> {
  const supabase = createAdminClient();

  const { data: settings, error: settingsError } = await supabase
    .from("automation_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (settingsError || !settings) {
    const reason = settingsError?.message ?? "automation_settings row not found";
    await logHistory(supabase, { status: "failed", error_message: `Could not read settings: ${reason}` });
    return { status: "failed", error: reason };
  }

  if (!force && !settings.is_enabled) {
    return { status: "skipped", reason: "automation is turned off" };
  }

  if (!force && settings.last_run_at) {
    const lastRunDateIST = new Intl.DateTimeFormat("en-CA", { timeZone: IST_TIME_ZONE }).format(
      new Date(settings.last_run_at)
    );
    if (lastRunDateIST === todayIST()) {
      return { status: "skipped", reason: "already generated an article today" };
    }
  }

  const categoryIndex = settings.next_category_index % AUTOMATION_CATEGORIES.length;
  const category = AUTOMATION_CATEGORIES[categoryIndex];

  try {
    const { data: recentIdeas } = await supabase
      .from("ideas")
      .select("title")
      .eq("category_slug", category.slug)
      .order("created_at", { ascending: false })
      .limit(40);

    const avoidTitles = (recentIdeas ?? []).map((row) => row.title as string);

    const article = await generateBusinessArticle(category.name, avoidTitles);

    let slug = slugify(article.title);
    const { data: existing } = await supabase.from("ideas").select("slug").eq("slug", slug).maybeSingle();
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-5)}`;
    }

    const photo = await searchBusinessPhoto(article.imageQuery);

    const { error: insertError } = await supabase.from("ideas").insert({
      slug,
      title: article.title,
      category_slug: category.slug,
      tag: article.tag,
      tag_color: article.tagColor,
      description: article.description,
      profit_potential: article.profitPotential,
      investment_range: article.investmentRange,
      icon: "💼",
      image_url: photo?.imageUrl ?? null,
      image_credit_name: photo?.photographerName ?? null,
      image_credit_url: photo?.photographerProfileUrl ?? null,
      featured: false,
      content: article.content,
      related_video_url: null,
      is_ai_generated: true,
    });
    if (insertError) throw new Error(insertError.message);

    const nextIndex = (categoryIndex + 1) % AUTOMATION_CATEGORIES.length;
    await supabase
      .from("automation_settings")
      .update({
        last_run_at: new Date().toISOString(),
        last_generated_title: article.title,
        last_generated_slug: slug,
        last_generated_category: category.slug,
        next_category_index: nextIndex,
        last_status: "success",
        last_error: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    await logHistory(supabase, {
      status: "success",
      category_slug: category.slug,
      idea_title: article.title,
      idea_slug: slug,
    });

    return { status: "success", title: article.title, slug, categorySlug: category.slug };
  } catch (err: any) {
    const message = err?.message ?? String(err);

    await supabase
      .from("automation_settings")
      .update({ last_status: "failed", last_error: message, updated_at: new Date().toISOString() })
      .eq("id", 1);

    await logHistory(supabase, { status: "failed", category_slug: category.slug, error_message: message });

    return { status: "failed", error: message };
  }
}

async function logHistory(
  supabase: ReturnType<typeof createAdminClient>,
  entry: { status: "success" | "failed"; category_slug?: string; idea_title?: string; idea_slug?: string; error_message?: string }
) {
  await supabase.from("automation_history").insert({
    status: entry.status,
    category_slug: entry.category_slug ?? null,
    idea_title: entry.idea_title ?? null,
    idea_slug: entry.idea_slug ?? null,
    error_message: entry.error_message ?? null,
  });
}
