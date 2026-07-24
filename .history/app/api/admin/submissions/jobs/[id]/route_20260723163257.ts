import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, isAdminUser } from "@/lib/auth/admin";

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
    .from("job_submissions")
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
      .from("job_submissions")
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

  const jobPayload = {
    job_title: submission.job_title,
    company_name: submission.company_name,
    company_logo_url: submission.company_logo_url,
    job_type: submission.job_type,
    location: submission.location,
    closing_date: submission.closing_date,
    description_and_requirements: submission.description_and_requirements,
    application_email_or_link: submission.application_email_or_link,
    source_url: submission.source_url,
  };

  const { data: createdJob, error: createError } = await supabase
    .from("job_vacancies")
    .insert(jobPayload)
    .select("id")
    .single();

  if (createError || !createdJob) {
    return NextResponse.json(
      { error: createError?.message ?? "Failed to create job" },
      { status: 400 }
    );
  }

  const { error: updateError } = await supabase
    .from("job_submissions")
    .update({
      status: "approved",
      review_notes: reviewNotes,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
      created_job_id: createdJob.id,
    })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Submission approved and published." });
}
