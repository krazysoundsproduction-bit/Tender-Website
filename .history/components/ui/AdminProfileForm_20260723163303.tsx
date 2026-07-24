"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import LogoUploadField from "@/components/ui/LogoUploadField";

interface AdminProfileFormProps {
  userId: string;
  initialLogoUrl: string;
}

export default function AdminProfileForm({
  userId,
  initialLogoUrl,
}: AdminProfileFormProps) {
  const [logoUrl, setLogoUrl] = useState(initialLogoUrl);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function saveProfile() {
    setSaving(true);
    setMessage("");
    setError("");

    const supabase = createClient();
    const { error: upsertError } = await supabase.from("admin_profiles").upsert(
      {
        user_id: userId,
        logo_url: logoUrl.trim() || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    if (upsertError) {
      setError(upsertError.message);
      setSaving(false);
      return;
    }

    setMessage("Profile logo updated.");
    setSaving(false);
  }

  return (
    <div className="bg-white border rounded-xl shadow-sm p-6 space-y-4">
      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <LogoUploadField
        value={logoUrl}
        onChange={setLogoUrl}
        folder="profiles"
        label="Admin Profile Logo"
      />

      <button
        type="button"
        onClick={saveProfile}
        disabled={saving}
        className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save Profile"}
      </button>
    </div>
  );
}
