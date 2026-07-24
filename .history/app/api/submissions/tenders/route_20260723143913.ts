import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const requiredFields = [
    "submitter_name",
    "submitter_email",
    "title",
    "organization",
    "category",
    "location",
    "closing_date",
    "description",
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
    title: String(body.title).trim(),
    organization: String(body.organization).trim(),
    category: String(body.category).trim(),
    location: String(body.location).trim(),
    closing_date: new Date(body.closing_date).toISOString(),
    description: String(body.description).trim(),
    document_url: body.document_url ? String(body.document_url).trim() : null,
    source_url: body.source_url ? String(body.source_url).trim() : null,
  };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tender_submissions")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(
    {
      message: "Tender submission received. It will be reviewed by an admin.",
      id: data.id,
    },
    { status: 201 }
  );
}
