import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, isAdminUser } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/server";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { supabase, user } = await getAuthContext();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAdminUser(user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const action = body.action as "approve" | "reject";
  const reviewNotes = body.review_notes ? String(body.review_notes).trim() : null;

  if (action !== "approve" && action !== "reject") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const { data: submission, error: fetchError } = await supabase
    .from("tender_submissions")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !submission) {
    return NextResponse.json({ error: "Submission not found" }, { status: 404 });
  }

  if (submission.status !== "pending") {
    return NextResponse.json(
      { error: "Submission has already been reviewed" },
      { status: 409 }
    );
  }

  if (action === "reject") {
    const { error } = await supabase
      .from("tender_submissions")
      .update({
        status: "rejected",
        review_notes: reviewNotes,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.id,
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Submission rejected." });
  }

  const tenderPayload = {
    title: submission.title,
    organization: submission.organization,
    company_logo_url: submission.company_logo_url,
    category: submission.category,
    location: submission.location,
    closing_date: submission.closing_date,
    description: submission.description,
    document_url: submission.document_url,
    source_url: submission.source_url,
  };

  // Use admin client to bypass RLS policies for creating approved tenders
  const adminClient = createAdminClient();
  const { data: createdTender, error: createError } = await adminClient
    .from("tenders")
    .insert(tenderPayload)
    .select("id")
    .single();

  if (createError || !createdTender) {
    return NextResponse.json(
      { error: createError?.message ?? "Failed to create tender" },
      { status: 400 }
    );
  }

  const { error: updateError } = await supabase
    .from("tender_submissions")
    .update({
      status: "approved",
      review_notes: reviewNotes,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
      created_tender_id: createdTender.id,
    })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Submission approved and published." });
}
