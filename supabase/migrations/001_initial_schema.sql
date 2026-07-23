-- PNG Tender and Job Vacancies Website Database Schema
-- Run this in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tenders table
CREATE TABLE IF NOT EXISTS tenders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  closing_date TIMESTAMPTZ NOT NULL,
  description TEXT NOT NULL,
  document_url TEXT,
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Job vacancies table
CREATE TYPE job_type AS ENUM ('Full-time', 'Part-time', 'Contract', 'Internship');

CREATE TABLE IF NOT EXISTS job_vacancies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  job_type job_type NOT NULL DEFAULT 'Full-time',
  location TEXT NOT NULL,
  closing_date TIMESTAMPTZ NOT NULL,
  description_and_requirements TEXT NOT NULL,
  application_email_or_link TEXT NOT NULL,
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for common filter queries
CREATE INDEX IF NOT EXISTS idx_tenders_closing_date ON tenders(closing_date);
CREATE INDEX IF NOT EXISTS idx_tenders_category ON tenders(category);
CREATE INDEX IF NOT EXISTS idx_tenders_location ON tenders(location);

CREATE INDEX IF NOT EXISTS idx_jobs_closing_date ON job_vacancies(closing_date);
CREATE INDEX IF NOT EXISTS idx_jobs_job_type ON job_vacancies(job_type);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON job_vacancies(location);

-- Row Level Security (RLS)
ALTER TABLE tenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_vacancies ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can read tenders/jobs)
CREATE POLICY "tenders_select_public" ON tenders
  FOR SELECT USING (true);

CREATE POLICY "jobs_select_public" ON job_vacancies
  FOR SELECT USING (true);

-- Authenticated users (admins) can insert/update/delete
CREATE POLICY "tenders_insert_authenticated" ON tenders
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "tenders_update_authenticated" ON tenders
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "tenders_delete_authenticated" ON tenders
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "jobs_insert_authenticated" ON job_vacancies
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "jobs_update_authenticated" ON job_vacancies
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "jobs_delete_authenticated" ON job_vacancies
  FOR DELETE USING (auth.role() = 'authenticated');
