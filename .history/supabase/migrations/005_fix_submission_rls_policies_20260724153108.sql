-- Fix RLS policies to allow anonymous users to submit
-- The policies need explicit role specification for anon + authenticated users

DROP POLICY IF EXISTS "tender_submissions_insert_public" ON tender_submissions;
DROP POLICY IF EXISTS "job_submissions_insert_public" ON job_submissions;

CREATE POLICY "tender_submissions_insert_public" ON tender_submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "job_submissions_insert_public" ON job_submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);
