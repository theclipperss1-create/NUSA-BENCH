-- 02_auth_google_trigger.sql
-- Menghubungkan registrasi Auth Supabase / Google OAuth ke tabel profiles secara otomatis

-- 1. Membuat fungsi trigger untuk menyinkronkan pengguna baru
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, client_name, email, company, tech_stack_preference)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        new.email,
        new.raw_user_meta_data->>'company',
        'Not Specified'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Membuat trigger pada tabel auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
