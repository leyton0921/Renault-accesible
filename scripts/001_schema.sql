create extension if not exists "pgcrypto";create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  icon text not null default 'HelpCircle',
  display_order integer not null default 0,
  status boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists videos (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete set null,
  title text not null,
  description text,
  video_url text,
  thumbnail_url text,
  duration text,
  display_order integer not null default 0,
  status boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists videos_category_id_idx on videos(category_id);
alter table categories enable row level security;
alter table videos enable row level security;

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy if not exists "Lectura pública de archivos media" on storage.objects for select using (bucket_id = 'media');

