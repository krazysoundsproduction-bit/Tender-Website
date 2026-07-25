import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const closingDate = new Date(body.closing_date ?? new Date().toISOString());
  const safeClosingDate = Number.isNaN(closingDate.getTime())
    ? new Date().toISOString()
    : closingDate.toISOString();

  // For fast jobs, use "Contract" as the job type since they're micro-tasks
  const isFastJob = body.is_fast_job === true;
  const jobType = isFastJob ? "Contract" : String(body.job_type ?? "Full-time").trim() || "Full-time";

  const payload = {
    submitter_name: String(body.submitter_name ?? "Anonymous").trim() || "Anonymous",
    submitter_email:
      String(body.submitter_email ?? "unknown@example.com").trim().toLowerCase() ||
      "unknown@example.com",
    job_title: String(body.job_title ?? "Untitled Job").trim() || "Untitled Job",
    company_name:
      String(body.company_name ?? "Not specified").trim() || "Not specified",
    company_logo_url: body.company_logo_url
      ? String(body.company_logo_url).trim()
      : null,
    job_type: jobType,
    location: String(body.location ?? "Nationwide").trim() || "Nationwide",
    closing_date: safeClosingDate,
    description_and_requirements:
      String(body.description_and_requirements ?? "Not provided.").trim() ||
      "Not provided.",
    application_email_or_link:
      String(body.application_email_or_link ?? "Not provided").trim() ||
      "Not provided",
    source_url: body.source_url ? String(body.source_url).trim() : null,
    // Fast job specific fields
    is_fast_job: isFastJob,
    payment_amount: isFastJob ? String(body.payment_amount ?? "").trim() : null,
    completion_timeframe: isFastJob ? String(body.completion_timeframe ?? "").trim() : null,
    poster_name: isFastJob ? String(body.poster_name ?? "").trim() : null,
    poster_phone: isFastJob ? String(body.poster_phone ?? "").trim() : null,
    poster_email: isFastJob && body.poster_email ? String(body.poster_email).trim() : null,
    preferred_contact: isFastJob ? String(body.preferred_contact ?? "Phone").trim() : null,
  };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("job_submissions")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(
    {
      message: "Job submission received. It will be reviewed by an admin.",
      id: data.id,
    },
    { status: 201 }
  );
}
