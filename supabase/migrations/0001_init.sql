-- Merlin: Diagrams table + RLS + trigger
-- Run this in your Supabase SQL editor or via supabase db push

create table public.diagrams (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null default 'Untitled diagram',
  code        text not null default '',
  theme       text not null default 'default',
  is_public   boolean not null default false,
  share_slug  text unique,               -- nullable; generated only when first shared
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index diagrams_user_id_idx on public.diagrams(user_id);
create unique index diagrams_share_slug_idx on public.diagrams(share_slug) where share_slug is not null;

-- Row Level Security
alter table public.diagrams enable row level security;

create policy "Users can CRUD their own diagrams"
  on public.diagrams for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Anyone can read a publicly shared diagram"
  on public.diagrams for select
  using (is_public = true);

-- keep updated_at fresh
create function public.set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger diagrams_set_updated_at
  before update on public.diagrams
  for each row execute procedure public.set_updated_at();
