import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="text-yellow-400">🦅</span>
            <span>PNG Tenders & Jobs</span>
          </Link>
          <div className="flex items-center gap-4 sm:gap-6">
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
