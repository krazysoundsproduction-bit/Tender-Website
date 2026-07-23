export type JobType = "Full-time" | "Part-time" | "Contract" | "Internship";

export interface Tender {
  id: string;
  title: string;
  organization: string;
  category: string;
  location: string;
  closing_date: string;
  description: string;
  document_url?: string | null;
  source_url?: string | null;
  created_at: string;
}

export interface JobVacancy {
  id: string;
  job_title: string;
  company_name: string;
  job_type: JobType;
  location: string;
  closing_date: string;
  description_and_requirements: string;
  application_email_or_link: string;
  source_url?: string | null;
  created_at: string;
}

export interface FilterOptions {
  search?: string;
  category?: string;
  location?: string;
  activeOnly?: boolean;
}

export const TENDER_CATEGORIES = [
  "Infrastructure",
  "IT & Technology",
  "Supply & Procurement",
  "Consulting",
  "Construction",
  "Healthcare",
  "Education",
  "Transport",
  "Other",
] as const;

export const PNG_PROVINCES = [
  "National Capital District",
  "Central",
  "Gulf",
  "Milne Bay",
  "Oro (Northern)",
  "Southern Highlands",
  "Western",
  "Western Highlands",
  "Simbu (Chimbu)",
  "Eastern Highlands",
  "Morobe",
  "Madang",
  "East Sepik",
  "West Sepik (Sandaun)",
  "Manus",
  "New Ireland",
  "East New Britain",
  "West New Britain",
  "Bougainville (AROB)",
  "Hela",
  "Jiwaka",
  "Remote",
  "Nationwide",
] as const;

export const JOB_TYPES: JobType[] = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
];
