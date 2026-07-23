import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

async function getStats() {
  try {
    const supabase = await createClient();
    const now = new Date().toISOString();

    const [{ count: tenderCount }, { count: jobCount }] = await Promise.all([
      supabase
        .from("tenders")
        .select("id", { count: "exact", head: true })
        .gte("closing_date", now),
      supabase
        .from("job_vacancies")
        .select("id", { count: "exact", head: true })
        .gte("closing_date", now),
    ]);

    return {
      activeTenders: tenderCount ?? 0,
      activeJobs: jobCount ?? 0,
    };
  } catch {
    return { activeTenders: 0, activeJobs: 0 };
  }
}

export default async function HomePage() {
  const stats = await getStats();

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="text-5xl mb-4">🦅</div>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight">
            PNG Tenders &amp; Job Vacancies
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Your central hub for government tenders and job vacancies across
            Papua New Guinea — updated daily from official sources.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tenders"
              className="bg-yellow-400 text-blue-900 font-bold px-8 py-3 rounded-full hover:bg-yellow-300 transition-colors text-lg"
            >
              Browse Tenders
            </Link>
            <Link
              href="/jobs"
              className="border-2 border-white text-white font-bold px-8 py-3 rounded-full hover:bg-white hover:text-blue-900 transition-colors text-lg"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-6 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-blue-700">
                {stats.activeTenders}
              </div>
              <div className="text-sm sm:text-base text-gray-600 mt-1">
                Active Tenders
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-green-600">
                {stats.activeJobs}
              </div>
              <div className="text-sm sm:text-base text-gray-600 mt-1">
                Active Job Vacancies
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-10">
          What You Can Find Here
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">📋</div>
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              Government Tenders
            </h3>
            <p className="text-sm text-gray-600">
              Procurement opportunities from national and provincial government
              departments, statutory bodies, and SOEs.
            </p>
          </div>
          <div className="bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">💼</div>
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              Job Vacancies
            </h3>
            <p className="text-sm text-gray-600">
              Full-time, part-time, contract, and internship positions from
              public and private sector employers across PNG.
            </p>
          </div>
          <div className="bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              Smart Filtering
            </h3>
            <p className="text-sm text-gray-600">
              Instantly filter by category, province, and closing date. Expired
              listings are automatically hidden.
            </p>
          </div>
          <div className="bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">📱</div>
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              Mobile-Friendly
            </h3>
            <p className="text-sm text-gray-600">
              Optimised for 3G/4G networks — lightweight pages that load fast
              even with limited internet access.
            </p>
          </div>
          <div className="bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">📤</div>
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              Easy Sharing
            </h3>
            <p className="text-sm text-gray-600">
              Share listings to Facebook or WhatsApp and a rich preview card
              will automatically appear.
            </p>
          </div>
          <div className="bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">📄</div>
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              Document Downloads
            </h3>
            <p className="text-sm text-gray-600">
              Download tender documents and application forms directly from
              listing pages.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-50 border-t py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Ready to explore?
          </h2>
          <p className="text-gray-600 mb-6">
            Browse the latest active tenders and job vacancies right now.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/tenders"
              className="bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors"
            >
              View All Tenders →
            </Link>
            <Link
              href="/jobs"
              className="bg-green-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              View All Jobs →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
