import JobForm from "@/components/ui/JobForm";

export default function NewJobPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Job Vacancy</h1>
      <JobForm />
    </div>
  );
}
