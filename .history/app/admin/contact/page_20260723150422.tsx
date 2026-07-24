import { createClient } from "@/lib/supabase/server";
import { requireAdminUser } from "@/lib/auth/admin";

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

export default async function AdminContactMessagesPage() {
  await requireAdminUser();

  const supabase = await createClient();
  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Contact Messages</h1>
      <p className="text-sm text-gray-600 mb-6">
        Messages submitted by the public through the contact form.
      </p>

      {!messages || messages.length === 0 ? (
        <p className="text-sm text-gray-500">No contact messages yet.</p>
      ) : (
        <div className="space-y-4">
          {(messages as ContactMessage[]).map((item) => (
            <article key={item.id} className="bg-white border rounded-xl p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="text-sm text-gray-700">
                  <p>
                    <span className="font-semibold">Phone:</span> {item.phone_number}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span> {item.email}
                  </p>
                </div>
                <span className="text-xs text-gray-500">{formatDate(item.created_at)}</span>
              </div>
              <p className="mt-3 text-sm text-gray-800 whitespace-pre-wrap">{item.message}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
