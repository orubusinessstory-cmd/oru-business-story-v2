-- ============================================================================
-- Automatic Daily Business Content System — one-time setup
-- Run this whole file once in Supabase Dashboard → SQL Editor → New query → Run.
-- It only ADDS things (new tables, a new column, new category rows). It does
-- not touch or delete any existing categories, ideas, videos, or users.
-- ============================================================================

-- 1. Mark which ideas were written by the automation, without changing
--    anything about how existing ideas are displayed. Also store Unsplash
--    photo attribution (null for manually-added ideas — no effect on them).
alter table public.ideas
  add column if not exists is_ai_generated boolean not null default false;

alter table public.ideas
  add column if not exists image_credit_name text;

alter table public.ideas
  add column if not exists image_credit_url text;

-- 2. Singleton settings row (always id = 1) that the Admin → Automation page
--    reads and writes.
create table if not exists public.automation_settings (
  id int primary key default 1,
  is_enabled boolean not null default false,
  publish_time text not null default '09:00',           -- HH:MM, IST, informational (see README)
  next_category_index int not null default 0,           -- which category from lib/automation/categories.ts is next
  last_run_at timestamptz,
  last_generated_title text,
  last_generated_slug text,
  last_generated_category text,
  last_status text,                                       -- 'success' | 'failed'
  last_error text,
  updated_at timestamptz not null default now(),
  constraint automation_settings_singleton check (id = 1)
);

insert into public.automation_settings (id)
values (1)
on conflict (id) do nothing;

-- 3. Log of every automation run (success, failed, or skipped), shown on the
--    Admin → Automation page.
create table if not exists public.automation_history (
  id uuid primary key default gen_random_uuid(),
  run_at timestamptz not null default now(),
  status text not null check (status in ('success', 'failed', 'skipped')),
  category_slug text,
  idea_title text,
  idea_slug text,
  error_message text
);

create index if not exists automation_history_run_at_idx on public.automation_history (run_at desc);

-- 4. Row Level Security — same pattern as your other admin-managed tables:
--    logged-in (authenticated) users get full access; the cron job itself
--    uses the service_role key, which bypasses RLS entirely.
alter table public.automation_settings enable row level security;
alter table public.automation_history enable row level security;

drop policy if exists "authenticated full access" on public.automation_settings;
create policy "authenticated full access" on public.automation_settings
  for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "authenticated full access" on public.automation_history;
create policy "authenticated full access" on public.automation_history
  for all
  to authenticated
  using (true)
  with check (true);

-- 5. The 12 categories the automation rotates through. If a category with
--    the same slug already exists in your `categories` table, it is left
--    exactly as-is (ON CONFLICT DO NOTHING) — nothing gets overwritten or
--    duplicated. Rename/merge any of these later from Admin → Categories if
--    you'd rather they match your existing category names.
insert into public.categories (slug, name, icon) values
  ('business-ideas',           'Business Ideas',            '💡'),
  ('low-investment-business',  'Low Investment Business',   '💰'),
  ('manufacturing',            'Manufacturing',             '🏭'),
  ('food-business',            'Food Business',             '🍽️'),
  ('shop-business',            'Shop Business',             '🏪'),
  ('service-business',         'Service Business',          '🛠️'),
  ('agriculture',              'Agriculture',                '🌾'),
  ('wholesale',                'Wholesale',                  '📦'),
  ('online-business',          'Online Business',            '💻'),
  ('home-business',            'Home Business',              '🏠'),
  ('trending-business',        'Trending Business',          '🔥'),
  ('business-guide',           'Business Guide',             '📘')
on conflict (slug) do nothing;
