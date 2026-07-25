import Image from "next/image";
import { createAdminClient } from "@/lib/supabase/server";
import LoginForm from "./LoginForm";

export default async function AdminLoginPage() {
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
    // Fall back to eagle if logo can't be fetched
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          {logoUrl ? (
            <div className="flex justify-center mb-2">
              <Image
                src={logoUrl}
                alt="Admin logo"
                width={64}
                height={64}
                unoptimized
                className="rounded-full object-cover border-2 border-blue-900"
              />
            </div>
          ) : (
            <div className="text-4xl mb-2">🦅</div>
          )}
          <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
          <p className="text-gray-600 text-sm mt-1">PNG Tenders &amp; Jobs</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
