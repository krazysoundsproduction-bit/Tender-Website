import TenderForm from "@/components/ui/TenderForm";
import { requireAdminUser } from "@/lib/auth/admin";

export default async function NewTenderPage() {
  await requireAdminUser();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Tender</h1>
      <TenderForm />
    </div>
  );
}
