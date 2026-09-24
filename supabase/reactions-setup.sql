-- ============================================================================
-- Like / Dislike / Comments — one-time setup
-- Run this whole file once in Supabase Dashboard → SQL Editor → New query → Run.
-- Adds two new tables only — nothing existing is touched.
-- Both features require the visitor to be signed in (the same login system
-- already used for Favorites/Profile).
-- ============================================================================

create table if not exists public.idea_reactions (
  id uuid primary key default gen_random_uuid(),
  idea_slug text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  reaction text not null check (reaction in ('like', 'dislike')),
  created_at timestamptz not null default now(),
  unique (idea_slug, user_id)
);

create index if not exists idea_reactions_slug_idx on public.idea_reactions (idea_slug);

alter table public.idea_reactions enable row level security;

drop policy if exists "public can read reactions" on public.idea_reactions;
create policy "public can read reactions" on public.idea_reactions
  for select
  to public
  using (true);

drop policy if exists "users manage own reaction" on public.idea_reactions;
create policy "users manage own reaction" on public.idea_reactions
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


create table if not exists public.idea_comments (
  id uuid primary key default gen_random_uuid(),
  idea_slug text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  author_name text not null,
  comment_text text not null,
  created_at timestamptz not null default now()
);

create index if not exists idea_comments_slug_idx on public.idea_comments (idea_slug);

alter table public.idea_comments enable row level security;

drop policy if exists "public can read comments" on public.idea_comments;
create policy "public can read comments" on public.idea_comments
  for select
  to public
  using (true);

drop policy if exists "authenticated can insert own comment" on public.idea_comments;
create policy "authenticated can insert own comment" on public.idea_comments
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "users delete own comment" on public.idea_comments;
create policy "users delete own comment" on public.idea_comments
  for delete
  to authenticated
  using (auth.uid() = user_id);
