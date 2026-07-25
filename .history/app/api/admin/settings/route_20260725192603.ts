import { createAdminClient } from "@/lib/supabase/server";
import { getAuthContext } from "@/lib/auth/admin";
import { isAdminUser } from "@/lib/auth/admin";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const adminClient = createAdminClient();
    const { data } = await adminClient.from("site_settings").select("*").limit(1).maybeSingle();

    return NextResponse.json(data || {});
  } catch (err) {
    console.error("Error fetching site settings:", err);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await getAuthContext();

    if (!user || !isAdminUser(user)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const incoming = await request.json();

    // Strip non-column fields (e.g. placeholder "default" id)
    const { id: _id, ...rest } = incoming;

    const payload = {
      ...rest,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    };

    const adminClient = createAdminClient();

    // Always find the existing row first — the table is a singleton
    const { data: existing } = await adminClient
      .from("site_settings")
      .select("id")
      .limit(1)
      .maybeSingle();

    let result;
    if (existing?.id) {
      // Update by the real UUID
      const { data, error } = await adminClient
        .from("site_settings")
        .update(payload)
        .eq("id", existing.id)
        .select()
        .single();
      result = { data, error };
    } else {
      // No row yet — insert
      const { data, error } = await adminClient
        .from("site_settings")
        .insert(payload)
        .select()
        .single();
      result = { data, error };
    }

    if (result.error) {
      console.error("Settings save error:", result.error);
      return NextResponse.json({ error: result.error.message }, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (err) {
    console.error("Error updating site settings:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
