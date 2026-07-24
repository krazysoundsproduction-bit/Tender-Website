import { createAdminClient } from "@/lib/supabase/server";
import { getAuthContext } from "@/lib/auth/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { supabase, user } = await getAuthContext();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { logoUrl } = await request.json();

    if (!logoUrl || typeof logoUrl !== "string") {
      return NextResponse.json(
        { error: "Invalid logo URL" },
        { status: 400 }
      );
    }

    // Use admin client to bypass RLS policies (which have a bug)
    const adminClient = createAdminClient();
    const { error } = await adminClient
      .from("admin_profiles")
      .upsert(
        {
          user_id: user.id,
          logo_url: logoUrl.trim() || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (error) {
      console.error("Error saving admin profile:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Profile logo updated" });
  } catch (err) {
    console.error("Admin profile save error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
