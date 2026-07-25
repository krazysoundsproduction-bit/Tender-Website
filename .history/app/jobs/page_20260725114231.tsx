import type { Metadata } from "next";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import JobCard from "@/components/ui/JobCard";
import JobFilters from "@/components/ui/JobFilters";
import type { JobVacancy } from "@/types";

export const metadata: Metadata = {
  title: "Job Vacancies",
  description:
    "Browse full-time, part-time, contract, and internship job vacancies across Papua New Guinea.",
  openGraph: {
    title: "PNG Job Vacancies",
    description:
      "Browse full-time, part-time, contract, and internship job vacancies across Papua New Guinea.",
  },
};

const PAGE_SIZE = 20;

interface SearchParams {
  search?: string;
  jobType?: string;
  location?: string;
  activeOnly?: string;
  isFastJob?: string;
  page?: string;
}

async function getJobs(params: SearchParams): Promise<{
  jobs: JobVacancy[];
  total: number;
}> {
  try {
    const supabase = await createClient();
    const now = new Date().toISOString();
    const page = Math.max(1, parseInt(params.page ?? "1", 10));
    const activeOnly = params.activeOnly !== "0";

    let query = supabase
      .from("job_vacancies")
      .select("*", { count: "exact" })
      .order("closing_date", { ascending: true });

    if (activeOnly) {
      query = query.gte("closing_date", now);
    }

    if (params.search) {
      query = query.or(
        `job_title.ilike.%${params.search}%,company_name.ilike.%${params.search}%`
      );
    }

    if (params.jobType) {
      query = query.eq("job_type", params.jobType);
    }

    if (params.location) {
      query = query.eq("location", params.location);
    }

    if (params.isFastJob === "1") {
      query = query.eq("is_fast_job", true);
    }

    query = query.range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

    const { data, count, error } = await query;

    if (error) throw error;

    return { jobs: (data as JobVacancy[]) ?? [], total: count ?? 0 };
  } catch {
    return { jobs: [], total: 0 };
  }
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { jobs, total } = await getJobs(params);
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const activeOnly = params.activeOnly !== "0";

  function buildPageUrl(p: number) {
    const sp = new URLSearchParams();
    if (params.search) sp.set("search", params.search);
    if (params.jobType) sp.set("jobType", params.jobType);
    if (params.location) sp.set("location", params.location);
    if (params.isFastJob) sp.set("isFastJob", params.isFastJob);
    sp.set("activeOnly", activeOnly ? "1" : "0");
    sp.set("page", String(p));
    return `/jobs?${sp.toString()}`;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Job Vacancies
        </h1>
        <p className="text-gray-600 mt-1">
          {total} job{total !== 1 ? "s" : ""} found
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <aside className="lg:w-72 shrink-0">
          <Suspense>
            <JobFilters
              currentSearch={params.search}
              currentJobType={params.jobType}
              currentLocation={params.location}
              currentActiveOnly={activeOnly}
            />
          </Suspense>
        </aside>

        {/* Listings */}
        <div className="flex-1">
          {jobs.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <div className="text-5xl mb-4">💼</div>
              <p className="text-lg font-medium">No job vacancies found</p>
              <p className="text-sm mt-1">Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>

              {/* Pagination */}
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
      </div>
    </div>
  );
}
