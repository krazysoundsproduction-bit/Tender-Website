-- Company logos for jobs/tenders and admin profile logo support.

ALTER TABLE tenders
  ADD COLUMN IF NOT EXISTS company_logo_url TEXT;

ALTER TABLE job_vacancies
  ADD COLUMN IF NOT EXISTS company_logo_url TEXT;

ALTER TABLE tender_submissions
  ADD COLUMN IF NOT EXISTS company_logo_url TEXT;

ALTER TABLE job_submissions
  ADD COLUMN IF NOT EXISTS company_logo_url TEXT;

CREATE TABLE IF NOT EXISTS admin_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  logo_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_profiles_select_own_admin" ON admin_profiles;
DROP POLICY IF EXISTS "admin_profiles_insert_own_admin" ON admin_profiles;
DROP POLICY IF EXISTS "admin_profiles_update_own_admin" ON admin_profiles;

CREATE POLICY "admin_profiles_select_own_admin" ON admin_profiles
  FOR SELECT USING (public.is_admin() AND auth.uid() = user_id);

CREATE POLICY "admin_profiles_insert_own_admin" ON admin_profiles
  FOR INSERT WITH CHECK (public.is_admin() AND auth.uid() = user_id);

CREATE POLICY "admin_profiles_update_own_admin" ON admin_profiles
  FOR UPDATE USING (public.is_admin() AND auth.uid() = user_id)
  WITH CHECK (public.is_admin() AND auth.uid() = user_id);

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'company-logos',
  'company-logos',
  true,
  5242880,
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "company_logos_public_read" ON storage.objects;
DROP POLICY IF EXISTS "company_logos_public_insert" ON storage.objects;
DROP POLICY IF EXISTS "company_logos_authenticated_update" ON storage.objects;
DROP POLICY IF EXISTS "company_logos_authenticated_delete" ON storage.objects;

CREATE POLICY "company_logos_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'company-logos');

CREATE POLICY "company_logos_public_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'company-logos');

CREATE POLICY "company_logos_authenticated_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'company-logos' AND auth.role() = 'authenticated')
  WITH CHECK (bucket_id = 'company-logos' AND auth.role() = 'authenticated');

CREATE POLICY "company_logos_authenticated_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'company-logos' AND auth.role() = 'authenticated');
