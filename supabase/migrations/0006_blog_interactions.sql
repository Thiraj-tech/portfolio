-- Blog post likes and comments.
--
-- How to run this:
--   1. Supabase dashboard -> SQL Editor -> New query -> paste this whole
--      file -> Run.
--   2. Reuse the SAME admin account already created for the reviews
--      migration (Authentication -> Users) — one site owner, one admin
--      account for everything.
--   3. Copy that user's UUID and replace every occurrence of
--      '00000000-0000-0000-0000-000000000000' below with it — same
--      procedure as 0001_reviews.sql / 0003_projects.sql / 0005_posts.sql.
--
-- Comments are instant-publish (no approval queue) — the admin policies
-- below exist so a bad comment can still be hidden (status -> 'rejected')
-- or deleted after the fact, from the Supabase dashboard's table editor.
--
-- IMPORTANT: same rule as every other migration in this project — never use
-- `auth.role() = 'authenticated'` for admin checks. Always gate on
-- `auth.uid() = <admin-uuid>`.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists post_likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  visitor_id uuid not null,
  created_at timestamptz not null default now(),
  unique (post_id, visitor_id)
);

create table if not exists post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  name text not null,
  avatar_url text,
  content text not null,
  status text not null default 'approved' check (status in ('approved', 'rejected')),
  google_sub text,
  created_at timestamptz not null default now()
);

create index if not exists post_likes_post_idx on post_likes (post_id);
create index if not exists post_comments_post_created_idx
  on post_comments (post_id, created_at desc);

alter table post_likes enable row level security;
alter table post_comments enable row level security;

-- ---------------------------------------------------------------------------
-- Likes — no direct table grants to anon at all (same reasoning as the
-- reviews migration: the anon key is public, so a raw grant would let
-- anyone enumerate visitor_ids or forge/delete arbitrary rows). Every public
-- interaction goes through these two SECURITY DEFINER functions instead.
-- ---------------------------------------------------------------------------

create or replace function get_post_like_state(p_post_id uuid, p_visitor_id uuid)
returns table (like_count int, liked boolean)
language sql
security definer
set search_path = public
as $$
  select
    (select count(*) from post_likes where post_id = p_post_id)::int,
    exists (
      select 1 from post_likes
      where post_id = p_post_id and visitor_id = p_visitor_id
    );
$$;

revoke all on function get_post_like_state(uuid, uuid) from public;
grant execute on function get_post_like_state(uuid, uuid) to anon, authenticated;

create or replace function toggle_post_like(p_post_id uuid, p_visitor_id uuid)
returns table (like_count int, liked boolean)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from posts where id = p_post_id and status = 'published') then
    raise exception 'post not found';
  end if;

  if exists (
    select 1 from post_likes
    where post_id = p_post_id and visitor_id = p_visitor_id
  ) then
    delete from post_likes where post_id = p_post_id and visitor_id = p_visitor_id;
  else
    insert into post_likes (post_id, visitor_id) values (p_post_id, p_visitor_id);
  end if;

  return query select * from get_post_like_state(p_post_id, p_visitor_id);
end;
$$;

revoke all on function toggle_post_like(uuid, uuid) from public;
grant execute on function toggle_post_like(uuid, uuid) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Comments — instant publish, so (unlike likes/reviews) a direct RLS insert
-- policy is fine: there's no privileged bypass to protect (no pending
-- status to fake), just plain-column checks.
-- ---------------------------------------------------------------------------

create policy "public can read approved comments"
  on post_comments for select
  to anon, authenticated
  using (status = 'approved');

create policy "public can insert comments on published posts"
  on post_comments for insert
  to anon, authenticated
  with check (
    status = 'approved'
    and char_length(name) between 1 and 100
    and char_length(content) between 1 and 2000
    and exists (select 1 from posts where id = post_id and status = 'published')
  );

-- ---------------------------------------------------------------------------
-- Admin-only access — replace the placeholder UUID below (see step 3 above)
-- ---------------------------------------------------------------------------

create policy "admin can read all comments"
  on post_comments for select
  to authenticated
  using (auth.uid() = '00000000-0000-0000-0000-000000000000');

create policy "admin can update comments"
  on post_comments for update
  to authenticated
  using (auth.uid() = '00000000-0000-0000-0000-000000000000')
  with check (auth.uid() = '00000000-0000-0000-0000-000000000000');

create policy "admin can delete comments"
  on post_comments for delete
  to authenticated
  using (auth.uid() = '00000000-0000-0000-0000-000000000000');
