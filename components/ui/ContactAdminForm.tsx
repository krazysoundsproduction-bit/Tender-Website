"use client";

import { useState } from "react";

export default function ContactAdminForm() {
  const [form, setForm] = useState({
    phone_number: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone_number: form.phone_number.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error ?? "Unable to send message.");
      setLoading(false);
      return;
    }

    setSuccess("Your message has been sent to admin.");
    setForm({ phone_number: "", email: "", message: "" });
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

      <Field label="Phone Number" required>
        <input
          name="phone_number"
          type="tel"
          required
          value={form.phone_number}
          onChange={handleChange}
          placeholder="e.g. +675 7XX XXXX"
          className={inputClass}
        />
      </Field>

      <Field label="Email Address" required>
        <input
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          placeholder="you@company.com"
          className={inputClass}
        />
      </Field>

      <Field label="Short Message" required>
        <textarea
          name="message"
          required
          maxLength={500}
          rows={4}
          value={form.message}
          onChange={handleChange}
          placeholder="Tell admin what you need help with..."
          className={`${inputClass} resize-y`}
        />
        <p className="text-xs text-gray-500 mt-1">Max 500 characters.</p>
      </Field>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-700 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-800 transition-colors disabled:opacity-60"
      >
        {loading ? "Sending..." : "Send To Admin"}
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
