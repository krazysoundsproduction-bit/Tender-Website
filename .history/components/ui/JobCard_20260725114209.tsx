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
  const isFastJob = (job as any)?.is_fast_job;
  const posterName = (job as any)?.poster_name;
  const posterPhone = (job as any)?.poster_phone;
  const posterEmail = (job as any)?.poster_email;
  const paymentAmount = (job as any)?.payment_amount;
  const preferredContact = (job as any)?.preferred_contact;

  const cleanPhoneNumber = (phone: string) =>
    phone?.replace(/\D/g, "") || "";

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
          {expired ? (
            <span className="shrink-0 text-xs font-medium bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
              Expired
            </span>
          ) : isFastJob ? (
            <span className="shrink-0 text-xs font-medium bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
              ⚡ Fast Job & Pay
            </span>
          ) : null}
        </div>

        {isFastJob ? (
          <>
            <p className="text-sm text-gray-700 font-semibold">
              {paymentAmount}
            </p>
            <p className="text-sm text-gray-600">By: {posterName}</p>
          </>
        ) : (
          <p className="text-sm text-gray-600">{job.company_name}</p>
        )}

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

        {isFastJob && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            {preferredContact === "Phone" && posterPhone && (
              <a
                href={`tel:${posterPhone}`}
                onClick={(e) => e.stopPropagation()}
                className="text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 px-2 py-1 rounded transition-colors"
              >
                ☎️ Call
              </a>
            )}
            {preferredContact === "WhatsApp" && posterPhone && (
              <a
                href={`https://wa.me/${cleanPhoneNumber(posterPhone)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 px-2 py-1 rounded transition-colors"
              >
                💬 WhatsApp
              </a>
            )}
            {preferredContact === "SMS" && posterPhone && (
              <a
                href={`sms:${posterPhone}`}
                onClick={(e) => e.stopPropagation()}
                className="text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 py-1 rounded transition-colors"
              >
                📱 SMS
              </a>
            )}
            {posterEmail && (
              <a
                href={`mailto:${posterEmail}`}
                onClick={(e) => e.stopPropagation()}
                className="text-xs font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 px-2 py-1 rounded transition-colors"
              >
                ✉️ Email
              </a>
            )}
          </div>
        )}

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
