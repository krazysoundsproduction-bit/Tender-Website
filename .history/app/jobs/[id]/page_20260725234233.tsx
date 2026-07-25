import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import type { JobVacancy } from "@/types";
import FormattedContent from "@/components/ui/FormattedContent";
import ShareButtons from "@/components/ui/ShareButtons";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getJob(id: string): Promise<JobVacancy | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("job_vacancies")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return data as JobVacancy;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const job = await getJob(id);
  if (!job) return { title: "Job Not Found" };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://tender-website-lake.vercel.app";
  const jobUrl = `${baseUrl}/jobs/${id}`;
  const description = `${job.job_type} position at ${job.company_name}. Location: ${job.location}. Closes: ${new Date(job.closing_date).toLocaleDateString("en-PG")}.`;

  return {
    title: `${job.job_title} — ${job.company_name}`,
    description,
    openGraph: {
      title: `${job.job_title} — ${job.company_name}`,
      description,
      type: "article",
      url: jobUrl,
      images: job.company_logo_url ? [{ url: job.company_logo_url }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${job.job_title} — ${job.company_name}`,
      description,
      images: job.company_logo_url ? [job.company_logo_url] : [],
    },
  };
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-PG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function isExpired(closingDate: string): boolean {
  return new Date(closingDate) < new Date();
}

const JOB_TYPE_COLOURS: Record<string, string> = {
  "Full-time": "bg-green-100 text-green-700",
  "Part-time": "bg-blue-100 text-blue-700",
  Contract: "bg-yellow-100 text-yellow-800",
  Internship: "bg-purple-100 text-purple-700",
};

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) notFound();

  const expired = isExpired(job.closing_date);
  const typeClass =
    JOB_TYPE_COLOURS[job.job_type] ?? "bg-gray-100 text-gray-600";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">
          Home
        </Link>{" "}
        /{" "}
        <Link href="/jobs" className="hover:text-blue-600">
          Jobs
        </Link>{" "}
        / <span className="text-gray-700">{job.job_title}</span>
      </nav>

      <article className="bg-white border rounded-2xl shadow-sm p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
            {job.job_title}
          </h1>
          {expired && (
            <span className="shrink-0 text-sm font-medium bg-red-100 text-red-600 px-3 py-1 rounded-full">
              Expired
            </span>
          )}
        </div>

        <p className="text-lg text-gray-600 mb-4">{job.company_name}</p>

        {job.company_logo_url && (
          <div className="mb-4 w-28 h-28 border rounded-xl p-2 bg-white">
            <Image
              src={job.company_logo_url}
              alt={`${job.company_name} logo`}
              width={96}
              height={96}
              unoptimized
              className="w-full h-full object-contain"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          <span className={`text-sm font-medium px-3 py-1 rounded-full ${typeClass}`}>
            {job.job_type}
          </span>
          <span className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
            📍 {job.location}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <span className="text-gray-500">Company</span>
            <p className="font-medium text-gray-800">{job.company_name}</p>
          </div>
          <div>
            <span className="text-gray-500">Job Type</span>
            <p className="font-medium text-gray-800">{job.job_type}</p>
          </div>
          <div>
            <span className="text-gray-500">Location</span>
            <p className="font-medium text-gray-800">📍 {job.location}</p>
          </div>
          <div>
            <span className="text-gray-500">Closing Date</span>
            <p
              className={`font-medium ${expired ? "text-red-600" : "text-gray-800"}`}
            >
              {formatDate(job.closing_date)}
            </p>
          </div>
        </div>

        <hr className="my-6" />

        <div>
          <h2 className="font-semibold text-gray-800 mb-3">
            Description &amp; Requirements
          </h2>
          <FormattedContent text={job.description_and_requirements} />
        </div>

        <hr className="my-6" />

        <div>
          <h2 className="font-semibold text-gray-800 mb-3">How to Apply</h2>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            {job.application_email_or_link.startsWith("http") ? (
              <a
                href={job.application_email_or_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm break-all"
              >
                {job.application_email_or_link}
              </a>
            ) : (
              <a
                href={`mailto:${job.application_email_or_link}`}
                className="text-blue-600 hover:underline text-sm"
              >
                {job.application_email_or_link}
              </a>
            )}
          </div>
        </div>

        {job.source_url && (
          <>
            <hr className="my-6" />
            <a
              href={job.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              🔗 View Original Source
            </a>
          </>
        )}

        <div className="mt-6 text-xs text-gray-400">
          Posted: {formatDate(job.created_at)}
        </div>
      </article>

      <div className="mt-6">
        <Link href="/jobs" className="text-blue-600 text-sm hover:underline">
          ← Back to all jobs
        </Link>
      </div>
    </div>
  );
}
