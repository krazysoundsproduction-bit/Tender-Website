import { createClient } from "@/lib/supabase/server";
import { requireAdminUser } from "@/lib/auth/admin";
import AdminProfileForm from "@/components/ui/AdminProfileForm";

export default async function AdminProfilePage() {
  const { user } = await requireAdminUser();
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("logo_url")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Profile</h1>
      <p className="text-sm text-gray-600 mb-6">
        Upload your profile logo to display a bigger icon in the admin panel header.
      </p>
      <AdminProfileForm
        userId={user.id}
        initialLogoUrl={profile?.logo_url ?? ""}
      />
    </div>
  );
}
