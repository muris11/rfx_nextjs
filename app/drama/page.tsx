import { Suspense } from "react";
import { Metadata } from "next";
import DramaList from "./DramaList";
import { ContentRowSkeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = {
  title: "Drama",
  description: "Browse and watch the latest dramas from around the world",
};

interface Props {
  searchParams: Promise<{ tab?: string; genre?: string; page?: string }>;
}

export default async function DramaPage({ searchParams }: Props) {
  const params = await searchParams;
  
  return (
    <div className="pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Drama</h1>
          <p className="mt-2 text-[#B3B3B3]">
            Discover amazing dramas from around the world
          </p>
        </div>

        <Suspense fallback={<ContentRowSkeleton />}>
          <DramaList 
            tab={params.tab || "trending"} 
            genre={params.genre}
            page={parseInt(params.page || "1")}
          />
        </Suspense>
      </div>
    </div>
  );
}
