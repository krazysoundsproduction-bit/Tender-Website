import PublicTenderSubmissionForm from "@/components/ui/PublicTenderSubmissionForm";
import PublicJobSubmissionForm from "@/components/ui/PublicJobSubmissionForm";

export default function SubmitListingPage() {
  return (
    <div className="bg-gray-50 py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Submit A Tender Or Job Vacancy
        </h1>
        <p className="text-gray-600 mb-8 max-w-3xl">
          Submit your listing for review. Admins verify each submission before it
          is published publicly.
        </p>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <section>
            <h2 className="text-xl font-semibold text-blue-800 mb-4">
              Tender Submission
            </h2>
            <PublicTenderSubmissionForm />
          </section>

          <section>
            <h2 className="text-xl font-semibold text-green-700 mb-4">
              Job Vacancy Submission
            </h2>
            <PublicJobSubmissionForm />
          </section>
        </div>
      </div>
    </div>
  );
}
