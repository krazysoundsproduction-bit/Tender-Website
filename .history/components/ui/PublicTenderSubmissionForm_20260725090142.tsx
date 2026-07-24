"use client";

import { useState } from "react";
import { PNG_PROVINCES, TENDER_CATEGORIES } from "@/types";
import LogoUploadField from "@/components/ui/LogoUploadField";
import MultiImageUpload from "@/components/ui/MultiImageUpload";

function buildTenderDescription(form: {
  tender_reference_number: string;
  project_title: string;
  procuring_entity: string;
  date_of_issuance: string;
  scope_of_work: string;
  estimated_duration: string;
  eligibility_requirements: string;
  document_collection: string;
  pre_tender_conference: string;
  submission_email: string;
  email_subject_line: string;
  file_format_rules: string;
  submission_deadline: string;
  clarification_contact_person: string;
  clarification_email: string;
  clarification_phone: string;
}) {
  return `# INVITATION TO TENDER (ITT)
**Tender Reference Number:** ${form.tender_reference_number}

**Project Title:** ${form.project_title}
**Procuring Entity:** ${form.procuring_entity}
**Date of Issuance:** ${form.date_of_issuance}

## 1. Introduction & Scope of Work
${form.scope_of_work}

- **Location:** ${form.procuring_entity}
- **Estimated Duration:** ${form.estimated_duration}

## 2. Eligibility & Minimum Requirements
${form.eligibility_requirements}

## 3. Collection of Tender Documents
${form.document_collection}

## 4. Site Visit & Pre-Tender Conference
${form.pre_tender_conference}

## 5. Submission Guidelines & Deadline
- **Submission Email Address:** ${form.submission_email}
- **Email Subject Line:** ${form.email_subject_line}
- **File Format:** ${form.file_format_rules}
- **Submission Deadline:** ${form.submission_deadline}

## 6. Enquiries & Clarifications
- **Contact Person:** ${form.clarification_contact_person}
- **Email:** ${form.clarification_email}
- **Phone:** ${form.clarification_phone}`;
}

export default function PublicTenderSubmissionForm() {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [form, setForm] = useState({
    submitter_name: "",
    submitter_email: "",
    title: "",
    organization: "",
    company_logo_url: "",
    category: TENDER_CATEGORIES[0],
    location: PNG_PROVINCES[0],
    closing_date: "",
    tender_reference_number: "",
    project_title: "",
    procuring_entity: "",
    date_of_issuance: "",
    scope_of_work: "",
    estimated_duration: "",
    eligibility_requirements: "",
    document_collection: "",
    pre_tender_conference: "",
    submission_email: "",
    email_subject_line: "",
    file_format_rules: "",
    submission_deadline: "",
    clarification_contact_person: "",
    clarification_email: "",
    clarification_phone: "",
    document_url: "",
    source_url: "",
  });

  const toIsoOrNow = (dateValue?: string) => {
    if (!dateValue) return new Date().toISOString();
    const parsed = new Date(dateValue);
    return Number.isNaN(parsed.getTime())
      ? new Date().toISOString()
      : parsed.toISOString();
  };

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

    const description = buildTenderDescription({
      tender_reference_number: form.tender_reference_number.trim(),
      project_title: form.project_title.trim(),
      procuring_entity: form.procuring_entity.trim(),
      date_of_issuance: form.date_of_issuance.trim(),
      scope_of_work: form.scope_of_work.trim(),
      estimated_duration: form.estimated_duration.trim(),
      eligibility_requirements: form.eligibility_requirements.trim(),
      document_collection: form.document_collection.trim(),
      pre_tender_conference: form.pre_tender_conference.trim(),
      submission_email: form.submission_email.trim(),
      email_subject_line: form.email_subject_line.trim(),
      file_format_rules: form.file_format_rules.trim(),
      submission_deadline: form.submission_deadline.trim(),
      clarification_contact_person: form.clarification_contact_person.trim(),
      clarification_email: form.clarification_email.trim(),
      clarification_phone: form.clarification_phone.trim(),
    });

    const payload = {
      ...form,
      submitter_name: form.submitter_name.trim() || "Anonymous",
      submitter_email: form.submitter_email.trim() || "unknown@example.com",
      title: form.project_title.trim() || "Untitled Tender",
      organization: form.procuring_entity.trim() || "Not specified",
      description,
      company_logo_url: form.company_logo_url.trim() || null,
      closing_date: toIsoOrNow(form.closing_date),
      document_url: form.document_url.trim() || null,
      source_url: form.source_url.trim() || null,
    };

    const response = await fetch("/api/submissions/tenders", {
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

    setSuccess("Your tender has been submitted for admin review.");
    setImageUrls([]);
    setForm({
      submitter_name: "",
      submitter_email: "",
      title: "",
      organization: "",
      company_logo_url: "",
      category: TENDER_CATEGORIES[0],
      location: PNG_PROVINCES[0],
      closing_date: "",
      tender_reference_number: "",
      project_title: "",
      procuring_entity: "",
      date_of_issuance: "",
      scope_of_work: "",
      estimated_duration: "",
      eligibility_requirements: "",
      document_collection: "",
      pre_tender_conference: "",
      submission_email: "",
      email_subject_line: "",
      file_format_rules: "",
      submission_deadline: "",
      clarification_contact_person: "",
      clarification_email: "",
      clarification_phone: "",
      document_url: "",
      source_url: "",
    });
    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
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

      <Section title="2. Basic Tender Details" defaultOpen>
      <Field label="Tender Title" required>
        <input
          name="project_title"
          type="text"
          required
          value={form.project_title}
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

      <Section title="3. Scope And Requirements" defaultOpen>

      <Field label="Organisation" required>
        <input
          name="procuring_entity"
          type="text"
          required
          value={form.procuring_entity}
          onChange={handleChange}
          className={inputClass}
        />
      </Field>

      <LogoUploadField
        value={form.company_logo_url}
        onChange={(url) => setForm((prev) => ({ ...prev, company_logo_url: url }))}
        folder="tenders"
        label="Company Logo"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Tender Reference Number" required>
          <input
            name="tender_reference_number"
            type="text"
            required
            value={form.tender_reference_number}
            onChange={handleChange}
            className={inputClass}
          />
        </Field>

        <Field label="Date of Issuance" required>
          <input
            name="date_of_issuance"
            type="text"
            required
            value={form.date_of_issuance}
            onChange={handleChange}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Category" required>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={inputClass}
          >
            {TENDER_CATEGORIES.map((item) => (
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

      <Field label="Description / Requirements" required>
        <textarea
          name="scope_of_work"
          required
          rows={5}
          value={form.scope_of_work}
          onChange={handleChange}
          className={`${inputClass} resize-y`}
        />
      </Field>
      </Section>

      <Section title="4. Submission And Clarifications" defaultOpen>

      <Field label="Estimated Duration" required>
        <input
          name="estimated_duration"
          type="text"
          required
          value={form.estimated_duration}
          onChange={handleChange}
          className={inputClass}
        />
      </Field>

      <Field label="Eligibility & Minimum Requirements" required>
        <textarea
          name="eligibility_requirements"
          required
          rows={5}
          value={form.eligibility_requirements}
          onChange={handleChange}
          className={`${inputClass} resize-y`}
        />
      </Field>

      <Field label="Collection of Tender Documents" required>
        <textarea
          name="document_collection"
          required
          rows={4}
          value={form.document_collection}
          onChange={handleChange}
          className={`${inputClass} resize-y`}
        />
      </Field>

      <Field label="Site Visit / Pre-Tender Conference" required>
        <textarea
          name="pre_tender_conference"
          required
          rows={4}
          value={form.pre_tender_conference}
          onChange={handleChange}
          className={`${inputClass} resize-y`}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Submission Email Address" required>
          <input
            name="submission_email"
            type="email"
            required
            value={form.submission_email}
            onChange={handleChange}
            className={inputClass}
          />
        </Field>

        <Field label="Email Subject Line" required>
          <input
            name="email_subject_line"
            type="text"
            required
            value={form.email_subject_line}
            onChange={handleChange}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="File Format Rules" required>
        <input
          name="file_format_rules"
          type="text"
          required
          value={form.file_format_rules}
          onChange={handleChange}
          className={inputClass}
        />
      </Field>

      <Field label="Submission Deadline" required>
        <input
          name="submission_deadline"
          type="text"
          required
          value={form.submission_deadline}
          onChange={handleChange}
          className={inputClass}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Clarification Contact Person" required>
          <input
            name="clarification_contact_person"
            type="text"
            required
            value={form.clarification_contact_person}
            onChange={handleChange}
            className={inputClass}
          />
        </Field>

        <Field label="Clarification Email" required>
          <input
            name="clarification_email"
            type="email"
            required
            value={form.clarification_email}
            onChange={handleChange}
            className={inputClass}
          />
        </Field>

        <Field label="Clarification Phone" required>
          <input
            name="clarification_phone"
            type="text"
            required
            value={form.clarification_phone}
            onChange={handleChange}
            className={inputClass}
          />
        </Field>
      </div>
        </Section>

        <Section title="5. Preview And Links" defaultOpen>
          <Field label="Generated Tender Notice" required>
            <textarea
              readOnly
              rows={14}
              value={buildTenderDescription({
                tender_reference_number: form.tender_reference_number,
                project_title: form.project_title,
                procuring_entity: form.procuring_entity,
                date_of_issuance: form.date_of_issuance,
                scope_of_work: form.scope_of_work,
                estimated_duration: form.estimated_duration,
                eligibility_requirements: form.eligibility_requirements,
                document_collection: form.document_collection,
                pre_tender_conference: form.pre_tender_conference,
                submission_email: form.submission_email,
                email_subject_line: form.email_subject_line,
                file_format_rules: form.file_format_rules,
                submission_deadline: form.submission_deadline,
                clarification_contact_person: form.clarification_contact_person,
                clarification_email: form.clarification_email,
                clarification_phone: form.clarification_phone,
              })}
              className={`${inputClass} resize-y`}
            />
          </Field>

          <Field label="Document URL (optional)">
            <input
              name="document_url"
              type="url"
              value={form.document_url}
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
        </Section>

      <Section title="Optional: Upload Photos">
        <MultiImageUpload
          onImagesSelect={setImageUrls}
          maxImages={6}
          label="Tender Photos"
          helperText="Optional: Upload up to 6 photos (project site, plans, documentation, etc.)"
        />
      </Section>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-700 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-800 transition-colors disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Submit Tender For Review"}
      </button>
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
