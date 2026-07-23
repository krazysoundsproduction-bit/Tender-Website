import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const category = searchParams.get("category");
  const location = searchParams.get("location");
  const activeOnly = searchParams.get("activeOnly") !== "0";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "20", 10));

  const supabase = await createClient();
  const now = new Date().toISOString();

  let query = supabase
    .from("tenders")
    .select("*", { count: "exact" })
    .order("closing_date", { ascending: true })
    .range((page - 1) * limit, page * limit - 1);

  if (activeOnly) query = query.gte("closing_date", now);
  if (search) query = query.or(`title.ilike.%${search}%,organization.ilike.%${search}%`);
  if (category) query = query.eq("category", category);
  if (location) query = query.eq("location", location);

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, total: count, page, limit });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { data, error } = await supabase
    .from("tenders")
    .insert(body)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 201 });
}
