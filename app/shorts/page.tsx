import { Suspense } from "react";
import { Metadata } from "next";
import ShortsList from "./ShortsList";
import { ContentRowSkeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = {
  title: "Shorts",
  description: "Watch short dramas and quick entertainment",
};

interface Props {
  searchParams: Promise<{ tab?: string }>;
}

export default async function ShortsPage({ searchParams }: Props) {
  const params = await searchParams;
  
  return (
    <div className="pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Shorts</h1>
          <p className="mt-2 text-[#B3B3B3]">
            Quick entertainment, endless fun
          </p>
        </div>

        <Suspense fallback={<ContentRowSkeleton />}>
          <ShortsList tab={params.tab || "melolo"} />
        </Suspense>
      </div>
    </div>
  );
}
