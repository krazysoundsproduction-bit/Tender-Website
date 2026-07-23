"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PNG_PROVINCES, JOB_TYPES } from "@/types";
import type { JobVacancy } from "@/types";

interface JobFormProps {
  job?: JobVacancy;
}

export default function JobForm({ job }: JobFormProps) {
  const router = useRouter();
  const isEditing = Boolean(job);

  const toDateTimeLocal = (isoString?: string) => {
    if (!isoString) return "";
    return new Date(isoString).toISOString().slice(0, 16);
  };

  const [form, setForm] = useState({
    job_title: job?.job_title ?? "",
    company_name: job?.company_name ?? "",
    job_type: job?.job_type ?? "Full-time",
    location: job?.location ?? PNG_PROVINCES[0],
    closing_date: toDateTimeLocal(job?.closing_date),
    description_and_requirements: job?.description_and_requirements ?? "",
    application_email_or_link: job?.application_email_or_link ?? "",
    source_url: job?.source_url ?? "",
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
      job_title: form.job_title.trim(),
      company_name: form.company_name.trim(),
      job_type: form.job_type,
      location: form.location,
      closing_date: new Date(form.closing_date).toISOString(),
      description_and_requirements: form.description_and_requirements.trim(),
      application_email_or_link: form.application_email_or_link.trim(),
      source_url: form.source_url.trim() || null,
    };

    let dbError;
    if (isEditing && job) {
      ({ error: dbError } = await supabase
        .from("job_vacancies")
        .update(payload)
        .eq("id", job.id));
    } else {
      ({ error: dbError } = await supabase.from("job_vacancies").insert(payload));
    }

    if (dbError) {
      setError(dbError.message);
      setLoading(false);
      return;
    }

    router.push("/admin/jobs");
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

      <Field label="Job Title" required>
        <input
          name="job_title"
          type="text"
          required
          value={form.job_title}
          onChange={handleChange}
          placeholder="e.g. Senior Accountant"
          className={inputClass}
        />
      </Field>

      <Field label="Company Name" required>
        <input
          name="company_name"
          type="text"
          required
          value={form.company_name}
          onChange={handleChange}
          placeholder="e.g. Bank of Papua New Guinea"
          className={inputClass}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Job Type" required>
          <select
            name="job_type"
            required
            value={form.job_type}
            onChange={handleChange}
            className={inputClass}
          >
            {JOB_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
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

      <Field label="Description & Requirements" required>
        <textarea
          name="description_and_requirements"
          required
          rows={6}
          value={form.description_and_requirements}
          onChange={handleChange}
          placeholder="Paste the full job description and requirements here…"
          className={`${inputClass} resize-y`}
        />
      </Field>

      <Field label="Application Email or Link" required>
        <input
          name="application_email_or_link"
          type="text"
          required
          value={form.application_email_or_link}
          onChange={handleChange}
          placeholder="email@company.com or https://apply.link"
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
          className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-60"
        >
          {loading
            ? isEditing
              ? "Saving…"
              : "Adding…"
            : isEditing
              ? "Save Changes"
              : "Add Job"}
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
