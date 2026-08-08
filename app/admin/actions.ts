"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// ---------- Auth ----------

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ---------- Categories ----------

export async function createCategory(formData: FormData) {
  const supabase = createClient();
  const slug = String(formData.get("slug")).trim();
  const name = String(formData.get("name")).trim();
  const icon = String(formData.get("icon")).trim();

  const { error } = await supabase.from("categories").insert({ slug, name, icon });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/categories");
  revalidatePath("/");
  redirect("/admin/categories");
}

export async function updateCategory(originalSlug: string, formData: FormData) {
  const supabase = createClient();
  const slug = String(formData.get("slug")).trim();
  const name = String(formData.get("name")).trim();
  const icon = String(formData.get("icon")).trim();

  const { error } = await supabase
    .from("categories")
    .update({ slug, name, icon })
    .eq("slug", originalSlug);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/categories");
  revalidatePath("/");
  redirect("/admin/categories");
}

export async function deleteCategory(slug: string) {
  const supabase = createClient();
  const { error } = await supabase.from("categories").delete().eq("slug", slug);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/categories");
  revalidatePath("/");
}

// ---------- Business ideas ----------

async function uploadIdeaImage(supabase: any, slug: string, file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${slug}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("idea-images").upload(path, file, { upsert: true });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from("idea-images").getPublicUrl(path);
  return data.publicUrl as string;
}

export async function createIdea(formData: FormData) {
  const supabase = createClient();
  const slug = String(formData.get("slug")).trim();

  const imageFile = formData.get("image") as File | null;
  const imageUrl = imageFile ? await uploadIdeaImage(supabase, slug, imageFile) : null;

  const { error } = await supabase.from("ideas").insert({
    slug,
    title: String(formData.get("title")).trim(),
    category_slug: String(formData.get("category_slug")),
    tag: String(formData.get("tag")).trim(),
    tag_color: String(formData.get("tag_color")),
    description: String(formData.get("description")).trim(),
    profit_potential: String(formData.get("profit_potential")),
    investment_range: String(formData.get("investment_range")).trim(),
    icon: String(formData.get("icon")).trim(),
    image_url: imageUrl,
    featured: formData.get("featured") === "on",
    content: String(formData.get("content")).trim(),
  });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/businesses");
  revalidatePath("/");
  redirect("/admin/businesses");
}

export async function updateIdea(originalSlug: string, formData: FormData) {
  const supabase = createClient();
  const slug = String(formData.get("slug")).trim();

  const imageFile = formData.get("image") as File | null;
  const newImageUrl = imageFile ? await uploadIdeaImage(supabase, slug, imageFile) : null;
  const existingImageUrl = String(formData.get("existing_image_url") || "").trim();
  const imageUrl = newImageUrl || (existingImageUrl ? existingImageUrl : null);

  const { error } = await supabase
    .from("ideas")
    .update({
      slug,
      title: String(formData.get("title")).trim(),
      category_slug: String(formData.get("category_slug")),
      tag: String(formData.get("tag")).trim(),
      tag_color: String(formData.get("tag_color")),
      description: String(formData.get("description")).trim(),
      profit_potential: String(formData.get("profit_potential")),
      investment_range: String(formData.get("investment_range")).trim(),
      icon: String(formData.get("icon")).trim(),
      image_url: imageUrl,
      featured: formData.get("featured") === "on",
      content: String(formData.get("content")).trim(),
    })
    .eq("slug", originalSlug);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/businesses");
  revalidatePath("/");
  redirect("/admin/businesses");
}

export async function deleteIdea(slug: string) {
  const supabase = createClient();
  const { error } = await supabase.from("ideas").delete().eq("slug", slug);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/businesses");
  revalidatePath("/");
}

// ---------- Admin users (allowlist registry) ----------

export async function addAdminUser(formData: FormData) {
  const supabase = createClient();
  const email = String(formData.get("email")).trim().toLowerCase();

  const { error } = await supabase.from("admin_users").insert({ email });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/users");
}

export async function removeAdminUser(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("admin_users").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/users");
}
