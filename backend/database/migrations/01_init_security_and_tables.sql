-- 01_init_security_and_tables.sql
-- Inisialisasi skema tabel profiles di Supabase dengan keamanan tingkat baris (Row Level Security)

-- 1. Membuat tabel profiles jika belum ada
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    company TEXT,
    phone TEXT,
    address TEXT,
    tech_stack_preference TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Mengaktifkan Row Level Security (RLS) pada tabel profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Membuat kebijakan keamanan (Security Policies)
-- Kebijakan: Pengguna dapat membaca profil mereka sendiri
CREATE POLICY "Pengguna dapat melihat profil sendiri" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Kebijakan: Pengguna dapat memperbarui profil mereka sendiri
CREATE POLICY "Pengguna dapat memperbarui profil sendiri" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
