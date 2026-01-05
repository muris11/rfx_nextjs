"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Card from "../ui/Card";
import { CardSkeleton } from "../ui/Skeleton";
import { motion } from "framer-motion";

interface ContentItem {
  id: string;
  title: string;
  cover: string;
  subtitle?: string;
  rating?: number;
  episodes?: number;
}

interface ContentRowProps {
  title: string;
  items: ContentItem[];
  type: "drama" | "anime" | "komik" | "shorts";
  href?: string;
  isLoading?: boolean;
}

export default function ContentRow({ 
  title, 
  items, 
  type, 
  href,
  isLoading = false 
}: ContentRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="group/section space-y-3 py-2 relative">
      {/* Header */}
      <div className="flex items-end justify-between px-4 sm:px-6 lg:px-12 z-20 relative">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-3">
           <div className="w-1.5 h-6 rounded-sm bg-primary shadow-[0_0_15px_var(--color-primary)]" />
           <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent drop-shadow-lg">
             {title}
           </span>
        </h2>
        {href && (
          <Link
            href={href}
            className="group flex items-center gap-1 text-xs md:text-sm font-semibold text-text-secondary hover:text-white transition-colors"
          >
            Explore All
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-primary" />
          </Link>
        )}
      </div>

      {/* Carousel Container */}
      <div className="relative group/carousel">
        
        {/* Left Arrow */}
        <div className={`absolute left-0 top-0 bottom-8 z-30 w-16 bg-gradient-to-r from-background/80 to-transparent pointer-events-none transition-opacity duration-300 ${showLeftArrow ? 'opacity-100' : 'opacity-0'}`}>
           <button
             onClick={() => scroll("left")}
             className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/10 text-white hover:bg-white hover:text-black transition-all duration-300 pointer-events-auto opacity-0 group-hover/carousel:opacity-100 hidden md:flex items-center justify-center backdrop-blur-sm"
             aria-label="Scroll left"
           >
             <ChevronLeft className="w-6 h-6" />
           </button>
        </div>

        {/* Scrollable Content */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-12 pb-12 pt-2 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[200px]">
                  <CardSkeleton />
                </div>
              ))
            : items.map((item, index) => (
                <motion.div 
                  key={item.id} 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index < 6 ? index * 0.05 : 0, ease: "easeOut" }}
                  className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[200px]"
                >
                  <Card
                    id={item.id}
                    title={item.title}
                    cover={item.cover}
                    type={type}
                    subtitle={item.subtitle}
                    rating={item.rating}
                    episodes={item.episodes}
                  />
                </motion.div>
              ))}
        </div>

        {/* Right Arrow */}
        <div className={`absolute right-0 top-0 bottom-8 z-30 w-16 bg-gradient-to-l from-background/80 to-transparent pointer-events-none transition-opacity duration-300 ${showRightArrow ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={() => scroll("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/10 text-white hover:bg-white hover:text-black transition-all duration-300 pointer-events-auto opacity-0 group-hover/carousel:opacity-100 hidden md:flex items-center justify-center backdrop-blur-sm"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
