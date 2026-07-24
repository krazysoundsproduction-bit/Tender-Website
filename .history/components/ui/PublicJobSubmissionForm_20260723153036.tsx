"use client";

import { useState } from "react";
import { JOB_TYPES, PNG_PROVINCES } from "@/types";

const JOB_POST_TEMPLATE = `# Job Title: [Job Title]

**Location:** [City, State / Remote / Hybrid]
**Job Type:** [Full-time / Part-time / Contract / Internship]
**Department:** [Department]
**Reports To:** [Manager Title]

## Job Summary
[Company Name] is seeking an experienced **[Job Title]** to manage cost estimation and bid preparation for our upcoming projects. You will work closely with clients, subcontractors, and our internal operations team to produce precise cost estimates, evaluate project risks, and help win profitable bids.

## Key Responsibilities
- Perform quantity takeoffs and compile itemized cost estimates for materials, labor, and equipment.
- Prepare and submit detailed bid packages according to client specifications and deadlines.
- Analyze architectural blueprints, structural drawings, and project spec sheets.
- Source quotes from vendors and subcontractors; evaluate bids for scope completeness and pricing.
- Conduct site visits and attend pre-bid meetings to verify project scope and field conditions.
- Assist project management teams during the project hand-off phase after a bid is awarded.

## Qualifications
- **Education:** [Degree Requirement or Equivalent Experience].
- **Experience:** [X] years of estimating experience in [Industry Type].
- **Technical Skills:** Proficient in [Estimating Software/Tools] and Microsoft Excel.
- **Blueprint Reading:** Ability to analyze complex schematics, architectural drawings, and technical scope documents.
- **Attributes:** Strong attention to detail, excellent negotiation skills, and ability to meet tight deadlines.

## Benefits & Compensation
- Salary: $[Base Salary Range]
- [Health, Dental, and Vision Insurance]
- [401(k) / Retirement Plan Options]
- [Paid Vacation and Holidays]

## How to Apply
Send your resume to [Email Address] or apply online at [Website Link].`;

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

  function applyTemplate() {
    setForm((prev) => ({
      ...prev,
      description_and_requirements: JOB_POST_TEMPLATE,
    }));
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
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-500">Use a detailed professional structure.</p>
          <button
            type="button"
            onClick={applyTemplate}
            className="text-xs font-semibold text-green-700 hover:text-green-800"
          >
            Use Job Template
          </button>
        </div>
        <textarea
          name="description_and_requirements"
          required
          rows={16}
          value={form.description_and_requirements}
          onChange={handleChange}
          placeholder="Paste full job details, or click Use Job Template."
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
