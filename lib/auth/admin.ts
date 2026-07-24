import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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

export function isAdminUser(user: User | null) {
  if (!user) return false;

  if (user.app_metadata?.role === "admin") {
    return true;
  }

  const adminEmails = parseAdminEmails();
  if (!user.email) return false;

  return adminEmails.includes(user.email.toLowerCase());
}

export async function requireAdminUser() {
  const { supabase, user } = await getAuthContext();

  if (!user) {
    redirect("/admin/login");
  }

  if (!isAdminUser(user)) {
    redirect("/");
  }

  return { supabase, user };
}
