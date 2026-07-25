import { requireAdminUser } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/server";
import SiteSettingsForm from "@/components/ui/SiteSettingsForm";

interface SiteSettings {
  id: string;
  site_name: string;
  site_description: string;
  site_logo_url?: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  navbar_background: string;
  footer_background: string;
  theme_name: string;
}

export default async function AdminSettingsPage() {
  await requireAdminUser();

  const adminClient = createAdminClient();
  const { data: settings } = await adminClient
    .from("site_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  const defaultSettings: SiteSettings = {
    id: "default",
    site_name: "PNG Tenders & Jobs",
    site_description: "Your central hub for government tenders and job vacancies across Papua New Guinea.",
    primary_color: "#1e3a8a",
    secondary_color: "#fbbf24",
    accent_color: "#3b82f6",
    navbar_background: "#1e3a8a",
    footer_background: "#111827",
    theme_name: "default",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">⚙️ Site Settings</h1>
      <p className="text-sm text-gray-600 mb-6">
        Customize your site name, description, colors, themes, and appearance.
      </p>

      <SiteSettingsForm initialSettings={settings || defaultSettings} />
    </div>
  );
}
