"use client";

import { useState } from "react";

interface ContactMessage {
  id: string;
  phone_number: string;
  email: string;
  message: string;
  created_at: string;
}

function formatDate(d: string) {
  return new Date(d).toLocaleString("en-PG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function InboxMessages({
  initialMessages,
}: {
  initialMessages: ContactMessage[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this message?")) return;

    setDeleting(id);
    try {
      const response = await fetch(`/api/admin/contact/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        alert("Failed to delete message");
        setDeleting(null);
        return;
      }

      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    } catch (err) {
      alert("Error deleting message");
      console.error(err);
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-4">
      {messages.length === 0 ? (
        <p className="text-sm text-gray-500">No messages in inbox.</p>
      ) : (
        messages.map((item) => (
          <article
            key={item.id}
            className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded">
                    {item.email}
                  </span>
                  <span className="text-xs text-gray-500">{formatDate(item.created_at)}</span>
                </div>
                <p className="text-sm font-medium text-gray-700">
                  <span className="text-gray-500">Phone:</span> {item.phone_number}
                </p>
                <p className="mt-3 text-sm text-gray-700 whitespace-pre-wrap">{item.message}</p>
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                disabled={deleting === item.id}
                className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors disabled:opacity-50"
              >
                {deleting === item.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </article>
        ))
      )}
    </div>
  );
}
