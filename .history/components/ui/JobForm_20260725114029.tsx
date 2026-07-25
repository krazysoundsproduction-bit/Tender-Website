"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import LogoUploadField from "@/components/ui/LogoUploadField";
import { PNG_PROVINCES, JOB_TYPES } from "@/types";
import type { JobVacancy } from "@/types";

interface JobFormProps {
  job?: JobVacancy;
}

function buildJobDescription(form: {
  job_title: string;
  location: string;
  job_type: string;
  department: string;
  reports_to: string;
  job_summary: string;
  key_responsibilities: string;
  qualifications: string;
  benefits_compensation: string;
  application_email: string;
  application_link: string;
}) {
  return `# Job Title: ${form.job_title || "[Job Title]"}

**Location:** ${form.location || "Not specified"}
**Job Type:** ${form.job_type || "Not specified"}
**Department:** ${form.department || "Not specified"}
**Reports To:** ${form.reports_to || "Not specified"}

## Job Summary
${form.job_summary || "Not provided."}

## Key Responsibilities
${form.key_responsibilities || "Not provided."}

## Qualifications
${form.qualifications || "Not provided."}

## Benefits & Compensation
${form.benefits_compensation || "Not provided."}

## How to Apply
Send your resume to ${form.application_email || "[Email Address]"}${
    form.application_link ? ` or apply online at ${form.application_link}.` : "."
  }`;
}

export default function JobForm({ job }: JobFormProps) {
  const router = useRouter();
  const isEditing = Boolean(job);

  const toDateTimeLocal = (isoString?: string) => {
    if (!isoString) return "";
    return new Date(isoString).toISOString().slice(0, 16);
  };

  const toIsoOrNow = (dateValue?: string) => {
    if (!dateValue) return new Date().toISOString();
    const parsed = new Date(dateValue);
    return Number.isNaN(parsed.getTime())
      ? new Date().toISOString()
      : parsed.toISOString();
  };

  const [form, setForm] = useState({
    job_title: job?.job_title ?? "",
    company_name: job?.company_name ?? "",
    company_logo_url: job?.company_logo_url ?? "",
    job_type: job?.job_type ?? "Full-time",
    location: job?.location ?? PNG_PROVINCES[0],
    closing_date: toDateTimeLocal(job?.closing_date),
    department: "",
    reports_to: "",
    job_summary: job?.description_and_requirements ?? "",
    key_responsibilities: "",
    qualifications: "",
    benefits_compensation: "",
    application_email: "",
    application_link: "",
    source_url: job?.source_url ?? "",
    is_fast_job: (job as any)?.is_fast_job ?? false,
    payment_amount: (job as any)?.payment_amount ?? "",
    completion_timeframe: (job as any)?.completion_timeframe ?? "",
    poster_name: (job as any)?.poster_name ?? "",
    poster_phone: (job as any)?.poster_phone ?? "",
    poster_email: (job as any)?.poster_email ?? "",
    preferred_contact: (job as any)?.preferred_contact ?? "Email",
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

    const descriptionAndRequirements = buildJobDescription({
      job_title: form.job_title.trim(),
      location: form.location,
      job_type: form.job_type,
      department: form.department.trim(),
      reports_to: form.reports_to.trim(),
      job_summary: form.job_summary.trim(),
      key_responsibilities: form.key_responsibilities.trim(),
      qualifications: form.qualifications.trim(),
      benefits_compensation: form.benefits_compensation.trim(),
      application_email: form.application_email.trim(),
      application_link: form.application_link.trim(),
    });

    const applicationContact =
      form.application_link.trim() ||
      form.application_email.trim() ||
      "Not provided";

    const payload = {
      job_title: form.job_title.trim() || "Untitled Job",
      company_name: form.company_name.trim() || "Not specified",
      company_logo_url: form.company_logo_url.trim() || null,
      job_type: form.job_type || "Full-time",
      location: form.location || "Nationwide",
      closing_date: toIsoOrNow(form.closing_date),
      description_and_requirements: descriptionAndRequirements,
      application_email_or_link: applicationContact,
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
      noValidate
      className="bg-white border rounded-xl shadow-sm p-6 space-y-4"
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <Section title="1. Basic Job Details" defaultOpen>
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

        <LogoUploadField
          value={form.company_logo_url}
          onChange={(url) => setForm((prev) => ({ ...prev, company_logo_url: url }))}
          folder="jobs"
          label="Company Logo"
        />

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
      </Section>

      <Section title="2. Role Description" defaultOpen>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Department" required>
            <input
              name="department"
              type="text"
              required
              value={form.department}
              onChange={handleChange}
              placeholder="e.g. Commercial"
              className={inputClass}
            />
          </Field>

          <Field label="Reports To" required>
            <input
              name="reports_to"
              type="text"
              required
              value={form.reports_to}
              onChange={handleChange}
              placeholder="e.g. Commercial Manager"
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Job Summary" required>
          <textarea
            name="job_summary"
            required
            rows={4}
            value={form.job_summary}
            onChange={handleChange}
            placeholder="Briefly explain the role and project context."
            className={`${inputClass} resize-y`}
          />
        </Field>

        <Field label="Key Responsibilities" required>
          <textarea
            name="key_responsibilities"
            required
            rows={6}
            value={form.key_responsibilities}
            onChange={handleChange}
            placeholder="Use bullet-style lines for duties and deliverables."
            className={`${inputClass} resize-y`}
          />
        </Field>

        <Field label="Qualifications" required>
          <textarea
            name="qualifications"
            required
            rows={6}
            value={form.qualifications}
            onChange={handleChange}
            placeholder="List education, experience, technical skills, and key attributes."
            className={`${inputClass} resize-y`}
          />
        </Field>

        <Field label="Benefits & Compensation" required>
          <textarea
            name="benefits_compensation"
            required
            rows={4}
            value={form.benefits_compensation}
            onChange={handleChange}
            placeholder="e.g. Salary range, insurance, leave, retirement plan."
            className={`${inputClass} resize-y`}
          />
        </Field>
      </Section>

      <Section title="3. Application Details" defaultOpen>
        <Field label="Application Email">
          <input
            name="application_email"
            type="email"
            value={form.application_email}
            onChange={handleChange}
            placeholder="hr@company.com"
            className={inputClass}
          />
        </Field>

        <Field label="Application Link">
          <input
            name="application_link"
            type="url"
            value={form.application_link}
            onChange={handleChange}
            placeholder="https://company.com/careers"
            className={inputClass}
          />
        </Field>

        <p className="text-xs text-gray-500 -mt-2">
          Provide at least one: Application Email or Application Link.
        </p>

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
      </Section>

      <Section title="4. Preview" defaultOpen>
        <Field label="Generated Posting Details" required>
          <textarea
            readOnly
            rows={14}
            value={buildJobDescription({
              job_title: form.job_title,
              location: form.location,
              job_type: form.job_type,
              department: form.department,
              reports_to: form.reports_to,
              job_summary: form.job_summary,
              key_responsibilities: form.key_responsibilities,
              qualifications: form.qualifications,
              benefits_compensation: form.benefits_compensation,
              application_email: form.application_email,
              application_link: form.application_link,
            })}
            className={`${inputClass} resize-y`}
          />
        </Field>
      </Section>

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
  children,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

function Section({
  title,
  defaultOpen,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details open={defaultOpen} className="border rounded-lg p-4 bg-gray-50/60">
      <summary className="cursor-pointer list-none font-semibold text-gray-800">
        {title}
      </summary>
      <div className="mt-4 space-y-4">{children}</div>
    </details>
  );
}
