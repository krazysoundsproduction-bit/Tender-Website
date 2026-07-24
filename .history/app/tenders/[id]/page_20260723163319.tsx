import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import type { Tender } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getTender(id: string): Promise<Tender | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tenders")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return data as Tender;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const tender = await getTender(id);
  if (!tender) return { title: "Tender Not Found" };

  return {
    title: tender.title,
    description: `${tender.organization} — ${tender.category}. Closes: ${new Date(tender.closing_date).toLocaleDateString("en-PG")}.`,
    openGraph: {
      title: tender.title,
      description: `${tender.organization} | ${tender.category} | Closes ${new Date(tender.closing_date).toLocaleDateString("en-PG")}`,
      type: "article",
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

export default async function TenderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const tender = await getTender(id);

  if (!tender) notFound();

  const expired = isExpired(tender.closing_date);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">
          Home
        </Link>{" "}
        /{" "}
        <Link href="/tenders" className="hover:text-blue-600">
          Tenders
        </Link>{" "}
        / <span className="text-gray-700">{tender.title}</span>
      </nav>

      <article className="bg-white border rounded-2xl shadow-sm p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
            {tender.title}
          </h1>
          {expired && (
            <span className="shrink-0 text-sm font-medium bg-red-100 text-red-600 px-3 py-1 rounded-full">
              Expired
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <span className="text-gray-500">Organisation</span>
            <p className="font-medium text-gray-800">{tender.organization}</p>
          </div>
          <div>
            <span className="text-gray-500">Category</span>
            <p className="font-medium text-gray-800">{tender.category}</p>
          </div>
          <div>
            <span className="text-gray-500">Location</span>
            <p className="font-medium text-gray-800">📍 {tender.location}</p>
          </div>
          <div>
            <span className="text-gray-500">Closing Date</span>
            <p
              className={`font-medium ${expired ? "text-red-600" : "text-gray-800"}`}
            >
              {formatDate(tender.closing_date)}
            </p>
          </div>
        </div>

        {tender.company_logo_url && (
          <div className="mb-6 w-28 h-28 border rounded-xl p-2 bg-white">
            <Image
              src={tender.company_logo_url}
              alt={`${tender.organization} logo`}
              width={96}
              height={96}
              className="w-full h-full object-contain"
            />
          </div>
        )}

        <hr className="my-6" />

        <div>
          <h2 className="font-semibold text-gray-800 mb-3">
            Description / Requirements
          </h2>
          <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
            {tender.description}
          </div>
        </div>

        {(tender.document_url || tender.source_url) && (
          <>
            <hr className="my-6" />
            <div className="flex flex-wrap gap-3">
              {tender.document_url && (
                <a
                  href={tender.document_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors"
                >
                  📄 Download Document
                </a>
              )}
              {tender.source_url && (
                <a
                  href={tender.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  🔗 View Original Source
                </a>
              )}
            </div>
          </>
        )}

        <div className="mt-6 text-xs text-gray-400">
          Posted: {formatDate(tender.created_at)}
        </div>
      </article>

      <div className="mt-6">
        <Link
          href="/tenders"
          className="text-blue-600 text-sm hover:underline"
        >
          ← Back to all tenders
        </Link>
      </div>
    </div>
  );
}
