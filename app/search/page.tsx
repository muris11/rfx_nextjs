import { Suspense } from "react";
import { Metadata } from "next";
import SearchResults from "./SearchResults";
import { ContentRowSkeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = {
  title: "Search",
  description: "Search for dramas, anime, and comics",
};

interface Props {
  searchParams: Promise<{ q?: string; type?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = params.q || "";
  const type = params.type || "all";
  
  return (
    <div className="pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {query ? `Search results for "${query}"` : "Search"}
          </h1>
          <p className="mt-2 text-[#B3B3B3]">
            Find your favorite dramas, anime, and comics
          </p>
        </div>

        <Suspense fallback={<ContentRowSkeleton />}>
          <SearchResults query={query} type={type} />
        </Suspense>
      </div>
    </div>
  );
}
