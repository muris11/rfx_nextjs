import { Suspense } from "react";
import { Metadata } from "next";
import KomikList from "./KomikList";
import { ContentRowSkeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = {
  title: "Comics",
  description: "Read the latest manga, manhwa, and manhua online",
};

interface Props {
  searchParams: Promise<{ tab?: string; page?: string }>;
}

export default async function KomikPage({ searchParams }: Props) {
  const params = await searchParams;
  
  return (
    <div className="pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Comics</h1>
          <p className="mt-2 text-[#B3B3B3]">
            Read manga, manhwa, and manhua online
          </p>
        </div>

        <Suspense fallback={<ContentRowSkeleton />}>
          <KomikList 
            tab={params.tab || "popular"} 
            page={parseInt(params.page || "1")}
          />
        </Suspense>
      </div>
    </div>
  );
}
