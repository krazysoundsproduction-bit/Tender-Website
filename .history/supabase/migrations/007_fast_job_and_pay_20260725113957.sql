-- Add Fast Job & Pay category support to job_vacancies table

-- Add new columns for poster contact information
ALTER TABLE job_vacancies
  ADD COLUMN IF NOT EXISTS poster_name TEXT,
  ADD COLUMN IF NOT EXISTS poster_phone TEXT,
  ADD COLUMN IF NOT EXISTS poster_email TEXT,
  ADD COLUMN IF NOT EXISTS preferred_contact TEXT,
  ADD COLUMN IF NOT EXISTS is_fast_job BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS payment_amount TEXT,
  ADD COLUMN IF NOT EXISTS completion_timeframe TEXT;

-- Add index for fast job filtering
CREATE INDEX IF NOT EXISTS idx_jobs_is_fast_job ON job_vacancies(is_fast_job);

-- Similarly, add poster contact columns to tender_submissions for consistency
ALTER TABLE tender_submissions
  ADD COLUMN IF NOT EXISTS poster_name TEXT,
  ADD COLUMN IF NOT EXISTS poster_phone TEXT,
  ADD COLUMN IF NOT EXISTS poster_email TEXT,
  ADD COLUMN IF NOT EXISTS preferred_contact TEXT;

ALTER TABLE job_submissions
  ADD COLUMN IF NOT EXISTS is_fast_job BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS payment_amount TEXT,
  ADD COLUMN IF NOT EXISTS completion_timeframe TEXT,
  ADD COLUMN IF NOT EXISTS poster_name TEXT,
  ADD COLUMN IF NOT EXISTS poster_phone TEXT,
  ADD COLUMN IF NOT EXISTS poster_email TEXT,
  ADD COLUMN IF NOT EXISTS preferred_contact TEXT;
