import { CardSkeleton } from "./Skeleton";

export function HomeSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Skeleton */}
      <div className="relative h-[90vh] min-h-[600px] w-full bg-[#121212] overflow-hidden">
        <div className="absolute inset-0 shimmer opacity-20" />
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 lg:px-24 max-w-7xl mx-auto">
          <div className="space-y-6 max-w-3xl mt-16 md:mt-0">
            {/* Badges */}
            <div className="flex gap-3">
              <div className="h-6 w-20 bg-white/10 rounded shimmer" />
              <div className="h-6 w-16 bg-white/10 rounded shimmer" />
            </div>
            
            {/* Title */}
            <div className="h-16 w-3/4 md:w-1/2 bg-white/10 rounded-lg shimmer" />
            
            {/* Info */}
            <div className="flex gap-6">
              <div className="h-5 w-24 bg-white/10 rounded shimmer" />
              <div className="h-5 w-24 bg-white/10 rounded shimmer" />
            </div>
            
            {/* Desc */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-white/10 rounded shimmer" />
              <div className="h-4 w-5/6 bg-white/10 rounded shimmer" />
              <div className="h-4 w-4/6 bg-white/10 rounded shimmer" />
            </div>
            
            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <div className="h-14 w-40 bg-white/10 rounded-lg shimmer" />
              <div className="h-14 w-40 bg-white/10 rounded-lg shimmer" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Rows Skeleton */}
      <div className="max-w-[1600px] mx-auto space-y-12 -mt-24 relative z-20 px-4 sm:px-6 lg:px-8 pb-20">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-4">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-6 bg-white/10 rounded-full" />
               <div className="h-8 w-48 bg-white/10 rounded shimmer" />
            </div>
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3, 4, 5, 6, 7].map((j) => (
                <div key={j} className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[200px]">
                  <CardSkeleton />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
