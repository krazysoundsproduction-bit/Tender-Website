import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import JobForm from "@/components/ui/JobForm";
import DeleteJobButton from "@/components/ui/DeleteJobButton";
import type { JobVacancy } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditJobPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("job_vacancies")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Job Vacancy</h1>
        <DeleteJobButton id={id} />
      </div>
      <JobForm job={data as JobVacancy} />
    </div>
  );
}
