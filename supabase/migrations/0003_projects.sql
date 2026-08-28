-- Projects: table, storage bucket, and RLS, following the same conventions
-- as 0001_reviews.sql.
--
-- How to run this:
--   1. Supabase dashboard -> SQL Editor -> New query -> paste this whole
--      file -> Run. This creates the table, RLS policies, the storage
--      bucket, and its storage policies in one go.
--   2. Reuse the SAME admin account already created for the reviews
--      migration (Authentication -> Users) — one site owner, one admin
--      account for everything.
--   3. Copy that user's UUID and replace every occurrence of
--      '00000000-0000-0000-0000-000000000000' below with it, then re-run
--      just the "admin can ..." policy statements (drop + recreate, or
--      edit before the first run) — same procedure as 0001_reviews.sql.
--
-- IMPORTANT: same rule as 0001 — never use `auth.role() = 'authenticated'`
-- for admin checks. A visitor who signs in with Google elsewhere on this
-- site also becomes an "authenticated" Supabase Auth user. Always gate on
-- `auth.uid() = <admin-uuid>`.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------------

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  details text,
  client_name text,
  client_info text,
  engagement text not null default 'Freelance',
  tags text[] not null default '{}',
  cover_image_url text,
  gallery_urls text[] not null default '{}',
  video_url text,
  display_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now()
);

create index if not exists projects_status_order_idx
  on projects (status, display_order);

alter table projects enable row level security;

-- ---------------------------------------------------------------------------
-- Public read of published projects (powers the live Projects carousel and
-- the /projects/?slug= detail page). No security-definer functions needed —
-- unlike reviews there is no anonymous-submission flow to protect against;
-- the only writes are admin writes, gated below.
-- ---------------------------------------------------------------------------

create policy "public can read published projects"
  on projects for select
  to anon, authenticated
  using (status = 'published');

-- ---------------------------------------------------------------------------
-- Admin-only writes — replace the placeholder UUID below (see step 3 above)
-- ---------------------------------------------------------------------------

create policy "admin can read all projects"
  on projects for select
  to authenticated
  using (auth.uid() = '00000000-0000-0000-0000-000000000000');

create policy "admin can insert projects"
  on projects for insert
  to authenticated
  with check (auth.uid() = '00000000-0000-0000-0000-000000000000');

create policy "admin can update projects"
  on projects for update
  to authenticated
  using (auth.uid() = '00000000-0000-0000-0000-000000000000')
  with check (auth.uid() = '00000000-0000-0000-0000-000000000000');

create policy "admin can delete projects"
  on projects for delete
  to authenticated
  using (auth.uid() = '00000000-0000-0000-0000-000000000000');

-- ---------------------------------------------------------------------------
-- Storage bucket for cover images / gallery images / video files
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('project-media', 'project-media', true)
on conflict (id) do nothing;

create policy "public can read project media"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'project-media');

create policy "admin can upload project media"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'project-media'
    and auth.uid() = '00000000-0000-0000-0000-000000000000'
  );

create policy "admin can update project media"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'project-media'
    and auth.uid() = '00000000-0000-0000-0000-000000000000'
  )
  with check (
    bucket_id = 'project-media'
    and auth.uid() = '00000000-0000-0000-0000-000000000000'
  );

create policy "admin can delete project media"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'project-media'
    and auth.uid() = '00000000-0000-0000-0000-000000000000'
  );

