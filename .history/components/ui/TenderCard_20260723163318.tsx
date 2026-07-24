import Link from "next/link";
import Image from "next/image";
import type { Tender } from "@/types";

interface TenderCardProps {
  tender: Tender;
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

const CATEGORY_COLOURS: Record<string, string> = {
  Infrastructure: "bg-orange-100 text-orange-700",
  "IT & Technology": "bg-purple-100 text-purple-700",
  "Supply & Procurement": "bg-green-100 text-green-700",
  Consulting: "bg-blue-100 text-blue-700",
  Construction: "bg-yellow-100 text-yellow-800",
  Healthcare: "bg-red-100 text-red-700",
  Education: "bg-teal-100 text-teal-700",
  Transport: "bg-indigo-100 text-indigo-700",
  Other: "bg-gray-100 text-gray-600",
};

export default function TenderCard({ tender }: TenderCardProps) {
  const expired = isExpired(tender.closing_date);
  const categoryClass =
    CATEGORY_COLOURS[tender.category] ?? "bg-gray-100 text-gray-600";

  return (
    <Link href={`/tenders/${tender.id}`} className="group block">
      <article
        className={`border rounded-xl p-4 h-full flex flex-col gap-3 transition-shadow group-hover:shadow-md ${
          expired ? "opacity-60 bg-gray-50" : "bg-white"
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
            {tender.title}
          </h3>
          {expired && (
            <span className="shrink-0 text-xs font-medium bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
              Expired
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600">{tender.organization}</p>

        {tender.company_logo_url && (
          <div className="w-16 h-16 border rounded-lg p-1 bg-white">
            <Image
              src={tender.company_logo_url}
              alt={`${tender.organization} logo`}
              width={56}
              height={56}
              className="w-full h-full object-contain"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-auto">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryClass}`}
          >
            {tender.category}
          </span>
          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
            📍 {tender.location}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            Closes:{" "}
            <span
              className={
                expired ? "text-red-500 font-medium" : "font-medium text-gray-700"
              }
            >
              {formatDate(tender.closing_date)}
            </span>
          </span>
        </div>
      </article>
    </Link>
  );
}
