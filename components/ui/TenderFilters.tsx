"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PNG_PROVINCES, TENDER_CATEGORIES } from "@/types";

interface TenderFiltersProps {
  currentSearch?: string;
  currentCategory?: string;
  currentLocation?: string;
  currentActiveOnly?: boolean;
}

export default function TenderFilters({
  currentSearch = "",
  currentCategory = "",
  currentLocation = "",
  currentActiveOnly = true,
}: TenderFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(currentSearch);
  const [category, setCategory] = useState(currentCategory);
  const [location, setLocation] = useState(currentLocation);
  const [activeOnly, setActiveOnly] = useState(currentActiveOnly);

  type FilterState = {
    search: string;
    category: string;
    location: string;
    activeOnly: boolean;
  };

  function applyFilters(overrides?: Partial<FilterState>) {
    const filters: FilterState = { search, category, location, activeOnly, ...overrides };
    const params = new URLSearchParams(searchParams.toString());

    if (filters.search) params.set("search", filters.search);
    else params.delete("search");

    if (filters.category) params.set("category", filters.category);
    else params.delete("category");

    if (filters.location) params.set("location", filters.location);
    else params.delete("location");

    params.set("activeOnly", filters.activeOnly ? "1" : "0");
    params.delete("page");

    router.push(`/tenders?${params.toString()}`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    applyFilters();
  }

  function clearFilters() {
    setSearch("");
    setCategory("");
    setLocation("");
    setActiveOnly(true);
    router.push("/tenders");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border rounded-xl shadow-sm p-4 space-y-4"
    >
      <h2 className="font-semibold text-gray-700">Filter Tenders</h2>

      <div>
        <label
          htmlFor="tender-search"
          className="block text-sm text-gray-600 mb-1"
        >
          Search
        </label>
        <input
          id="tender-search"
          type="text"
          placeholder="Search by title or organisation…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="tender-category"
          className="block text-sm text-gray-600 mb-1"
        >
          Category
        </label>
        <select
          id="tender-category"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
          }}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {TENDER_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="tender-location"
          className="block text-sm text-gray-600 mb-1"
        >
          Location / Province
        </label>
        <select
          id="tender-location"
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
          }}
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
          id="tender-active"
          type="checkbox"
          checked={activeOnly}
          onChange={(e) => setActiveOnly(e.target.checked)}
          className="h-4 w-4 text-blue-600 rounded"
        />
        <label htmlFor="tender-active" className="text-sm text-gray-600">
          Active tenders only (hide expired)
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
