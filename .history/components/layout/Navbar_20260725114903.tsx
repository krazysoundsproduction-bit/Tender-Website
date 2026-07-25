import Link from "next/link";
import Image from "next/image";
import { createAdminClient } from "@/lib/supabase/server";

export default async function Navbar() {
  let logoUrl: string | null = null;
  try {
    const adminClient = createAdminClient();
    const { data } = await adminClient
      .from("admin_profiles")
      .select("logo_url")
      .not("logo_url", "is", null)
      .limit(1)
      .maybeSingle();
    logoUrl = data?.logo_url ?? null;
  } catch {
    // Fall back to eagle icon if profile can't be fetched
  }

  return (
    <nav className="bg-blue-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt="Site logo"
                width={36}
                height={36}
                unoptimized
                className="rounded-full object-cover"
              />
            ) : (
              <span className="text-yellow-400">🦅</span>
            )}
            <span>PNG Tenders & Jobs</span>
          </Link>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/"
              className="text-sm sm:text-base hover:text-yellow-400 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/tenders"
              className="text-sm sm:text-base hover:text-yellow-400 transition-colors"
            >
              Tenders
            </Link>
            <Link
              href="/jobs"
              className="text-sm sm:text-base hover:text-yellow-400 transition-colors"
            >
              Jobs
            </Link>
            <Link
              href="/fast-jobs"
              className="text-sm sm:text-base font-medium text-yellow-300 hover:text-yellow-200 transition-colors"
            >
              ⚡ Fast Jobs
            </Link>
            <Link
              href="/submit"
              className="text-sm sm:text-base hover:text-yellow-400 transition-colors"
            >
              Submit
            </Link>
            <Link
              href="/contact"
              className="text-sm sm:text-base hover:text-yellow-400 transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/admin/login"
              className="text-sm sm:text-base font-semibold text-yellow-300 hover:text-yellow-200 transition-colors"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
