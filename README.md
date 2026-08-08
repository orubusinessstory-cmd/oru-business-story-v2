# Oru Business Story

A Next.js (App Router) site built to match the approved home-screen design, with real
content across five categories: Food, Agriculture, Small Business, Online, and
Manufacturing.

## Running it

```
npm install
npm run dev
```

Then open http://localhost:3000

To deploy: push this to your GitHub repo and connect it in Vercel, same as your existing
setup.

## Structure

- `lib/data.ts` — all categories and business ideas live here as plain TypeScript data
  for now (15 ideas, 3 per category). This is the single place to add, edit, or remove
  content.
- `components/Layout.tsx` — shared Header, PageHero, BottomNav, and IdeaCard components
  used across every page, so the design stays consistent.
- `components/Icons.tsx` — all inline SVG icons.
- `app/page.tsx` — home page (hero, category chips, featured ideas).
- `app/categories/page.tsx` — list of all categories.
- `app/category/[slug]/page.tsx` — ideas within one category.
- `app/idea/[slug]/page.tsx` — full article page for one business idea.
- `app/favorites`, `app/resources`, `app/profile` — placeholder pages wired into the
  bottom nav, ready for you to build out.
- `app/globals.css` — every color, spacing, and component style from the approved design,
  as CSS custom properties and classes (no CSS framework, so it's easy to read and tweak).

## Moving content into Supabase

Right now all content is static in `lib/data.ts`, which is the fastest way to see the
real site working end to end. When you're ready to move to Supabase:

1. Create two tables: `categories` (slug, name, icon) and `ideas` (slug, title,
   category_slug, tag, tag_color, description, profit_potential, investment_range, icon,
   featured, article — article can be a `text[]` or one long text field).
2. Replace the functions at the bottom of `lib/data.ts`
   (`getIdeasByCategory`, `getFeaturedIdeas`, `getIdeaBySlug`, `getCategoryBySlug`) with
   calls to the Supabase client instead of filtering the local array — the page files
   (`app/page.tsx`, `app/category/[slug]/page.tsx`, etc.) don't need to change at all,
   since they just call those functions.
3. Double check Row Level Security policies allow public `select` on both tables, since
   that's what caused the empty-data issue on the earlier version of this site.
