import { createClient } from "@/lib/supabase/server";

function parseAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function getAuthContext() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, user };
}

export function isAdminUser(
  user: { email?: string | null; app_metadata?: { role?: string } } | null
) {
  if (!user) return false;

  if (user.app_metadata?.role === "admin") {
    return true;
  }

  const adminEmails = parseAdminEmails();
  if (!user.email) return false;

  return adminEmails.includes(user.email.toLowerCase());
}
