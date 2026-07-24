"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import LogoUploadField from "@/components/ui/LogoUploadField";
import { TENDER_CATEGORIES, PNG_PROVINCES } from "@/types";
import type { Tender } from "@/types";

interface TenderFormProps {
  tender?: Tender;
}

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

export default function TenderForm({ tender }: TenderFormProps) {
  const router = useRouter();
  const isEditing = Boolean(tender);

  const toDateTimeLocal = (isoString?: string) => {
    if (!isoString) return "";
    const d = new Date(isoString);
    return d.toISOString().slice(0, 16);
  };

  const toIsoOrNow = (dateValue?: string) => {
    if (!dateValue) return new Date().toISOString();
    const parsed = new Date(dateValue);
    return Number.isNaN(parsed.getTime())
      ? new Date().toISOString()
      : parsed.toISOString();
  };

  const [form, setForm] = useState({
    title: tender?.title ?? "",
    organization: tender?.organization ?? "",
    company_logo_url: tender?.company_logo_url ?? "",
    category: tender?.category ?? TENDER_CATEGORIES[0],
    location: tender?.location ?? PNG_PROVINCES[0],
    closing_date: toDateTimeLocal(tender?.closing_date),
    tender_reference_number: "",
    project_title: tender?.title ?? "",
    procuring_entity: tender?.organization ?? "",
    date_of_issuance: "",
    scope_of_work: tender?.description ?? "",
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

    const supabase = createClient();

    const payload = {
      title: form.project_title.trim() || "Untitled Tender",
      organization: form.procuring_entity.trim() || "Not specified",
      company_logo_url: form.company_logo_url.trim() || null,
      category: form.category || "Other",
      location: form.location || "Nationwide",
      closing_date: toIsoOrNow(form.closing_date),
      description,
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
      noValidate
      className="bg-white border rounded-xl shadow-sm p-6 space-y-4"
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <Section title="1. Basic Tender Details" defaultOpen>
      <Field label="Tender Title" required>
        <input
          name="project_title"
          type="text"
          required
          value={form.project_title}
          onChange={handleChange}
          placeholder="e.g. Supply of Medical Equipment"
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

      <Section title="2. Scope And Requirements" defaultOpen>

      <Field label="Organisation" required>
        <input
          name="procuring_entity"
          type="text"
          required
          value={form.procuring_entity}
          onChange={handleChange}
          placeholder="e.g. Department of Health"
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
            placeholder="e.g. ITT-2026-042"
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
            placeholder="e.g. 23 July 2026"
            className={inputClass}
          />
        </Field>
      </div>

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

      <Field label="Description / Requirements" required>
        <textarea
          name="scope_of_work"
          required
          rows={5}
          value={form.scope_of_work}
          onChange={handleChange}
          placeholder="Write introduction and project scope of work."
          className={`${inputClass} resize-y`}
        />
      </Field>
      </Section>

      <Section title="3. Submission And Clarifications" defaultOpen>

      <Field label="Estimated Duration" required>
        <input
          name="estimated_duration"
          type="text"
          required
          value={form.estimated_duration}
          onChange={handleChange}
          placeholder="e.g. 6 Months"
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
          placeholder="List mandatory bidder documents and requirements."
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
          placeholder="Explain how bidders request or download documents."
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
          placeholder="Include date, time, and venue or meeting link."
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
            placeholder="tenders@company.com"
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
            placeholder="TENDER SUBMISSION: [Ref] - [Project] - [Company]"
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
          placeholder="e.g. PDF only, ZIP allowed for large files"
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
          placeholder="e.g. 30 Aug 2026 at 5:00 PM"
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
            placeholder="Procurement Officer"
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
            placeholder="procurement@company.com"
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
            placeholder="+675 ..."
            className={inputClass}
          />
        </Field>
      </div>
      </Section>

      <Section title="4. Preview And Attachments" defaultOpen>
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
      </Section>

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
