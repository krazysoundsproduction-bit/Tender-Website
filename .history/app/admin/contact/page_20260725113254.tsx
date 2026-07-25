import { createAdminClient } from "@/lib/supabase/server";
import { requireAdminUser } from "@/lib/auth/admin";
import InboxMessages from "@/components/ui/InboxMessages";

interface ContactMessage {
  id: string;
  phone_number: string;
  email: string;
  message: string;
  created_at: string;
}

export default async function AdminInboxPage() {
  await requireAdminUser();

  const adminClient = createAdminClient();
  const { data: messages } = await adminClient
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">📬 Inbox</h1>
      <p className="text-sm text-gray-600 mb-6">
        Messages from visitors submitted through the contact form.
      </p>

      <InboxMessages initialMessages={(messages as ContactMessage[]) || []} />
    </div>
  );
}
