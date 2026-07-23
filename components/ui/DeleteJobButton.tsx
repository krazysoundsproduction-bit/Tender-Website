"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DeleteJobButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this job vacancy? This cannot be undone.")) {
      return;
    }
    setLoading(true);
    const supabase = createClient();
    await supabase.from("job_vacancies").delete().eq("id", id);
    router.push("/admin/jobs");
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 border border-red-300 px-4 py-2 rounded-lg text-sm hover:bg-red-50 transition-colors disabled:opacity-60"
    >
      {loading ? "Deleting…" : "Delete"}
    </button>
  );
}
