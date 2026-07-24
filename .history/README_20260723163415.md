# 🦅 PNG Tenders & Jobs Website

A centralised web platform for browsing, publishing, and managing government and private sector tenders and job vacancies in Papua New Guinea (PNG).

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL via [Supabase](https://supabase.com) |
| Backend / API | Next.js API Routes |
| File Storage | Supabase Storage (for tender documents) |
| Hosting | Vercel (recommended) |

## Features

- 📋 **Tenders listing** — browse and filter government/private tenders
- 💼 **Job vacancies listing** — full-time, part-time, contract, and internship
- 🔍 **Smart filtering** — by category, province, job type, and active status
- ⏰ **Auto-expired listings** — expired tenders/jobs are automatically hidden or labelled
- 📱 **Mobile-optimised** — lightweight pages for 3G/4G networks
- 📤 **Social sharing** — OpenGraph meta tags for Facebook/WhatsApp preview cards
- 🔐 **Admin panel** — authenticated admin dashboard for managing listings
- 📄 **Document downloads** — link to PDF tender documents
- 📬 **Contact admin form** — public phone/email/message contact option
- 🖼️ **Company logo uploads** — upload logos for tender and job postings
- 👤 **Admin profile logo** — admin can upload a larger profile logo in panel

## Database Schema

### `tenders` table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | Text | Tender title |
| organization | Text | Issuing organisation |
| category | Text | e.g. Infrastructure, IT, Supply |
| location | Text | Province or location |
| closing_date | Timestamptz | Deadline |
| description | Text | Full description/requirements |
| document_url | Text | Optional PDF link |
| source_url | Text | Original source link |
| created_at | Timestamptz | Record creation time |

### `job_vacancies` table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| job_title | Text | Position title |
| company_name | Text | Employer |
| job_type | Enum | Full-time, Part-time, Contract, Internship |
| location | Text | Province or location |
| closing_date | Timestamptz | Application deadline |
| description_and_requirements | Text | Full JD and requirements |
| application_email_or_link | Text | How to apply |
| source_url | Text | Original source link |
| created_at | Timestamptz | Record creation time |

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/krazysoundsproduction-bit/Tender-Website.git
cd Tender-Website
npm install
```

### 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. In the Supabase SQL Editor, run the migration file:
   ```
   supabase/migrations/001_initial_schema.sql
   ```
3. Create an admin user in **Authentication > Users** in your Supabase dashboard

### 3. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_EMAILS=admin@yourdomain.com
NEXT_PUBLIC_ADMIN_EMAILS=admin@yourdomain.com
```

`ADMIN_EMAILS` and `NEXT_PUBLIC_ADMIN_EMAILS` are comma-separated lists used to
restrict admin access in the app. You can also set `app_metadata.role = "admin"`
on Supabase users for role-based access.

### 3.1 Apply latest migration

Run the new SQL migration in Supabase SQL editor:

```
supabase/migrations/002_admin_roles_and_submissions.sql
supabase/migrations/003_contact_messages.sql
supabase/migrations/004_company_logos_and_admin_profiles.sql
```

This migration adds:
- strict admin-only write access to `tenders` and `job_vacancies`
- public submission tables (`tender_submissions`, `job_submissions`)
- approval workflow fields and moderation policies
- public contact messages table (`contact_messages`) with admin-only inbox access
- company logo columns + storage bucket policies (`company-logos`)
- admin profile table for logo management (`admin_profiles`)

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Panel

The admin panel is accessible at `/admin/login`. Sign in with the credentials from your Supabase Auth dashboard.

Only users marked as admins (by email env list or Supabase app metadata role)
can access admin pages and mutation endpoints.

Once logged in you can:
- View dashboard stats (total and active tenders/jobs)
- Add, edit, and delete tenders
- Add, edit, and delete job vacancies
- Review submitted tenders/jobs in `/admin/submissions`
- Manage your admin profile logo in `/admin/profile`

## Public Submission Workflow

- Public users can submit listings at `/submit`
- Submitted listings are stored as pending submissions
- Admins review submissions in `/admin/submissions`
- Approving a submission publishes it into the live listings table

## Contact Admin Workflow

- Public users can send a message at `/contact`
- Required fields are phone number, email, and short message
- Admins can review incoming messages at `/admin/contact`

## Deployment (Vercel)

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add the environment variables in Vercel project settings
4. Deploy!

## Project Structure

```
├── app/
│   ├── page.tsx              # Home page
│   ├── layout.tsx            # Root layout
│   ├── tenders/
│   │   ├── page.tsx          # Tenders listing
│   │   └── [id]/page.tsx     # Tender detail
│   ├── jobs/
│   │   ├── page.tsx          # Jobs listing
│   │   └── [id]/page.tsx     # Job detail
│   ├── admin/
│   │   ├── layout.tsx        # Admin layout (auth protected)
│   │   ├── page.tsx          # Admin dashboard
│   │   ├── login/            # Login page
│   │   ├── tenders/          # Manage tenders
│   │   └── jobs/             # Manage jobs
│   └── api/
│       ├── tenders/          # REST API for tenders
│       ├── jobs/             # REST API for jobs
│       └── auth/signout/     # Sign-out endpoint
├── components/
│   ├── layout/               # Navbar, Footer
│   └── ui/                   # Cards, Forms, Filters
├── lib/supabase/             # Supabase client/server/middleware
├── types/                    # TypeScript type definitions
└── supabase/migrations/      # SQL schema files
```
