import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, isAdminUser } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/server";

interface Params {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { supabase, user } = await getAuthContext();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAdminUser(user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  // Use admin client to bypass RLS for deletion
  const adminClient = createAdminClient();
  
  const { error } = await adminClient
    .from("job_vacancies")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Job vacancy deleted successfully" });
}
