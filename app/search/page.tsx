import type { Metadata } from "next";

import { QuickSearch } from "@/components/QuickSearch";

export const metadata: Metadata = {
  title: "Quick Search",
  description:
    "Search for a single PC component and see every listing found for it across 7 Sri Lankan online stores, sorted by price.",
  robots: {
    // Search-result pages are infinite in their parameters and offer no
    // unique value to a search engine over the static pages - keep them
    // out of the index, but still let Google follow links from them.
    index: false,
    follow: true,
  },
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;

  return (
    <div className="mx-auto max-w-5xl px-3 py-4 sm:px-4 sm:py-6">
      <h1 className="mb-4 text-lg font-semibold text-white">Quick Search</h1>
      <QuickSearch initialQuery={q ?? ""} />
    </div>
  );
}
