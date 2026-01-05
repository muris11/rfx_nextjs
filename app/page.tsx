import { Suspense } from "react";
import HomeContent from "./HomeContent";
import { HeroSkeleton, ContentRowSkeleton } from "@/components/ui/Skeleton";

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-8">
          <HeroSkeleton />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <ContentRowSkeleton />
            <ContentRowSkeleton />
            <ContentRowSkeleton />
            <ContentRowSkeleton />
          </div>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
