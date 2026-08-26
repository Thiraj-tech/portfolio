-- Review collection system: tables, security-definer functions, and RLS.
--
-- How to run this:
--   1. Supabase dashboard -> SQL Editor -> New query -> paste this whole
--      file -> Run.
--   2. Create your one admin account: Authentication -> Users -> Add user
--      (email + password, whatever you'll log into /admin with).
--   3. Click that user, copy its UUID, and replace every occurrence of
--      '00000000-0000-0000-0000-000000000000' below with it, then re-run
--      just the four "admin can ..." policy statements at the bottom
--      (drop + recreate them, or edit before the first run).
--
-- IMPORTANT: the placeholder UUID checks below are not optional — do not
-- use `auth.role() = 'authenticated'` for admin checks anywhere in this
-- file. A reviewer who optionally signs in with Google to autofill their
-- name/photo also becomes an "authenticated" Supabase Auth user, exactly
-- like the admin login. Checking only `authenticated` would let any
-- Google-signed-in reviewer generate links or approve/reject reviews.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists review_requests (
  id uuid primary key default gen_random_uuid(),
  client_name text,
  created_at timestamptz not null default now(),
  used_at timestamptz
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references review_requests(id) on delete cascade,
  name text not null,
  avatar_url text,
  country text,
  quote text not null,
  rating smallint not null check (rating between 1 and 5),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  google_sub text,
  created_at timestamptz not null default now()
);

create index if not exists reviews_status_created_idx
  on reviews (status, created_at desc);

alter table review_requests enable row level security;
alter table reviews enable row level security;

-- No direct SELECT/INSERT grants to anon/authenticated on either table for
-- the public-facing flow — every public interaction goes through the two
-- SECURITY DEFINER functions below. This matters because the anon key is
-- public (baked into the site's JS bundle): a raw SELECT grant on
-- review_requests would let anyone enumerate every client name + token,
-- and a raw INSERT grant on reviews would let anyone insert a fake
-- pre-approved review.

-- ---------------------------------------------------------------------------
-- Public-facing functions (anon + authenticated can call these via
-- supabase.rpc(...) from the browser)
-- ---------------------------------------------------------------------------

create or replace function get_review_request(p_token uuid)
returns table (id uuid, client_name text)
language sql
security definer
set search_path = public
as $$
  select id, client_name
  from review_requests
  where id = p_token
    and used_at is null;
$$;

revoke all on function get_review_request(uuid) from public;
grant execute on function get_review_request(uuid) to anon, authenticated;

create or replace function submit_review(
  p_token uuid,
  p_name text,
  p_avatar_url text,
  p_country text,
  p_quote text,
  p_rating smallint,
  p_google_sub text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_review_id uuid;
begin
  if not exists (
    select 1 from review_requests where id = p_token and used_at is null
  ) then
    raise exception 'invalid or already-used review link';
  end if;

  insert into reviews (request_id, name, avatar_url, country, quote, rating, google_sub, status)
  values (p_token, p_name, p_avatar_url, p_country, p_quote, p_rating, p_google_sub, 'pending')
  returning id into v_review_id;

  update review_requests set used_at = now() where id = p_token;

  return v_review_id;
end;
$$;

revoke all on function submit_review(uuid, text, text, text, text, smallint, text) from public;
grant execute on function submit_review(uuid, text, text, text, text, smallint, text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Public read of approved reviews (powers the live Testimonials section)
-- ---------------------------------------------------------------------------

create policy "public can read approved reviews"
  on reviews for select
  to anon, authenticated
  using (status = 'approved');

-- ---------------------------------------------------------------------------
-- Admin-only access — replace the placeholder UUID below (see step 3 above)
-- ---------------------------------------------------------------------------

create policy "admin can read all reviews"
  on reviews for select
  to authenticated
  using (auth.uid() = '00000000-0000-0000-0000-000000000000');

create policy "admin can update review status"
  on reviews for update
  to authenticated
  using (auth.uid() = '00000000-0000-0000-0000-000000000000')
  with check (auth.uid() = '00000000-0000-0000-0000-000000000000');

create policy "admin can read review requests"
  on review_requests for select
  to authenticated
  using (auth.uid() = '00000000-0000-0000-0000-000000000000');

create policy "admin can create review requests"
  on review_requests for insert
  to authenticated
  with check (auth.uid() = '00000000-0000-0000-0000-000000000000');
