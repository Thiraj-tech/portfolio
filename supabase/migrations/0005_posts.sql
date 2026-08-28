-- Blog posts: table, storage reuse, and RLS, following the same conventions
-- as 0003_projects.sql.
--
-- How to run this:
--   1. Supabase dashboard -> SQL Editor -> New query -> paste this whole
--      file -> Run. This creates the table and its RLS policies. It reuses
--      the existing `project-media` storage bucket (created by
--      0003_projects.sql) for cover images, under a `blog/` path prefix, so
--      no new bucket or storage policies are needed here.
--   2. Reuse the SAME admin account already created for the reviews
--      migration (Authentication -> Users) — one site owner, one admin
--      account for everything.
--   3. Copy that user's UUID and replace every occurrence of
--      '00000000-0000-0000-0000-000000000000' below with it — same
--      procedure as 0001_reviews.sql / 0003_projects.sql.
--
-- IMPORTANT: same rule as 0001/0003 — never use `auth.role() = 'authenticated'`
-- for admin checks. A visitor who signs in with Google elsewhere on this
-- site also becomes an "authenticated" Supabase Auth user. Always gate on
-- `auth.uid() = <admin-uuid>`.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------------

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  content text not null,
  cover_image_url text,
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists posts_status_published_idx
  on posts (status, published_at);

alter table posts enable row level security;

-- ---------------------------------------------------------------------------
-- Public read of published posts (powers /blog/ and /blog/<slug>/, fetched
-- at build time since the site is a static export).
-- ---------------------------------------------------------------------------

create policy "public can read published posts"
  on posts for select
  to anon, authenticated
  using (status = 'published');

-- ---------------------------------------------------------------------------
-- Admin-only writes — replace the placeholder UUID below (see step 3 above)
-- ---------------------------------------------------------------------------

create policy "admin can read all posts"
  on posts for select
  to authenticated
  using (auth.uid() = '00000000-0000-0000-0000-000000000000');

create policy "admin can insert posts"
  on posts for insert
  to authenticated
  with check (auth.uid() = '00000000-0000-0000-0000-000000000000');

create policy "admin can update posts"
  on posts for update
  to authenticated
  using (auth.uid() = '00000000-0000-0000-0000-000000000000')
  with check (auth.uid() = '00000000-0000-0000-0000-000000000000');

create policy "admin can delete posts"
  on posts for delete
  to authenticated
  using (auth.uid() = '00000000-0000-0000-0000-000000000000');
