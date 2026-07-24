import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const requiredFields = [
    "submitter_name",
    "submitter_email",
    "job_title",
    "company_name",
    "job_type",
    "location",
    "closing_date",
    "description_and_requirements",
    "application_email_or_link",
  ];

  for (const field of requiredFields) {
    if (!body[field] || String(body[field]).trim() === "") {
      return NextResponse.json(
        { error: `Missing required field: ${field}` },
        { status: 400 }
      );
    }
  }

  const payload = {
    submitter_name: String(body.submitter_name).trim(),
    submitter_email: String(body.submitter_email).trim().toLowerCase(),
    job_title: String(body.job_title).trim(),
    company_name: String(body.company_name).trim(),
    company_logo_url: body.company_logo_url
      ? String(body.company_logo_url).trim()
      : null,
    job_type: String(body.job_type).trim(),
    location: String(body.location).trim(),
    closing_date: new Date(body.closing_date).toISOString(),
    description_and_requirements: String(body.description_and_requirements).trim(),
    application_email_or_link: String(body.application_email_or_link).trim(),
    source_url: body.source_url ? String(body.source_url).trim() : null,
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
