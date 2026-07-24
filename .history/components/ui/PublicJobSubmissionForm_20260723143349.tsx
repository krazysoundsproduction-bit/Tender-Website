"use client";

import { useState } from "react";
import { JOB_TYPES, PNG_PROVINCES } from "@/types";

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
    description_and_requirements: "",
    application_email_or_link: "",
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

    const payload = {
      ...form,
      closing_date: new Date(form.closing_date).toISOString(),
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
      description_and_requirements: "",
      application_email_or_link: "",
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

      <h2 className="text-lg font-semibold text-gray-900">Contact Details</h2>
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

      <h2 className="text-lg font-semibold text-gray-900 pt-2">Job Details</h2>
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
          className={inputClass}
        />
      </Field>

      <Field label="Source URL (optional)">
        <input
          name="source_url"
          type="url"
          value={form.source_url}
          onChange={handleChange}
          className={inputClass}
        />
      </Field>

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
