import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <h3 className="font-bold text-yellow-400 mb-2">
              🦅 PNG Tenders &amp; Jobs
            </h3>
            <p className="text-sm text-blue-200">
              Your central hub for government tenders and job vacancies across
              Papua New Guinea.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-1 text-sm text-blue-200">
              <li>
                <Link href="/tenders" className="hover:text-white transition-colors">
                  Browse Tenders
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="hover:text-white transition-colors">
                  Browse Jobs
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">About</h4>
            <p className="text-sm text-blue-200">
              Aggregating tenders and job vacancies from government departments,
              NGOs, and private sector organisations in PNG.
            </p>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-blue-800 text-center text-xs text-blue-300">
          &copy; {new Date().getFullYear()} PNG Tenders &amp; Jobs. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
