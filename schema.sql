-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES
create table public.profiles (
  id uuid references auth.users not null,
  username text unique,
  avatar_url text,
  updated_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id),
  constraint username_length check (char_length(username) >= 3)
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- LIKES
create table public.likes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  article_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, article_url)
);

alter table public.likes enable row level security;

create policy "Users can view all likes" on public.likes for select using (true);
create policy "Users can insert their own likes" on public.likes for insert with check (auth.uid() = user_id);
create policy "Users can delete their own likes" on public.likes for delete using (auth.uid() = user_id);

-- BOOKMARKS
create table public.bookmarks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  article_url text not null,
  article_title text not null,
  article_summary text,
  article_image text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, article_url)
);

alter table public.bookmarks enable row level security;

create policy "Users can view their own bookmarks" on public.bookmarks for select using (auth.uid() = user_id);
create policy "Users can insert their own bookmarks" on public.bookmarks for insert with check (auth.uid() = user_id);
create policy "Users can delete their own bookmarks" on public.bookmarks for delete using (auth.uid() = user_id);

-- COMMENTS
create table public.comments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  article_url text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.comments enable row level security;
create policy "Comments are public" on public.comments for select using (true);
create policy "Users can insert their own comments" on public.comments for insert with check (auth.uid() = user_id);

-- STREAKS
create table public.user_streaks (
  user_id uuid references public.profiles(id) primary key,
  current_streak int default 0,
  last_read_date date default CURRENT_DATE,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.user_streaks enable row level security;
create policy "Users can view own streak" on public.user_streaks for select using (auth.uid() = user_id);
