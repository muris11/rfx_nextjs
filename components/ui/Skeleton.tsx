"use client";

import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
  variant?: "default" | "card" | "text" | "circle" | "button";
  animate?: boolean;
}

export function Skeleton({ className = "", variant = "default", animate = true }: SkeletonProps) {
  const baseClasses = "bg-gradient-to-r from-surface via-surface-hover to-surface bg-[length:200%_100%] rounded";
  const animationClasses = animate ? "animate-shimmer" : "";
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`${baseClasses} ${animationClasses} ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-3"
    >
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-surface">
        <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface-hover to-surface bg-[length:200%_100%] animate-shimmer" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
      <div className="space-y-2 px-1">
        <div className="h-4 w-3/4 rounded bg-gradient-to-r from-surface via-surface-hover to-surface bg-[length:200%_100%] animate-shimmer" />
        <div className="h-3 w-1/2 rounded bg-gradient-to-r from-surface via-surface-hover to-surface bg-[length:200%_100%] animate-shimmer" style={{ animationDelay: '0.1s' }} />
      </div>
    </motion.div>
  );
}

export function ContentRowSkeleton({ count = 6 }: { count?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-4 py-4"
    >
      <div className="flex items-center gap-3 px-4 sm:px-6 lg:px-12">
        <div className="w-1.5 h-6 rounded-sm bg-primary/30 animate-pulse" />
        <div className="h-7 w-40 rounded-lg bg-gradient-to-r from-surface via-surface-hover to-surface bg-[length:200%_100%] animate-shimmer" />
      </div>
      <div className="flex gap-3 md:gap-4 overflow-hidden px-4 sm:px-6 lg:px-12">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[200px]"
          >
            <CardSkeleton />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export function HeroSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative h-[85vh] md:h-[90vh] min-h-[600px] w-full overflow-hidden mt-16 md:mt-20"
    >
      {/* Background shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface-hover to-surface bg-[length:200%_100%] animate-shimmer" />
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
      
      {/* Content skeleton */}
      <div className="absolute inset-0 flex flex-col justify-center pt-28 md:pt-32 pb-16 px-6 md:px-16 lg:px-24">
        <div className="max-w-2xl space-y-6">
          {/* Badges */}
          <div className="flex gap-2">
            <div className="h-8 w-24 rounded bg-primary/30 animate-pulse" />
            <div className="h-8 w-20 rounded bg-white/10 animate-pulse" style={{ animationDelay: '0.1s' }} />
            <div className="h-8 w-16 rounded bg-white/10 animate-pulse" style={{ animationDelay: '0.2s' }} />
          </div>
          
          {/* Title */}
          <div className="space-y-3">
            <div className="h-12 md:h-16 w-full max-w-lg rounded-lg bg-gradient-to-r from-surface via-surface-hover to-surface bg-[length:200%_100%] animate-shimmer" />
            <div className="h-12 md:h-16 w-3/4 max-w-md rounded-lg bg-gradient-to-r from-surface via-surface-hover to-surface bg-[length:200%_100%] animate-shimmer" style={{ animationDelay: '0.1s' }} />
          </div>
          
          {/* Meta info */}
          <div className="flex gap-4">
            <div className="h-5 w-20 rounded bg-white/10 animate-pulse" />
            <div className="h-5 w-24 rounded bg-white/10 animate-pulse" style={{ animationDelay: '0.1s' }} />
            <div className="h-5 w-28 rounded bg-white/10 animate-pulse" style={{ animationDelay: '0.2s' }} />
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 w-full max-w-xl rounded bg-white/5 animate-pulse" />
            <div className="h-4 w-4/5 max-w-lg rounded bg-white/5 animate-pulse" style={{ animationDelay: '0.1s' }} />
          </div>
          
          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <div className="h-14 w-44 rounded-lg bg-white/20 animate-pulse" />
            <div className="h-14 w-32 rounded-lg bg-white/10 animate-pulse" style={{ animationDelay: '0.1s' }} />
          </div>
        </div>
      </div>
      
      {/* Progress bar skeleton */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
        <div className="h-full w-1/3 bg-primary/50 animate-pulse" />
      </div>
    </motion.div>
  );
}

export function VideoPlayerSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="relative aspect-video bg-surface rounded-xl overflow-hidden border border-white/5"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface-hover to-surface bg-[length:200%_100%] animate-shimmer" />
      
      {/* Play button skeleton */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-white/10 animate-pulse flex items-center justify-center">
          <div className="w-0 h-0 border-l-[20px] border-l-white/30 border-y-[12px] border-y-transparent ml-2" />
        </div>
      </div>
      
      {/* Controls skeleton */}
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
        <div className="h-1 w-full rounded bg-white/10" />
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded bg-white/10 animate-pulse" />
            <div className="w-8 h-8 rounded bg-white/10 animate-pulse" />
            <div className="w-16 h-4 rounded bg-white/10 animate-pulse" />
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded bg-white/10 animate-pulse" />
            <div className="w-8 h-8 rounded bg-white/10 animate-pulse" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function DetailPageSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pt-16 pb-10"
    >
      {/* Hero backdrop skeleton */}
      <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface-hover to-surface bg-[length:200%_100%] animate-shimmer" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>
      
      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster skeleton */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="w-48 md:w-64 aspect-[2/3] rounded-xl overflow-hidden flex-shrink-0 shadow-2xl"
          >
            <div className="w-full h-full bg-gradient-to-r from-surface via-surface-hover to-surface bg-[length:200%_100%] animate-shimmer" />
          </motion.div>
          
          {/* Info skeleton */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex-1 space-y-4 pt-4"
          >
            <div className="h-12 w-3/4 max-w-md rounded-lg bg-gradient-to-r from-surface via-surface-hover to-surface bg-[length:200%_100%] animate-shimmer" />
            
            <div className="flex gap-3 flex-wrap">
              <div className="h-7 w-20 rounded-full bg-white/10 animate-pulse" />
              <div className="h-7 w-24 rounded-full bg-white/10 animate-pulse" />
              <div className="h-7 w-28 rounded-full bg-white/10 animate-pulse" />
            </div>
            
            <div className="space-y-2 py-2">
              <div className="h-4 w-full rounded bg-white/5 animate-pulse" />
              <div className="h-4 w-full rounded bg-white/5 animate-pulse" />
              <div className="h-4 w-2/3 rounded bg-white/5 animate-pulse" />
            </div>
            
            <div className="flex gap-4 pt-4">
              <div className="h-12 w-40 rounded-lg bg-white/20 animate-pulse" />
              <div className="h-12 w-32 rounded-lg bg-white/10 animate-pulse" />
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Episodes skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-6">
        <div className="h-8 w-48 rounded-lg bg-surface animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              className="h-24 rounded-lg bg-gradient-to-r from-surface via-surface-hover to-surface bg-[length:200%_100%] animate-shimmer"
              style={{ animationDelay: `${i * 0.05}s` }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function SearchResultsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className="flex gap-4 p-4 rounded-xl bg-surface/50"
        >
          <div className="w-24 h-36 rounded-lg bg-gradient-to-r from-surface via-surface-hover to-surface bg-[length:200%_100%] animate-shimmer flex-shrink-0" />
          <div className="flex-1 space-y-3 py-2">
            <div className="h-5 w-3/4 rounded bg-white/10 animate-pulse" />
            <div className="h-4 w-1/2 rounded bg-white/5 animate-pulse" />
            <div className="flex gap-2">
              <div className="h-6 w-16 rounded-full bg-white/5 animate-pulse" />
              <div className="h-6 w-20 rounded-full bg-white/5 animate-pulse" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function Top10Skeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-4 py-4"
    >
      <div className="flex items-center gap-3 px-4 sm:px-6 lg:px-12">
        <div className="w-7 h-7 rounded bg-primary/30 animate-pulse" />
        <div className="h-7 w-48 rounded-lg bg-gradient-to-r from-surface via-surface-hover to-surface bg-[length:200%_100%] animate-shimmer" />
      </div>
      <div className="flex gap-3 md:gap-4 overflow-hidden px-4 sm:px-6 lg:px-12">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="flex-shrink-0 w-[200px] sm:w-[240px] md:w-[280px] relative"
          >
            <div className="flex items-end">
              <div className="text-[120px] md:text-[160px] font-black text-white/5 leading-none">{i + 1}</div>
              <div className="ml-[-40px] w-[140px] aspect-[2/3] rounded-lg bg-gradient-to-r from-surface via-surface-hover to-surface bg-[length:200%_100%] animate-shimmer" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default Skeleton;
