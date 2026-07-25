-- Site settings for theming, colors, descriptions, etc.

CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_name TEXT DEFAULT 'PNG Tenders & Jobs',
  site_description TEXT DEFAULT 'Your central hub for government tenders and job vacancies across Papua New Guinea.',
  site_logo_url TEXT,
  primary_color TEXT DEFAULT '#1e3a8a',
  secondary_color TEXT DEFAULT '#fbbf24',
  accent_color TEXT DEFAULT '#3b82f6',
  navbar_background TEXT DEFAULT '#1e3a8a',
  footer_background TEXT DEFAULT '#111827',
  theme_name TEXT DEFAULT 'default',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

INSERT INTO site_settings (site_name, site_description)
  VALUES ('PNG Tenders & Jobs', 'Your central hub for government tenders and job vacancies across Papua New Guinea.')
  ON CONFLICT (id) DO NOTHING;

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_settings_select_public" ON site_settings;
DROP POLICY IF EXISTS "site_settings_update_admin" ON site_settings;

CREATE POLICY "site_settings_select_public" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "site_settings_update_admin" ON site_settings
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
