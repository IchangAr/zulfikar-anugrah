-- ============================================
-- Setup Database Portfolio — jalankan di Supabase
-- Dashboard Supabase -> SQL Editor -> New Query -> paste semua ini -> Run
-- ============================================

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  tags text[] default '{}',
  thumbnail_url text,
  project_link text,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists experiences (
  id uuid primary key default gen_random_uuid(),
  position text not null,
  company text not null,
  period text not null,
  achievements text[] default '{}',
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Aktifkan Row Level Security
alter table projects enable row level security;
alter table experiences enable row level security;

-- Semua orang boleh membaca (untuk ditampilkan di portfolio publik)
drop policy if exists "public read projects" on projects;
create policy "public read projects" on projects
  for select using (true);

drop policy if exists "public read experiences" on experiences;
create policy "public read experiences" on experiences
  for select using (true);

-- Hanya user yang sudah login (kamu, lewat admin.html) yang boleh ubah data
drop policy if exists "auth manage projects" on projects;
create policy "auth manage projects" on projects
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "auth manage experiences" on experiences;
create policy "auth manage experiences" on experiences
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ============================================
-- Fitur Baru: Tambah array gambar di tabel projects
-- ============================================
alter table projects add column if not exists image_urls text[] default '{}';

-- ============================================
-- Tabel Certificates (Sertifikat)
-- ============================================
create table if not exists certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  image_url text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ============================================
-- Tabel Achievements (Pencapaian) — BARU
-- ============================================
create table if not exists achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  date text not null,
  description text,
  image_url text,
  image_urls text[] default '{}',
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ============================================
-- Tabel Profile (Profil Utama)
-- ============================================
create table if not exists profile (
  id uuid primary key default gen_random_uuid(),
  full_name text not null default 'Cank',
  role text not null default 'Full-Stack Developer',
  bio_short text default 'Membangun produk digital yang rapi, cepat, dan elegan.',
  bio_long text default 'Saya membangun aplikasi web dari sisi frontend hingga backend, dengan perhatian khusus pada pengalaman pengguna dan performa. Bagi saya, produk yang baik terasa dari cara ia merespons — cepat, halus, dan dapat diprediksi.',
  avatar_url text default '',
  cv_url text,  -- BARU: URL file CV yang diupload
  email text default 'hello@cank.dev',
  github_url text default '#',
  linkedin_url text default '#',
  whatsapp_url text default '#',
  updated_at timestamptz default now()
);

-- Masukkan data awal profil jika masih kosong
insert into profile (full_name, role) 
select 'Cank', 'Full-Stack Developer'
where not exists (select 1 from profile);

-- Aktifkan RLS
alter table certificates enable row level security;
alter table achievements enable row level security;
alter table profile enable row level security;

drop policy if exists "public read certificates" on certificates;
create policy "public read certificates" on certificates for select using (true);

drop policy if exists "public read achievements" on achievements;
create policy "public read achievements" on achievements for select using (true);

drop policy if exists "public read profile" on profile;
create policy "public read profile" on profile for select using (true);

drop policy if exists "auth manage certificates" on certificates;
create policy "auth manage certificates" on certificates for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "auth manage achievements" on achievements;
create policy "auth manage achievements" on achievements for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "auth manage profile" on profile;
create policy "auth manage profile" on profile for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ============================================
-- Setelah menjalankan ini, buat akun admin kamu:
-- Dashboard Supabase -> Authentication -> Users -> Add User
-- Isi email & password yang akan kamu pakai login di admin.html
-- ============================================

-- ============================================
-- Tabel Messages (Pesan Kontak)
-- ============================================
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

alter table messages enable row level security;

-- Siapa saja boleh mengirim pesan (insert) — untuk pengunjung portfolio
drop policy if exists "public insert messages" on messages;
create policy "public insert messages" on messages
  for insert with check (true);

-- Hanya user yang sudah login yang boleh membaca & mengelola pesan
drop policy if exists "auth read messages" on messages;
create policy "auth read messages" on messages
  for select using (auth.role() = 'authenticated');

drop policy if exists "auth manage messages" on messages;
create policy "auth manage messages" on messages
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ============================================
-- Setup Supabase Storage (Upload File)
-- ============================================
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

drop policy if exists "Public Access" on storage.objects;
create policy "Public Access" on storage.objects for select using ( bucket_id = 'portfolio' );

drop policy if exists "Auth Insert" on storage.objects;
create policy "Auth Insert" on storage.objects for insert with check ( bucket_id = 'portfolio' and auth.role() = 'authenticated' );

drop policy if exists "Auth Update" on storage.objects;
create policy "Auth Update" on storage.objects for update with check ( bucket_id = 'portfolio' and auth.role() = 'authenticated' );

drop policy if exists "Auth Delete" on storage.objects;
create policy "Auth Delete" on storage.objects for delete using ( bucket_id = 'portfolio' and auth.role() = 'authenticated' );
