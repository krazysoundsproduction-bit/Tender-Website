import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import JobCard from "@/components/ui/JobCard";
import type { JobVacancy } from "@/types";

export const metadata: Metadata = {
  title: "⚡ Fast Jobs & Pay",
  description:
    "Quick micro-tasks and fast-pay jobs in Papua New Guinea. Contact posters directly via phone, WhatsApp, SMS, or email.",
  openGraph: {
    title: "⚡ Fast Jobs & Pay – PNG",
    description:
      "Quick micro-tasks and fast-pay jobs in Papua New Guinea. Contact posters directly.",
  },
};

const PAGE_SIZE = 20;

interface SearchParams {
  search?: string;
  location?: string;
  page?: string;
}

async function getFastJobs(params: SearchParams): Promise<{
  jobs: JobVacancy[];
  total: number;
}> {
  try {
    const supabase = await createClient();
    const page = Math.max(1, parseInt(params.page ?? "1", 10));

    let query = supabase
      .from("job_vacancies")
      .select("*", { count: "exact" })
      .eq("is_fast_job", true)
      .order("created_at", { ascending: false });

    if (params.search) {
      query = query.or(
        `job_title.ilike.%${params.search}%,poster_name.ilike.%${params.search}%`
      );
    }

    if (params.location) {
      query = query.eq("location", params.location);
    }

    query = query.range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

    const { data, count, error } = await query;
    if (error) throw error;

    return { jobs: (data as JobVacancy[]) ?? [], total: count ?? 0 };
  } catch {
    return { jobs: [], total: 0 };
  }
}

export default async function FastJobsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { jobs, total } = await getFastJobs(params);
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const totalPages = Math.ceil(total / PAGE_SIZE);

  function buildPageUrl(p: number) {
    const sp = new URLSearchParams();
    if (params.search) sp.set("search", params.search);
    if (params.location) sp.set("location", params.location);
    sp.set("page", String(p));
    return `/fast-jobs?${sp.toString()}`;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          ⚡ Fast Jobs & Pay
        </h1>
        <p className="text-gray-600 mt-1">
          Quick micro-tasks with direct contact to the poster — call, WhatsApp,
          SMS, or email to get started fast.
        </p>
        <p className="text-sm text-gray-400 mt-1">
          {total} listing{total !== 1 ? "s" : ""} available
        </p>
      </div>

      {/* Search bar */}
      <form method="get" action="/fast-jobs" className="mb-6 flex gap-2">
        <input
          type="text"
          name="search"
          defaultValue={params.search ?? ""}
          placeholder="Search tasks or poster name…"
          className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <button
          type="submit"
          className="bg-yellow-500 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-yellow-600 transition-colors"
        >
          Search
        </button>
        {params.search && (
          <a
            href="/fast-jobs"
            className="border border-gray-300 text-gray-600 rounded-lg px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
          >
            Clear
          </a>
        )}
      </form>

      {jobs.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <div className="text-5xl mb-4">⚡</div>
          <p className="text-lg font-medium">No fast jobs listed yet</p>
          <p className="text-sm mt-1">
            Check back soon or{" "}
            <a href="/submit" className="text-yellow-600 hover:underline">
              post your own task
            </a>
            .
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {page > 1 && (
                <a
                  href={buildPageUrl(page - 1)}
                  className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  ← Prev
                </a>
              )}
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <a
                  href={buildPageUrl(page + 1)}
                  className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  Next →
                </a>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
