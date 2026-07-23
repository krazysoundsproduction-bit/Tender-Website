import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="text-6xl mb-4">🦅</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h1>
      <p className="text-gray-600 mb-8">
        The page you are looking for does not exist or has been removed.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors"
        >
          Go Home
        </Link>
        <Link
          href="/tenders"
          className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Browse Tenders
        </Link>
      </div>
    </div>
  );
}
