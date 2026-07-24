"use client";

import { useState } from "react";
import { JOB_TYPES, PNG_PROVINCES } from "@/types";

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
  return `# Job Title: ${form.job_title}

**Location:** ${form.location}
**Job Type:** ${form.job_type}
**Department:** ${form.department}
**Reports To:** ${form.reports_to}

## Job Summary
${form.job_summary}

## Key Responsibilities
${form.key_responsibilities}

## Qualifications
${form.qualifications}

## Benefits & Compensation
${form.benefits_compensation}

## How to Apply
Send your resume to ${form.application_email || "[Email Address]"}${
    form.application_link ? ` or apply online at ${form.application_link}.` : "."
  }`;
}

export default function PublicJobSubmissionForm() {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    submitter_name: "",
    submitter_email: "",
    job_title: "",
    company_name: "",
    job_type: JOB_TYPES[0],
    location: PNG_PROVINCES[0],
    closing_date: "",
    department: "",
    reports_to: "",
    job_summary: "",
    key_responsibilities: "",
    qualifications: "",
    benefits_compensation: "",
    application_email: "",
    application_link: "",
    source_url: "",
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!form.application_email.trim() && !form.application_link.trim()) {
      setError("Provide at least an application email or application link.");
      setLoading(false);
      return;
    }

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

    const applicationContact = form.application_link.trim() || form.application_email.trim();

    const payload = {
      ...form,
      closing_date: new Date(form.closing_date).toISOString(),
      description_and_requirements: descriptionAndRequirements,
      application_email_or_link: applicationContact,
      source_url: form.source_url.trim() || null,
    };

    const response = await fetch("/api/submissions/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!response.ok) {
      setError(result.error ?? "Submission failed.");
      setLoading(false);
      return;
    }

    setSuccess("Your job vacancy has been submitted for admin review.");
    setForm({
      submitter_name: "",
      submitter_email: "",
      job_title: "",
      company_name: "",
      job_type: JOB_TYPES[0],
      location: PNG_PROVINCES[0],
      closing_date: "",
      department: "",
      reports_to: "",
      job_summary: "",
      key_responsibilities: "",
      qualifications: "",
      benefits_compensation: "",
      application_email: "",
      application_link: "",
      source_url: "",
    });
    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border rounded-xl shadow-sm p-6 space-y-4"
    >
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <Section title="1. Contact Details" defaultOpen>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Your Name" required>
            <input
              name="submitter_name"
              type="text"
              required
              value={form.submitter_name}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>

          <Field label="Your Email" required>
            <input
              name="submitter_email"
              type="email"
              required
              value={form.submitter_email}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>
        </div>
      </Section>

      <Section title="2. Basic Job Details" defaultOpen>
      <Field label="Job Title" required>
        <input
          name="job_title"
          type="text"
          required
          value={form.job_title}
          onChange={handleChange}
          className={inputClass}
        />
      </Field>

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

      <Section title="3. Role Description" defaultOpen>

      <Field label="Company Name" required>
        <input
          name="company_name"
          type="text"
          required
          value={form.company_name}
          onChange={handleChange}
          className={inputClass}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Job Type" required>
          <select
            name="job_type"
            value={form.job_type}
            onChange={handleChange}
            className={inputClass}
          >
            {JOB_TYPES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Location" required>
          <select
            name="location"
            value={form.location}
            onChange={handleChange}
            className={inputClass}
          >
            {PNG_PROVINCES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Department" required>
          <input
            name="department"
            type="text"
            required
            value={form.department}
            onChange={handleChange}
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
          className={`${inputClass} resize-y`}
        />
      </Field>
      </Section>

      <Section title="4. Application Details" defaultOpen>

      <Field label="Application Email">
        <input
          name="application_email"
          type="email"
          value={form.application_email}
          onChange={handleChange}
          className={inputClass}
        />
      </Field>

      <Field label="Application Link">
        <input
          name="application_link"
          type="url"
          value={form.application_link}
          onChange={handleChange}
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
          className={inputClass}
        />
      </Field>
      </Section>

      <Section title="5. Preview" defaultOpen>
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

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Submit Job For Review"}
      </button>
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
