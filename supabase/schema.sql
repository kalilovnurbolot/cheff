-- ============================================================
-- Cheff — Supabase schema
-- Запусти в: Supabase Dashboard → SQL Editor → Run
-- ============================================================

create extension if not exists "uuid-ossp";

-- ── profiles ─────────────────────────────────────────────────
create table if not exists public.profiles (
  id            uuid primary key default uuid_generate_v4(),
  google_id     text unique not null,
  username      text,
  full_name     text,
  avatar_url    text,
  email         text,
  bio           text default '',
  followers_count int default 0,
  following_count int default 0,
  created_at    timestamptz default now()
);

-- ── locations ────────────────────────────────────────────────
create table if not exists public.locations (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references public.profiles(id) on delete cascade,
  business_name text,
  address       text,
  phone         text,
  hours         text,
  website       text,
  lat           double precision,
  lng           double precision,
  category      text default 'Ресторан',
  created_at    timestamptz default now()
);

-- ── recipes ──────────────────────────────────────────────────
create table if not exists public.recipes (
  id            uuid primary key default uuid_generate_v4(),
  author_id     uuid references public.profiles(id) on delete cascade,
  title         text not null,
  description   text default '',
  image_url     text,
  cook_time     text,
  difficulty    text default 'Средне',
  servings      int default 4,
  tags          text[] default '{}',
  ingredients   text[] default '{}',
  steps         jsonb default '[]',
  likes_count   int default 0,
  rating        numeric default 0,
  rating_count  int default 0,
  location_id   uuid references public.locations(id),
  created_at    timestamptz default now()
);

-- ── likes ────────────────────────────────────────────────────
create table if not exists public.likes (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references public.profiles(id) on delete cascade,
  recipe_id     uuid references public.recipes(id) on delete cascade,
  created_at    timestamptz default now(),
  unique(user_id, recipe_id)
);

-- ── saved ────────────────────────────────────────────────────
create table if not exists public.saved (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references public.profiles(id) on delete cascade,
  recipe_id     uuid references public.recipes(id) on delete cascade,
  saved_at      timestamptz default now(),
  unique(user_id, recipe_id)
);

-- ── comments ─────────────────────────────────────────────────
create table if not exists public.comments (
  id            uuid primary key default uuid_generate_v4(),
  recipe_id     uuid references public.recipes(id) on delete cascade,
  author_id     uuid references public.profiles(id) on delete cascade,
  parent_id     uuid references public.comments(id),
  text          text not null,
  likes_count   int default 0,
  created_at    timestamptz default now()
);

-- ── comment_likes ────────────────────────────────────────────
create table if not exists public.comment_likes (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references public.profiles(id) on delete cascade,
  comment_id    uuid references public.comments(id) on delete cascade,
  unique(user_id, comment_id)
);

-- ── notifications ────────────────────────────────────────────
create table if not exists public.notifications (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references public.profiles(id) on delete cascade,
  type          text not null,
  from_user_id  uuid references public.profiles(id),
  recipe_id     uuid references public.recipes(id),
  text          text,
  read          boolean default false,
  created_at    timestamptz default now()
);

-- ── follows ──────────────────────────────────────────────────
create table if not exists public.follows (
  id            uuid primary key default uuid_generate_v4(),
  follower_id   uuid references public.profiles(id) on delete cascade,
  following_id  uuid references public.profiles(id) on delete cascade,
  created_at    timestamptz default now(),
  unique(follower_id, following_id)
);

-- ── RLS: enable ──────────────────────────────────────────────
alter table public.profiles       enable row level security;
alter table public.recipes        enable row level security;
alter table public.likes          enable row level security;
alter table public.saved          enable row level security;
alter table public.comments       enable row level security;
alter table public.comment_likes  enable row level security;
alter table public.locations      enable row level security;
alter table public.notifications  enable row level security;
alter table public.follows        enable row level security;

-- ── RLS: policies (open для MVP, закроешь позже) ─────────────
do $$ declare t text; begin
  foreach t in array array[
    'profiles','recipes','likes','saved','comments',
    'comment_likes','locations','notifications','follows'
  ] loop
    execute format('create policy "read_all"  on public.%I for select using (true)', t);
    execute format('create policy "write_all" on public.%I for all    using (true) with check (true)', t);
  end loop;
end $$;

-- ── Realtime: включи для нужных таблиц ───────────────────────
alter publication supabase_realtime add table public.comments;
alter publication supabase_realtime add table public.likes;
alter publication supabase_realtime add table public.notifications;

-- ── SQL helper functions ──────────────────────────────────────────────────────
create or replace function increment_likes(recipe_id uuid)
returns void language sql as $$
  update recipes set likes_count = likes_count + 1 where id = recipe_id;
$$;

create or replace function decrement_likes(recipe_id uuid)
returns void language sql as $$
  update recipes set likes_count = greatest(0, likes_count - 1) where id = recipe_id;
$$;

create or replace function increment_comment_likes(comment_id uuid)
returns void language sql as $$
  update comments set likes_count = likes_count + 1 where id = comment_id;
$$;

create or replace function decrement_comment_likes(comment_id uuid)
returns void language sql as $$
  update comments set likes_count = greatest(0, likes_count - 1) where id = comment_id;
$$;
