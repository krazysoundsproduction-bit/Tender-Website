"use client";

import { useState } from "react";

export default function FastJobForm() {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    submitter_name: "",
    submitter_email: "",
    job_title: "",
    location: "",
    closing_date: "",
    payment_amount: "",
    completion_timeframe: "",
    poster_name: "",
    poster_phone: "",
    poster_whatsapp: "",
    preferred_contact: "Phone",
    poster_email: "",
  });

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.job_title.trim()) return setError("Please enter a type of work needed.");
    if (!form.payment_amount.trim()) return setError("Please enter the payment amount.");
    if (!form.poster_name.trim()) return setError("Please enter a contact person name.");
    if (!form.poster_phone.trim()) return setError("Please enter a phone number.");

    setLoading(true);
    try {
      const payload = {
        submitter_name: form.submitter_name.trim(),
        submitter_email: form.submitter_email.trim(),
        job_title: form.job_title.trim(),
        company_name: form.poster_name.trim(),
        location: form.location.trim() || "Papua New Guinea",
        closing_date: form.closing_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        description_and_requirements: `Fast Job & Pay\nType of Work: ${form.job_title}\nPaying: ${form.payment_amount}\nComplete Within: ${form.completion_timeframe}\nContact: ${form.poster_name} — ${form.poster_phone}`,
        application_email_or_link: form.poster_email || form.poster_phone,
        is_fast_job: true,
        payment_amount: form.payment_amount.trim(),
        completion_timeframe: form.completion_timeframe.trim(),
        poster_name: form.poster_name.trim(),
        poster_phone: form.poster_phone.trim(),
        poster_email: form.poster_email.trim() || null,
        preferred_contact: form.preferred_contact,
      };

      const res = await fetch("/api/submissions/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Submission failed.");
      }

      setSuccess("Your Fast Job has been submitted for review! We'll publish it shortly.");
      setForm({
        submitter_name: "",
        submitter_email: "",
        job_title: "",
        location: "",
        closing_date: "",
        payment_amount: "",
        completion_timeframe: "",
        poster_name: "",
        poster_phone: "",
        poster_whatsapp: "",
        preferred_contact: "Phone",
        poster_email: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <div className="bg-green-50 border border-green-300 text-green-800 rounded-lg p-4 text-sm">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      {/* Your Details */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-4">
        <h3 className="font-semibold text-gray-800">Your Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Your Name</label>
            <input
              type="text"
              value={form.submitter_name}
              onChange={(e) => set("submitter_name", e.target.value)}
              placeholder="Your full name"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Your Email</label>
            <input
              type="email"
              value={form.submitter_email}
              onChange={(e) => set("submitter_email", e.target.value)}
              placeholder="your@email.com"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Job Details */}
      <div className="bg-yellow-50 rounded-xl p-4 space-y-4">
        <h3 className="font-semibold text-gray-800">⚡ Job Details</h3>

        <div>
          <label className={labelClass}>
            Type of Work Needed <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={form.job_title}
            onChange={(e) => set("job_title", e.target.value)}
            placeholder="e.g. Grass cutting, House cleaning, Furniture delivery…"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              Paying <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.payment_amount}
              onChange={(e) => set("payment_amount", e.target.value)}
              placeholder="e.g. K200 - K500"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Complete Within</label>
            <input
              type="text"
              value={form.completion_timeframe}
              onChange={(e) => set("completion_timeframe", e.target.value)}
              placeholder="e.g. 1 day, 3 days, 1 week"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Location</label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
            placeholder="e.g. Port Moresby, NCD"
            className={inputClass}
          />
        </div>
      </div>

      {/* Contact Person */}
      <div className="bg-white border rounded-xl p-4 space-y-4">
        <h3 className="font-semibold text-gray-800">Contact Person Details</h3>

        <div>
          <label className={labelClass}>
            Contact Person Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={form.poster_name}
            onChange={(e) => set("poster_name", e.target.value)}
            placeholder="Full name of person to contact"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={form.poster_phone}
              onChange={(e) => set("poster_phone", e.target.value)}
              placeholder="+675 7XXX XXXX"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>WhatsApp Number</label>
            <input
              type="tel"
              value={form.poster_whatsapp}
              onChange={(e) => set("poster_whatsapp", e.target.value)}
              placeholder="+675 7XXX XXXX (if different)"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Email (optional)</label>
          <input
            type="email"
            value={form.poster_email}
            onChange={(e) => set("poster_email", e.target.value)}
            placeholder="contact@email.com"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Preferred Contact Method</label>
          <select
            value={form.preferred_contact}
            onChange={(e) => set("preferred_contact", e.target.value)}
            className={inputClass}
          >
            <option value="Phone">Phone</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Both">Both</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
      >
        {loading ? "Submitting…" : "⚡ Submit Fast Job"}
      </button>
    </form>
  );
}
