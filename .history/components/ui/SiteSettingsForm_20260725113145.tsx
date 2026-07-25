"use client";

import { useState, useEffect } from "react";

interface SiteSettings {
  id?: string;
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

const PRESET_THEMES = {
  default: {
    primary_color: "#1e3a8a",
    secondary_color: "#fbbf24",
    accent_color: "#3b82f6",
    navbar_background: "#1e3a8a",
    footer_background: "#111827",
    theme_name: "Default",
  },
  ocean: {
    primary_color: "#0369a1",
    secondary_color: "#0ea5e9",
    accent_color: "#06b6d4",
    navbar_background: "#0369a1",
    footer_background: "#0c4a6e",
    theme_name: "Ocean",
  },
  forest: {
    primary_color: "#15803d",
    secondary_color: "#84cc16",
    accent_color: "#22c55e",
    navbar_background: "#15803d",
    footer_background: "#1b4332",
    theme_name: "Forest",
  },
  sunset: {
    primary_color: "#ea580c",
    secondary_color: "#f97316",
    accent_color: "#fb923c",
    navbar_background: "#ea580c",
    footer_background: "#7c2d12",
    theme_name: "Sunset",
  },
};

export default function SiteSettingsForm({ initialSettings }: { initialSettings: SiteSettings }) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSave() {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to save settings");
        setSaving(false);
        return;
      }

      setMessage("Site settings updated successfully!");
      setSaving(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setSaving(false);
    }
  }

  function applyTheme(themeName: keyof typeof PRESET_THEMES) {
    const theme = PRESET_THEMES[themeName];
    setSettings((prev) => ({
      ...prev,
      ...theme,
    }));
  }

  return (
    <div className="space-y-6">
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

      {/* Basic Info */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Site Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
            <input
              type="text"
              value={settings.site_name}
              onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site Description</label>
            <textarea
              value={settings.site_description}
              onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
              rows={3}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Theme Presets */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Theme Presets</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(PRESET_THEMES).map(([key, theme]) => (
            <button
              key={key}
              onClick={() => applyTheme(key as keyof typeof PRESET_THEMES)}
              className="p-4 border rounded-lg hover:shadow-md transition-all"
            >
              <div className="flex gap-2 mb-2">
                <div
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: theme.primary_color }}
                />
                <div
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: theme.secondary_color }}
                />
              </div>
              <p className="text-xs font-medium text-gray-700">{theme.theme_name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Colors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { key: "primary_color", label: "Primary Color" },
            { key: "secondary_color", label: "Secondary Color" },
            { key: "accent_color", label: "Accent Color" },
            { key: "navbar_background", label: "Navbar Background" },
            { key: "footer_background", label: "Footer Background" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings[key as keyof SiteSettings] || "#000000"}
                  onChange={(e) =>
                    setSettings({ ...settings, [key]: e.target.value })
                  }
                  className="h-10 w-16 border rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={settings[key as keyof SiteSettings] || "#000000"}
                  onChange={(e) =>
                    setSettings({ ...settings, [key]: e.target.value })
                  }
                  className="flex-1 border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="#000000"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save Site Settings"}
      </button>
    </div>
  );
}
