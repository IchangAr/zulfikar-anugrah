-- ============================================
-- Migrasi ke Multi-User Portfolio
-- Jalankan skrip ini di Supabase Dashboard -> SQL Editor
-- ============================================

-- 1. Tambahkan kolom user_id ke semua tabel
alter table projects add column if not exists user_id uuid references auth.users(id) default auth.uid();
alter table experiences add column if not exists user_id uuid references auth.users(id) default auth.uid();
alter table certificates add column if not exists user_id uuid references auth.users(id) default auth.uid();
alter table achievements add column if not exists user_id uuid references auth.users(id) default auth.uid();
-- Pastikan tabel messages ada sebelum diubah
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);
alter table messages enable row level security;

alter table profile add column if not exists user_id uuid references auth.users(id) default auth.uid();
alter table messages add column if not exists user_id uuid references auth.users(id); -- No default, we will insert based on profile ID or just leave it for the targeted user

-- 2. Tambahkan kolom username ke tabel profile (untuk keperluan VITE_PORTFOLIO_USERNAME)
alter table profile add column if not exists username text unique;

-- 3. Hapus policy lama yang hanya membatasi "authenticated" tanpa cek kepemilikan
drop policy if exists "auth manage projects" on projects;
drop policy if exists "auth manage experiences" on experiences;
drop policy if exists "auth manage certificates" on certificates;
drop policy if exists "auth manage achievements" on achievements;
drop policy if exists "auth manage profile" on profile;
drop policy if exists "auth manage messages" on messages;

-- 4. Buat policy baru yang membatasi aksi berdasarkan user_id (Multi-tenant)
-- PROJECTS
create policy "auth manage projects" on projects
  for all using (auth.role() = 'authenticated' and user_id = auth.uid())
  with check (auth.role() = 'authenticated' and user_id = auth.uid());

-- EXPERIENCES
create policy "auth manage experiences" on experiences
  for all using (auth.role() = 'authenticated' and user_id = auth.uid())
  with check (auth.role() = 'authenticated' and user_id = auth.uid());

-- CERTIFICATES
create policy "auth manage certificates" on certificates
  for all using (auth.role() = 'authenticated' and user_id = auth.uid())
  with check (auth.role() = 'authenticated' and user_id = auth.uid());

-- ACHIEVEMENTS
create policy "auth manage achievements" on achievements
  for all using (auth.role() = 'authenticated' and user_id = auth.uid())
  with check (auth.role() = 'authenticated' and user_id = auth.uid());

-- PROFILE
create policy "auth manage profile" on profile
  for all using (auth.role() = 'authenticated' and user_id = auth.uid())
  with check (auth.role() = 'authenticated' and user_id = auth.uid());

-- MESSAGES (Pesan masuk ke user_id tertentu)
create policy "auth manage messages" on messages
  for all using (auth.role() = 'authenticated' and user_id = auth.uid())
  with check (auth.role() = 'authenticated' and user_id = auth.uid());

-- 5. Update data lama (Jika ada)
-- Skrip ini akan mengaitkan data lama yang user_id nya null ke user pertama yang ada di tabel auth.users
DO $$
DECLARE
  first_user_id uuid;
BEGIN
  SELECT id INTO first_user_id FROM auth.users ORDER BY created_at ASC LIMIT 1;
  IF first_user_id IS NOT NULL THEN
    UPDATE projects SET user_id = first_user_id WHERE user_id IS NULL;
    UPDATE experiences SET user_id = first_user_id WHERE user_id IS NULL;
    UPDATE certificates SET user_id = first_user_id WHERE user_id IS NULL;
    UPDATE achievements SET user_id = first_user_id WHERE user_id IS NULL;
    UPDATE profile SET user_id = first_user_id WHERE user_id IS NULL;
    UPDATE messages SET user_id = first_user_id WHERE user_id IS NULL;
  END IF;
END $$;

-- Catatan Penting:
-- Setelah migrasi ini, pastikan Anda masuk ke Supabase Dashboard, lalu edit baris di tabel `profile`
-- milik Anda dan isi kolom `username` dengan username Anda (misalnya: "iccank").
-- Hal ini karena kolom `username` baru ditambahkan dan belum ada isinya.
