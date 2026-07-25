"use client";

import { useState } from "react";
import PublicTenderSubmissionForm from "@/components/ui/PublicTenderSubmissionForm";
import PublicJobSubmissionForm from "@/components/ui/PublicJobSubmissionForm";
import FastJobForm from "@/components/ui/FastJobForm";

type View = null | "tender" | "job" | "fastjob";

const OPTIONS = [
  {
    key: "tender" as View,
    icon: "📋",
    title: "Tender",
    description: "Submit a government or private procurement tender notice.",
    color: "border-blue-300 hover:border-blue-500 hover:bg-blue-50",
    badge: "bg-blue-100 text-blue-800",
  },
  {
    key: "job" as View,
    icon: "💼",
    title: "Job Vacancy",
    description: "Post a full-time, part-time, contract, or internship role.",
    color: "border-green-300 hover:border-green-500 hover:bg-green-50",
    badge: "bg-green-100 text-green-800",
  },
  {
    key: "fastjob" as View,
    icon: "⚡",
    title: "Fast Job & Pay",
    description: "Quick micro-task with direct contact — get someone hired fast.",
    color: "border-yellow-300 hover:border-yellow-500 hover:bg-yellow-50",
    badge: "bg-yellow-100 text-yellow-800",
  },
];

const TITLES: Record<string, string> = {
  tender: "📋 Tender Submission",
  job: "💼 Job Vacancy Submission",
  fastjob: "⚡ Fast Job & Pay Submission",
};

export default function SubmitListingPage() {
  const [view, setView] = useState<View>(null);

  return (
    <div className="bg-gray-50 min-h-screen py-10 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Selector */}
        {view === null && (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Submit a Listing
            </h1>
            <p className="text-gray-600 mb-8">
              Choose what you'd like to submit. Admins review every submission
              before it goes live.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {OPTIONS.map((opt) => (
                <button
                  key={opt.key as string}
                  onClick={() => setView(opt.key)}
                  className={`text-left border-2 rounded-2xl p-6 transition-all cursor-pointer bg-white ${opt.color}`}
                >
                  <span className="text-4xl block mb-3">{opt.icon}</span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${opt.badge}`}
                  >
                    {opt.title}
                  </span>
                  <p className="text-sm text-gray-600 mt-2">{opt.description}</p>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Form view */}
        {view !== null && (
          <>
            <button
              onClick={() => setView(null)}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              ← Back
            </button>

            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              {TITLES[view]}
            </h1>

            <div className="bg-white border rounded-2xl shadow-sm p-6 sm:p-8">
              {view === "tender" && <PublicTenderSubmissionForm />}
              {view === "job" && <PublicJobSubmissionForm />}
              {view === "fastjob" && <FastJobForm />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
