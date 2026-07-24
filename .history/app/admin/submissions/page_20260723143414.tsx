import { createClient } from "@/lib/supabase/server";
import SubmissionReviewActions from "@/components/ui/SubmissionReviewActions";
import type { JobSubmission, TenderSubmission } from "@/types";

function formatDate(d: string) {
  return new Date(d).toLocaleString("en-PG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminSubmissionsPage() {
  const supabase = await createClient();

  const [{ data: tenderSubmissions }, { data: jobSubmissions }] = await Promise.all([
    supabase
      .from("tender_submissions")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false }),
    supabase
      .from("job_submissions")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Submission Review</h1>
        <p className="text-sm text-gray-600">
          Review public submissions and choose whether to publish them.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-blue-800 mb-4">Tender Submissions</h2>
        {!tenderSubmissions || tenderSubmissions.length === 0 ? (
          <p className="text-sm text-gray-500">No pending tender submissions.</p>
        ) : (
          <div className="space-y-4">
            {(tenderSubmissions as TenderSubmission[]).map((submission) => (
              <article key={submission.id} className="bg-white border rounded-xl p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{submission.title}</h3>
                    <p className="text-sm text-gray-600">{submission.organization}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    Submitted {formatDate(submission.created_at)}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                  <p>
                    <span className="font-medium">Category:</span> {submission.category}
                  </p>
                  <p>
                    <span className="font-medium">Location:</span> {submission.location}
                  </p>
                  <p>
                    <span className="font-medium">Closing:</span> {formatDate(submission.closing_date)}
                  </p>
                  <p>
                    <span className="font-medium">Submitter:</span> {submission.submitter_name} ({submission.submitter_email})
                  </p>
                </div>

                <p className="mt-3 text-sm text-gray-700 whitespace-pre-wrap">
                  {submission.description}
                </p>

                <div className="mt-4">
                  <SubmissionReviewActions
                    submissionType="tender"
                    submissionId={submission.id}
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold text-green-700 mb-4">Job Submissions</h2>
        {!jobSubmissions || jobSubmissions.length === 0 ? (
          <p className="text-sm text-gray-500">No pending job submissions.</p>
        ) : (
          <div className="space-y-4">
            {(jobSubmissions as JobSubmission[]).map((submission) => (
              <article key={submission.id} className="bg-white border rounded-xl p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{submission.job_title}</h3>
                    <p className="text-sm text-gray-600">{submission.company_name}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    Submitted {formatDate(submission.created_at)}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                  <p>
                    <span className="font-medium">Job Type:</span> {submission.job_type}
                  </p>
                  <p>
                    <span className="font-medium">Location:</span> {submission.location}
                  </p>
                  <p>
                    <span className="font-medium">Closing:</span> {formatDate(submission.closing_date)}
                  </p>
                  <p>
                    <span className="font-medium">Submitter:</span> {submission.submitter_name} ({submission.submitter_email})
                  </p>
                </div>

                <p className="mt-3 text-sm text-gray-700 whitespace-pre-wrap">
                  {submission.description_and_requirements}
                </p>

                <p className="mt-3 text-sm text-gray-700">
                  <span className="font-medium">Application:</span> {submission.application_email_or_link}
                </p>

                <div className="mt-4">
                  <SubmissionReviewActions
                    submissionType="job"
                    submissionId={submission.id}
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
