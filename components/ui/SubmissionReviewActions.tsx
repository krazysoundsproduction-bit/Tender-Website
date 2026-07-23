"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SubmissionReviewActionsProps {
  submissionType: "tender" | "job";
  submissionId: string;
}

export default function SubmissionReviewActions({
  submissionType,
  submissionId,
}: SubmissionReviewActionsProps) {
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const [error, setError] = useState("");

  async function submitDecision(action: "approve" | "reject") {
    setLoading(action);
    setError("");

    const endpoint =
      submissionType === "tender"
        ? `/api/admin/submissions/tenders/${submissionId}`
        : `/api/admin/submissions/jobs/${submissionId}`;

    const response = await fetch(endpoint, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        review_notes: notes.trim() || null,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error ?? "Failed to review submission.");
      setLoading(null);
      return;
    }

    setLoading(null);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </p>
      )}
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
        placeholder="Optional review notes"
        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => submitDecision("approve")}
          disabled={loading !== null}
          className="px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60"
        >
          {loading === "approve" ? "Approving..." : "Approve & Publish"}
        </button>
        <button
          type="button"
          onClick={() => submitDecision("reject")}
          disabled={loading !== null}
          className="px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-60"
        >
          {loading === "reject" ? "Rejecting..." : "Reject"}
        </button>
      </div>
    </div>
  );
}
