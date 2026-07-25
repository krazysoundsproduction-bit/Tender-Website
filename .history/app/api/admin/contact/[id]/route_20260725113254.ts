import { createAdminClient } from "@/lib/supabase/server";
import { getAuthContext } from "@/lib/auth/admin";
import { isAdminUser } from "@/lib/auth/admin";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await getAuthContext();

    if (!user || !isAdminUser(user)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const adminClient = createAdminClient();
    const { error } = await adminClient.from("contact_messages").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error("Delete contact message error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
