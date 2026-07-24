import { NextRequest, NextResponse } from "next/server";
import { getAuthContext } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files allowed" }, { status: 400 });
    }

    // Validate file size (5MB)
    if (file.size > 5242880) {
      return NextResponse.json({ error: "File size exceeds 5MB limit" }, { status: 400 });
    }

    // Convert file to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const fileExt = file.name.split(".").pop() || "jpg";
    const fileName = `${crypto.randomBytes(16).toString("hex")}.${fileExt}`;
    const filePath = `submissions/${fileName}`;

    // Upload to Supabase Storage
    const supabase = await createClient();
    const { data, error } = await supabase.storage
      .from("company-logos")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("company-logos")
      .getPublicUrl(data.path);

    return NextResponse.json({
      url: urlData.publicUrl,
      path: data.path,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
