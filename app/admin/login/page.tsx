import { createClient } from "@/lib/supabase/server";
import LoginForm from "./LoginForm";

export default async function AdminLoginPage() {
  const supabase = await createClient();
  await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🦅</div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
          <p className="text-gray-600 text-sm mt-1">PNG Tenders &amp; Jobs</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
