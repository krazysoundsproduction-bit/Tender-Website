import Link from "next/link";
import Image from "next/image";
import { getAuthContext, isAdminUser } from "@/lib/auth/admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getAuthContext();
  const isAdmin = isAdminUser(user);

  if (!isAdmin) {
    return <>{children}</>;
  }

  const { supabase } = await getAuthContext();
  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("logo_url")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Nav */}
      <nav className="bg-gray-900 text-white px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-bold text-yellow-400">
              Admin Panel
            </Link>
            <Link
              href="/admin/tenders"
              className="text-sm hover:text-yellow-400 transition-colors"
            >
              Tenders
            </Link>
            <Link
              href="/admin/jobs"
              className="text-sm hover:text-yellow-400 transition-colors"
            >
              Jobs
            </Link>
            <Link
              href="/admin/submissions"
              className="text-sm hover:text-yellow-400 transition-colors"
            >
              Submissions
            </Link>
            <Link
              href="/admin/contact"
              className="text-sm hover:text-yellow-400 transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/admin/profile"
              className="text-sm hover:text-yellow-400 transition-colors"
            >
              Profile
            </Link>
          </div>
          <div className="flex items-center gap-4 text-sm">
            {profile?.logo_url ? (
              <Image
                src={profile.logo_url}
                alt="Admin profile logo"
                width={56}
                height={56}
                className="rounded-full object-cover border-2 border-yellow-400"
              />
            ) : null}
            <span className="text-gray-400 hidden sm:inline">{user.email}</span>
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              ← View Site
            </Link>
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">{children}</div>
    </div>
  );
}
