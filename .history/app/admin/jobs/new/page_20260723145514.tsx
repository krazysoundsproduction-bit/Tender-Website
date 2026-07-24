import JobForm from "@/components/ui/JobForm";
import { requireAdminUser } from "@/lib/auth/admin";

export default async function NewJobPage() {
  await requireAdminUser();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Job Vacancy</h1>
      <JobForm />
    </div>
  );
}
