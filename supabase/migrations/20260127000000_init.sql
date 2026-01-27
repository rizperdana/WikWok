-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES
create table if not exists public.profiles (
  id uuid references auth.users not null,
  username text unique,
  avatar_url text,
  updated_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id),
  constraint username_length check (char_length(username) >= 3)
);

alter table public.profiles enable row level security;

do $$ begin
  create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);
exception when duplicate_object then null; end $$;


-- LIKES
create table if not exists public.likes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  article_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, article_url)
);

alter table public.likes enable row level security;

do $$ begin create policy "Users can view all likes" on public.likes for select using (true); exception when duplicate_object then null; end $$;
do $$ begin create policy "Users can insert their own likes" on public.likes for insert with check (auth.uid() = user_id); exception when duplicate_object then null; end $$;
do $$ begin create policy "Users can delete their own likes" on public.likes for delete using (auth.uid() = user_id); exception when duplicate_object then null; end $$;


-- BOOKMARKS
create table if not exists public.bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  article_url text not null,
  article_title text not null,
  article_summary text,
  article_image text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, article_url)
);

alter table public.bookmarks enable row level security;

do $$ begin create policy "Users can view their own bookmarks" on public.bookmarks for select using (auth.uid() = user_id); exception when duplicate_object then null; end $$;
do $$ begin create policy "Users can insert their own bookmarks" on public.bookmarks for insert with check (auth.uid() = user_id); exception when duplicate_object then null; end $$;
do $$ begin create policy "Users can delete their own bookmarks" on public.bookmarks for delete using (auth.uid() = user_id); exception when duplicate_object then null; end $$;


-- COMMENTS
create table if not exists public.comments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  article_url text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.comments enable row level security;
do $$ begin create policy "Comments are public" on public.comments for select using (true); exception when duplicate_object then null; end $$;
do $$ begin create policy "Users can insert their own comments" on public.comments for insert with check (auth.uid() = user_id); exception when duplicate_object then null; end $$;


-- STREAKS
create table if not exists public.user_streaks (
  user_id uuid references public.profiles(id) primary key,
  current_streak int default 0,
  last_read_date date default CURRENT_DATE,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.user_streaks enable row level security;
do $$ begin create policy "Users can view own streak" on public.user_streaks for select using (auth.uid() = user_id); exception when duplicate_object then null; end $$;


-- ACHIEVEMENTS
create table if not exists public.achievements (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,
  name text not null,
  description text not null,
  icon_url text,
  requirement_type text not null,
  requirement_value int not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.achievements enable row level security;
do $$ begin create policy "Achievements are viewable by everyone" on public.achievements for select using (true); exception when duplicate_object then null; end $$;

create table if not exists public.user_achievements (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  achievement_id uuid references public.achievements(id) not null,
  unlocked_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, achievement_id)
);

alter table public.user_achievements enable row level security;
do $$ begin create policy "Users can view own achievements" on public.user_achievements for select using (auth.uid() = user_id); exception when duplicate_object then null; end $$;


-- UPDATES (Columns)
alter table public.user_streaks add column if not exists articles_read_count int default 0;
alter table public.user_streaks add column if not exists total_read_time_seconds int default 0;
alter table public.comments add column if not exists parent_id uuid references public.comments(id);
alter table public.comments add column if not exists depth int default 0;


-- COMMENT LIKES
create table if not exists public.comment_likes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  comment_id uuid references public.comments(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, comment_id)
);

alter table public.comment_likes enable row level security;
do $$ begin create policy "Users can view all comment likes" on public.comment_likes for select using (true); exception when duplicate_object then null; end $$;
do $$ begin create policy "Users can insert their own comment likes" on public.comment_likes for insert with check (auth.uid() = user_id); exception when duplicate_object then null; end $$;
do $$ begin create policy "Users can delete their own comment likes" on public.comment_likes for delete using (auth.uid() = user_id); exception when duplicate_object then null; end $$;


-- TRIGGERS
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger: check if exists first or drop
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- SHARES
create table if not exists public.shares (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id),
  article_url text not null,
  platform text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.shares enable row level security;
do $$ begin create policy "Shares are viewable by everyone" on public.shares for select using (true); exception when duplicate_object then null; end $$;
do $$ begin create policy "Users can insert shares" on public.shares for insert with check (true); exception when duplicate_object then null; end $$;
