-- Strengthen admin authorization and add public submission workflow.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

-- Tighten existing listing policies from authenticated -> admin role.
DROP POLICY IF EXISTS "tenders_insert_authenticated" ON tenders;
DROP POLICY IF EXISTS "tenders_update_authenticated" ON tenders;
DROP POLICY IF EXISTS "tenders_delete_authenticated" ON tenders;

CREATE POLICY "tenders_insert_admin" ON tenders
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "tenders_update_admin" ON tenders
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "tenders_delete_admin" ON tenders
  FOR DELETE USING (public.is_admin());

DROP POLICY IF EXISTS "jobs_insert_authenticated" ON job_vacancies;
DROP POLICY IF EXISTS "jobs_update_authenticated" ON job_vacancies;
DROP POLICY IF EXISTS "jobs_delete_authenticated" ON job_vacancies;

CREATE POLICY "jobs_insert_admin" ON job_vacancies
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "jobs_update_admin" ON job_vacancies
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "jobs_delete_admin" ON job_vacancies
  FOR DELETE USING (public.is_admin());

CREATE TABLE IF NOT EXISTS tender_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submitter_name TEXT NOT NULL,
  submitter_email TEXT NOT NULL,
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  closing_date TIMESTAMPTZ NOT NULL,
  description TEXT NOT NULL,
  document_url TEXT,
  source_url TEXT,
  review_notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID,
  created_tender_id UUID REFERENCES tenders(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS job_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submitter_name TEXT NOT NULL,
  submitter_email TEXT NOT NULL,
  job_title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  job_type job_type NOT NULL DEFAULT 'Full-time',
  location TEXT NOT NULL,
  closing_date TIMESTAMPTZ NOT NULL,
  description_and_requirements TEXT NOT NULL,
  application_email_or_link TEXT NOT NULL,
  source_url TEXT,
  review_notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID,
  created_job_id UUID REFERENCES job_vacancies(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tender_submissions_status_created
  ON tender_submissions(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_job_submissions_status_created
  ON job_submissions(status, created_at DESC);

ALTER TABLE tender_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can submit.
CREATE POLICY "tender_submissions_insert_public" ON tender_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "job_submissions_insert_public" ON job_submissions
  FOR INSERT WITH CHECK (true);

-- Only admins can view and moderate submissions.
CREATE POLICY "tender_submissions_select_admin" ON tender_submissions
  FOR SELECT USING (public.is_admin());

CREATE POLICY "tender_submissions_update_admin" ON tender_submissions
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "tender_submissions_delete_admin" ON tender_submissions
  FOR DELETE USING (public.is_admin());

CREATE POLICY "job_submissions_select_admin" ON job_submissions
  FOR SELECT USING (public.is_admin());

CREATE POLICY "job_submissions_update_admin" ON job_submissions
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "job_submissions_delete_admin" ON job_submissions
  FOR DELETE USING (public.is_admin());
