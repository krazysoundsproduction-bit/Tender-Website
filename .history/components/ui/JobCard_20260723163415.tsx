import Link from "next/link";
import Image from "next/image";
import type { JobVacancy } from "@/types";

interface JobCardProps {
  job: JobVacancy;
}

function isExpired(closingDate: string): boolean {
  return new Date(closingDate) < new Date();
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-PG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const JOB_TYPE_COLOURS: Record<string, string> = {
  "Full-time": "bg-green-100 text-green-700",
  "Part-time": "bg-blue-100 text-blue-700",
  Contract: "bg-yellow-100 text-yellow-800",
  Internship: "bg-purple-100 text-purple-700",
};

export default function JobCard({ job }: JobCardProps) {
  const expired = isExpired(job.closing_date);
  const typeClass =
    JOB_TYPE_COLOURS[job.job_type] ?? "bg-gray-100 text-gray-600";

  return (
    <Link href={`/jobs/${job.id}`} className="group block">
      <article
        className={`border rounded-xl p-4 h-full flex flex-col gap-3 transition-shadow group-hover:shadow-md ${
          expired ? "opacity-60 bg-gray-50" : "bg-white"
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
            {job.job_title}
          </h3>
          {expired && (
            <span className="shrink-0 text-xs font-medium bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
              Expired
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600">{job.company_name}</p>

        {job.company_logo_url && (
          <div className="w-16 h-16 border rounded-lg p-1 bg-white">
            <Image
              src={job.company_logo_url}
              alt={`${job.company_name} logo`}
              width={56}
              height={56}
              unoptimized
              className="w-full h-full object-contain"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-auto">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeClass}`}>
            {job.job_type}
          </span>
          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
            📍 {job.location}
          </span>
        </div>

        <div className="text-xs text-gray-500">
          Closes:{" "}
          <span
            className={
              expired ? "text-red-500 font-medium" : "font-medium text-gray-700"
            }
          >
            {formatDate(job.closing_date)}
          </span>
        </div>
      </article>
    </Link>
  );
}
