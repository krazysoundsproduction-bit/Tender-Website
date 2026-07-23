import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Tender } from "@/types";
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

export default async function AdminTendersPage() {
  await requireAdminUser();
  const supabase = await createClient();
  const { data: tenders } = await supabase
    .from("tenders")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Tenders</h1>
        <Link
          href="/admin/tenders/new"
          className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors"
        >
          + Add Tender
        </Link>
      </div>

      {!tenders || tenders.length === 0 ? (
        <p className="text-gray-500 text-sm">No tenders yet.</p>
      ) : (
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Title
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">
                  Organisation
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">
                  Category
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Closes
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {(tenders as Tender[]).map((t) => {
                const expired = isExpired(t.closing_date);
                return (
                  <tr key={t.id} className={expired ? "bg-gray-50" : ""}>
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-900 line-clamp-1">
                        {t.title}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                      {t.organization}
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">
                      {t.category}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          expired ? "text-red-500 font-medium" : "text-gray-700"
                        }
                      >
                        {formatDate(t.closing_date)}
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
                          href={`/admin/tenders/${t.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/tenders/${t.id}`}
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
