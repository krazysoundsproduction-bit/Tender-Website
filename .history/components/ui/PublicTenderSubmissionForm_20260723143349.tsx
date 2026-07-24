"use client";

import { useState } from "react";
import { PNG_PROVINCES, TENDER_CATEGORIES } from "@/types";

export default function PublicTenderSubmissionForm() {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    submitter_name: "",
    submitter_email: "",
    title: "",
    organization: "",
    category: TENDER_CATEGORIES[0],
    location: PNG_PROVINCES[0],
    closing_date: "",
    description: "",
    document_url: "",
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
    setForm({
      submitter_name: "",
      submitter_email: "",
      title: "",
      organization: "",
      category: TENDER_CATEGORIES[0],
      location: PNG_PROVINCES[0],
      closing_date: "",
      description: "",
      document_url: "",
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

      <h2 className="text-lg font-semibold text-gray-900 pt-2">Tender Details</h2>
      <Field label="Tender Title" required>
        <input
          name="title"
          type="text"
          required
          value={form.title}
          onChange={handleChange}
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
          className={inputClass}
        />
      </Field>

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
