-- LinkingLink Base Schema
-- NOTE: When using Supabase Auth, user identities live in auth.users. You can create a profile table referencing auth.users.id.
-- If you choose to keep a separate Users table, do NOT store password hashes manually; rely on Supabase.

-- Enable required extensions (Supabase typically has these)
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- Users Profile (optional if you need extra metadata)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz default now()
);

-- Friends
create table if not exists friends (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references auth.users(id) on delete cascade,
  receiver_id uuid references auth.users(id) on delete cascade,
  status text check (status in ('pending','accepted','declined')) default 'pending',
  created_at timestamptz default now(),
  unique(sender_id, receiver_id)
);

-- Posts
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);
create index if not exists idx_posts_user_id on posts(user_id);

-- Comments
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  content text,
  created_at timestamptz default now()
);
create index if not exists idx_comments_post_id on comments(post_id);

-- Likes
create table if not exists likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  unique(post_id, user_id)
);

-- Notes (fileUrl points to Supabase Storage public or signed URL)
create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  subject text,
  file_url text,
  created_at timestamptz default now()
);

-- Progress (study tracking)
create table if not exists progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  date date,
  hours int,
  topic text,
  score int,
  created_at timestamptz default now()
);
create index if not exists idx_progress_user_date on progress(user_id, date);

-- Messages (1:1 chat)
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references auth.users(id) on delete cascade,
  receiver_id uuid references auth.users(id) on delete cascade,
  content text,
  created_at timestamptz default now()
);
create index if not exists idx_messages_pair_time on messages(sender_id, receiver_id, created_at);

-- Message read tracking (per conversation peer)
create table if not exists message_reads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  peer_id uuid references auth.users(id) on delete cascade,
  last_read_at timestamptz default now(),
  unique(user_id, peer_id)
);

-- Presence (ephemeral; can be truncated periodically)
create table if not exists presence (
  user_id uuid primary key references auth.users(id) on delete cascade,
  last_seen_at timestamptz default now(),
  status text check (status in ('online','offline')) default 'online'
);

-- Basic RLS enabling (adjust policies as needed)
alter table profiles enable row level security;
alter table friends enable row level security;
alter table posts enable row level security;
alter table comments enable row level security;
alter table likes enable row level security;
alter table notes enable row level security;
alter table progress enable row level security;
alter table messages enable row level security;

-- Example policies (simplified)
create policy "Allow read all posts" on posts for select using (true);
create policy "Allow users insert own posts" on posts for insert with check (auth.uid() = user_id);
create policy "Allow users modify own posts" on posts for update using (auth.uid() = user_id);
create policy "Allow users delete own posts" on posts for delete using (auth.uid() = user_id);

-- Repeat similar policies for other tables as needed.
