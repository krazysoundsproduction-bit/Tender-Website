import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

async function getAdminStats() {
  try {
    const supabase = await createClient();
    const now = new Date().toISOString();

    const [
      { count: totalTenders },
      { count: activeTenders },
      { count: totalJobs },
      { count: activeJobs },
    ] = await Promise.all([
      supabase.from("tenders").select("id", { count: "exact", head: true }),
      supabase
        .from("tenders")
        .select("id", { count: "exact", head: true })
        .gte("closing_date", now),
      supabase.from("job_vacancies").select("id", { count: "exact", head: true }),
      supabase
        .from("job_vacancies")
        .select("id", { count: "exact", head: true })
        .gte("closing_date", now),
    ]);

    return {
      totalTenders: totalTenders ?? 0,
      activeTenders: activeTenders ?? 0,
      totalJobs: totalJobs ?? 0,
      activeJobs: activeJobs ?? 0,
    };
  } catch {
    return { totalTenders: 0, activeTenders: 0, totalJobs: 0, activeJobs: 0 };
  }
}

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Tenders"
          value={stats.totalTenders}
          colour="blue"
        />
        <StatCard
          label="Active Tenders"
          value={stats.activeTenders}
          colour="green"
        />
        <StatCard
          label="Total Jobs"
          value={stats.totalJobs}
          colour="blue"
        />
        <StatCard
          label="Active Jobs"
          value={stats.activeJobs}
          colour="green"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">Tenders</h2>
          <div className="flex gap-3">
            <Link
              href="/admin/tenders/new"
              className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors"
            >
              + Add Tender
            </Link>
            <Link
              href="/admin/tenders"
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Manage Tenders
            </Link>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">Job Vacancies</h2>
          <div className="flex gap-3">
            <Link
              href="/admin/jobs/new"
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              + Add Job
            </Link>
            <Link
              href="/admin/jobs"
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Manage Jobs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  colour,
}: {
  label: string;
  value: number;
  colour: "blue" | "green";
}) {
  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm text-center">
      <div
        className={`text-3xl font-bold ${colour === "green" ? "text-green-600" : "text-blue-700"}`}
      >
        {value}
      </div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}
