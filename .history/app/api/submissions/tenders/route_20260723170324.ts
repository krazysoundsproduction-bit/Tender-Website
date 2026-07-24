import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const closingDate = new Date(body.closing_date ?? new Date().toISOString());
  const safeClosingDate = Number.isNaN(closingDate.getTime())
    ? new Date().toISOString()
    : closingDate.toISOString();

  const payload = {
    submitter_name: String(body.submitter_name ?? "Anonymous").trim() || "Anonymous",
    submitter_email:
      String(body.submitter_email ?? "unknown@example.com").trim().toLowerCase() ||
      "unknown@example.com",
    title: String(body.title ?? "Untitled Tender").trim() || "Untitled Tender",
    organization:
      String(body.organization ?? "Not specified").trim() || "Not specified",
    company_logo_url: body.company_logo_url
      ? String(body.company_logo_url).trim()
      : null,
    category: String(body.category ?? "Other").trim() || "Other",
    location: String(body.location ?? "Nationwide").trim() || "Nationwide",
    closing_date: safeClosingDate,
    description:
      String(body.description ?? "No additional details provided.").trim() ||
      "No additional details provided.",
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
