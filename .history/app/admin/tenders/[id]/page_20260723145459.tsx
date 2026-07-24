import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TenderForm from "@/components/ui/TenderForm";
import DeleteTenderButton from "@/components/ui/DeleteTenderButton";
import type { Tender } from "@/types";
import { requireAdminUser } from "@/lib/auth/admin";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTenderPage({ params }: PageProps) {
  await requireAdminUser();
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tenders")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Tender</h1>
        <DeleteTenderButton id={id} />
      </div>
      <TenderForm tender={data as Tender} />
    </div>
  );
}
