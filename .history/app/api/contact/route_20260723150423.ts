import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const phoneNumber = String(body.phone_number ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const message = String(body.message ?? "").trim();

  if (!phoneNumber || !email || !message) {
    return NextResponse.json(
      { error: "Phone number, email, and message are required." },
      { status: 400 }
    );
  }

  if (message.length > 500) {
    return NextResponse.json(
      { error: "Message is too long. Keep it under 500 characters." },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({
    phone_number: phoneNumber,
    email,
    message,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(
    { message: "Your message was sent to admin." },
    { status: 201 }
  );
}
