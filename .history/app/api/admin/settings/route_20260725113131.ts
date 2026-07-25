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

    const settings = await request.json();

    const adminClient = createAdminClient();
    const { data, error } = await adminClient
      .from("site_settings")
      .upsert(
        {
          ...settings,
          updated_by: user.id,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error updating site settings:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
