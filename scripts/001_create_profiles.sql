-- Kullanici profilleri tablosu
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  full_name text,
  avatar_url text,
  level integer default 1,
  xp integer default 0,
  completed_labs integer default 0,
  badges text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS aktif et
alter table public.profiles enable row level security;

-- RLS politikalari
create policy "Herkes profilleri gorebilir" on public.profiles for select using (true);
create policy "Kullanicilar kendi profilini ekleyebilir" on public.profiles for insert with check (auth.uid() = id);
create policy "Kullanicilar kendi profilini guncelleyebilir" on public.profiles for update using (auth.uid() = id);
create policy "Kullanicilar kendi profilini silebilir" on public.profiles for delete using (auth.uid() = id);

-- Yeni kullanici kayit oldugunda otomatik profil olustur
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', null),
    coalesce(new.raw_user_meta_data ->> 'full_name', null),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', null)
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Trigger olustur
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
