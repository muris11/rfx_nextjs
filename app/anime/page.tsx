import { Suspense } from "react";
import { Metadata } from "next";
import AnimeList from "./AnimeList";
import { ContentRowSkeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = {
  title: "Anime",
  description: "Browse and watch the latest anime series and movies",
};

interface Props {
  searchParams: Promise<{ tab?: string; page?: string }>;
}

export default async function AnimePage({ searchParams }: Props) {
  const params = await searchParams;
  
  return (
    <div className="pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Anime</h1>
          <p className="mt-2 text-[#B3B3B3]">
            Watch the latest anime series and movies
          </p>
        </div>

        <Suspense fallback={<ContentRowSkeleton />}>
          <AnimeList 
            tab={params.tab || "latest"} 
            page={parseInt(params.page || "1")}
          />
        </Suspense>
      </div>
    </div>
  );
}
