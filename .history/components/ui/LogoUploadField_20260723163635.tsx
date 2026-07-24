"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface LogoUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  folder: "jobs" | "tenders" | "profiles";
  label?: string;
}

function sanitizeFilename(filename: string) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "-");
}

export default function LogoUploadField({
  value,
  onChange,
  folder,
  label = "Company Logo",
}: LogoUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [localPreview, setLocalPreview] = useState("");
  const inputId = useId();

  function mapUploadError(message: string) {
    const lower = message.toLowerCase();
    if (lower.includes("bucket") && lower.includes("not")) {
      return "Upload bucket not found. Run migration 004 in Supabase SQL Editor, then try again.";
    }
    if (lower.includes("permission") || lower.includes("policy") || lower.includes("row-level")) {
      return "Upload blocked by storage policy. Ensure migration 004 has been applied in Supabase.";
    }
    return message;
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");
    setLocalPreview(URL.createObjectURL(file));

    const supabase = createClient();
    const safeName = sanitizeFilename(file.name);
    const path = `${folder}/${Date.now()}-${safeName}`;

    const { error: uploadErrorResult } = await supabase.storage
      .from("company-logos")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadErrorResult) {
      setUploadError(mapUploadError(uploadErrorResult.message));
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("company-logos").getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
  }

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      {(localPreview || value) && (
        <div className="border rounded-lg p-3 bg-gray-50 inline-block">
          <Image
            src={localPreview || value}
            alt="Logo preview"
            width={96}
            height={96}
            unoptimized
            className="object-contain rounded"
          />
        </div>
      )}

      <input
        id={inputId}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
        onChange={handleFileUpload}
        className="block w-full text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-blue-700 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-800"
      />

      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste logo URL"
        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {uploading && <p className="text-xs text-blue-700">Uploading logo...</p>}
      {uploadError && <p className="text-xs text-red-600">{uploadError}</p>}
    </div>
  );
}
