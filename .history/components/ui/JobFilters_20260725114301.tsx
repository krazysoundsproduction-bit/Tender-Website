"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PNG_PROVINCES, JOB_TYPES } from "@/types";

interface JobFiltersProps {
  currentSearch?: string;
  currentJobType?: string;
  currentLocation?: string;
  currentActiveOnly?: boolean;
  currentIsFastJob?: boolean;
}

export default function JobFilters({
  currentSearch = "",
  currentJobType = "",
  currentLocation = "",
  currentActiveOnly = true,
  currentIsFastJob = false,
}: JobFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(currentSearch);
  const [jobType, setJobType] = useState(currentJobType);
  const [location, setLocation] = useState(currentLocation);
  const [activeOnly, setActiveOnly] = useState(currentActiveOnly);
  const [isFastJob, setIsFastJob] = useState(currentIsFastJob);

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());

    if (search) params.set("search", search);
    else params.delete("search");

    if (jobType) params.set("jobType", jobType);
    else params.delete("jobType");

    if (location) params.set("location", location);
    else params.delete("location");

    if (isFastJob) params.set("isFastJob", "1");
    else params.delete("isFastJob");

    params.set("activeOnly", activeOnly ? "1" : "0");
    params.delete("page");

    router.push(`/jobs?${params.toString()}`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    applyFilters();
  }

  function clearFilters() {
    setSearch("");
    setJobType("");
    setLocation("");
    setActiveOnly(true);
    setIsFastJob(false);
    router.push("/jobs");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border rounded-xl shadow-sm p-4 space-y-4"
    >
      <h2 className="font-semibold text-gray-700">Filter Jobs</h2>

      <div>
        <label htmlFor="job-search" className="block text-sm text-gray-600 mb-1">
          Search
        </label>
        <input
          id="job-search"
          type="text"
          placeholder="Search by title or company…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="job-type"
          className="block text-sm text-gray-600 mb-1"
        >
          Job Type
        </label>
        <select
          id="job-type"
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          {JOB_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="job-location"
          className="block text-sm text-gray-600 mb-1"
        >
          Location / Province
        </label>
        <select
          id="job-location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Locations</option>
          {PNG_PROVINCES.map((prov) => (
            <option key={prov} value={prov}>
              {prov}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="job-active"
          type="checkbox"
          checked={activeOnly}
          onChange={(e) => setActiveOnly(e.target.checked)}
          className="h-4 w-4 text-blue-600 rounded"
        />
        <label htmlFor="job-active" className="text-sm text-gray-600">
          Active listings only (hide expired)
        </label>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-blue-700 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-800 transition-colors"
        >
          Apply Filters
        </button>
        <button
          type="button"
          onClick={clearFilters}
          className="px-4 border border-gray-300 text-gray-600 rounded-lg py-2 text-sm hover:bg-gray-50 transition-colors"
        >
          Clear
        </button>
      </div>
    </form>
  );
}
