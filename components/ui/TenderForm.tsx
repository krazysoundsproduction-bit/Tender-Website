"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TENDER_CATEGORIES, PNG_PROVINCES } from "@/types";
import type { Tender } from "@/types";

interface TenderFormProps {
  tender?: Tender;
}

export default function TenderForm({ tender }: TenderFormProps) {
  const router = useRouter();
  const isEditing = Boolean(tender);

  const toDateTimeLocal = (isoString?: string) => {
    if (!isoString) return "";
    const d = new Date(isoString);
    return d.toISOString().slice(0, 16);
  };

  const [form, setForm] = useState({
    title: tender?.title ?? "",
    organization: tender?.organization ?? "",
    category: tender?.category ?? TENDER_CATEGORIES[0],
    location: tender?.location ?? PNG_PROVINCES[0],
    closing_date: toDateTimeLocal(tender?.closing_date),
    description: tender?.description ?? "",
    document_url: tender?.document_url ?? "",
    source_url: tender?.source_url ?? "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();

    const payload = {
      title: form.title.trim(),
      organization: form.organization.trim(),
      category: form.category,
      location: form.location,
      closing_date: new Date(form.closing_date).toISOString(),
      description: form.description.trim(),
      document_url: form.document_url.trim() || null,
      source_url: form.source_url.trim() || null,
    };

    let dbError;
    if (isEditing && tender) {
      ({ error: dbError } = await supabase
        .from("tenders")
        .update(payload)
        .eq("id", tender.id));
    } else {
      ({ error: dbError } = await supabase.from("tenders").insert(payload));
    }

    if (dbError) {
      setError(dbError.message);
      setLoading(false);
      return;
    }

    router.push("/admin/tenders");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border rounded-xl shadow-sm p-6 space-y-4"
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <Field label="Tender Title" required>
        <input
          name="title"
          type="text"
          required
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Supply of Medical Equipment"
          className={inputClass}
        />
      </Field>

      <Field label="Organisation" required>
        <input
          name="organization"
          type="text"
          required
          value={form.organization}
          onChange={handleChange}
          placeholder="e.g. Department of Health"
          className={inputClass}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Category" required>
          <select
            name="category"
            required
            value={form.category}
            onChange={handleChange}
            className={inputClass}
          >
            {TENDER_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Location / Province" required>
          <select
            name="location"
            required
            value={form.location}
            onChange={handleChange}
            className={inputClass}
          >
            {PNG_PROVINCES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Closing Date & Time" required>
        <input
          name="closing_date"
          type="datetime-local"
          required
          value={form.closing_date}
          onChange={handleChange}
          className={inputClass}
        />
      </Field>

      <Field label="Description / Requirements" required>
        <textarea
          name="description"
          required
          rows={6}
          value={form.description}
          onChange={handleChange}
          placeholder="Paste the full tender description here…"
          className={`${inputClass} resize-y`}
        />
      </Field>

      <Field label="Document URL (optional)">
        <input
          name="document_url"
          type="url"
          value={form.document_url}
          onChange={handleChange}
          placeholder="https://..."
          className={inputClass}
        />
      </Field>

      <Field label="Source URL (optional)">
        <input
          name="source_url"
          type="url"
          value={form.source_url}
          onChange={handleChange}
          placeholder="https://..."
          className={inputClass}
        />
      </Field>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-700 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-800 transition-colors disabled:opacity-60"
        >
          {loading
            ? isEditing
              ? "Saving…"
              : "Adding…"
            : isEditing
              ? "Save Changes"
              : "Add Tender"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
