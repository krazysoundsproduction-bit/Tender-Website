"use client";

import { useState } from "react";

interface DeleteButtonProps {
  itemId: string;
  itemType: "tender" | "job";
  itemName: string;
  onDeleteSuccess?: () => void;
}

export default function DeleteButton({
  itemId,
  itemType,
  itemName,
  onDeleteSuccess,
}: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setIsDeleting(true);
    setError("");

    try {
      const endpoint =
        itemType === "tender"
          ? `/api/admin/tenders/${itemId}/delete`
          : `/api/admin/jobs/${itemId}/delete`;

      const response = await fetch(endpoint, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete");
      }

      // Reload the page to reflect changes
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setIsDeleting(false);
    }
  }

  if (showConfirm) {
    return (
      <div className="flex gap-2">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-red-600 hover:text-red-800 text-xs font-medium disabled:opacity-50"
        >
          {isDeleting ? "Deleting..." : "Confirm"}
        </button>
        <button
          onClick={() => {
            setShowConfirm(false);
            setError("");
          }}
          disabled={isDeleting}
          className="text-gray-600 hover:text-gray-800 text-xs font-medium disabled:opacity-50"
        >
          Cancel
        </button>
        {error && <span className="text-red-600 text-xs">{error}</span>}
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="text-red-600 hover:text-red-800 text-xs font-medium"
      title={`Delete ${itemType}: ${itemName}`}
    >
      Delete
    </button>
  );
}
