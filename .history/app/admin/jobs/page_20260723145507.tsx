import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { JobVacancy } from "@/types";
import { requireAdminUser } from "@/lib/auth/admin";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-PG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isExpired(d: string) {
  return new Date(d) < new Date();
}

export default async function AdminJobsPage() {
  await requireAdminUser();
  const supabase = await createClient();
  const { data: jobs } = await supabase
    .from("job_vacancies")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Job Vacancies</h1>
        <Link
          href="/admin/jobs/new"
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
        >
          + Add Job
        </Link>
      </div>

      {!jobs || jobs.length === 0 ? (
        <p className="text-gray-500 text-sm">No job vacancies yet.</p>
      ) : (
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Job Title
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">
                  Company
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">
                  Type
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Closes
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {(jobs as JobVacancy[]).map((j) => {
                const expired = isExpired(j.closing_date);
                return (
                  <tr key={j.id} className={expired ? "bg-gray-50" : ""}>
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-900 line-clamp-1">
                        {j.job_title}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                      {j.company_name}
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">
                      {j.job_type}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          expired ? "text-red-500 font-medium" : "text-gray-700"
                        }
                      >
                        {formatDate(j.closing_date)}
                        {expired && (
                          <span className="ml-1 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                            Expired
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <Link
                          href={`/admin/jobs/${j.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/jobs/${j.id}`}
                          target="_blank"
                          className="text-gray-500 hover:underline"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
