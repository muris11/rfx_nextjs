"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Top10Item {
  id: string;
  title: string;
  cover: string;
  type: "drama" | "anime" | "komik" | "shorts";
  rank: number;
}

interface Top10RowProps {
  title: string;
  items: Top10Item[];
  type: "drama" | "anime" | "komik" | "shorts";
}

export default function Top10Row({ title, items, type }: Top10RowProps) {
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
      {/* Header with Gradient Title */}
      <div className="flex items-end justify-between px-4 sm:px-6 lg:px-12 z-20 relative">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-3">
          <TrendingUp className="w-6 h-6 md:w-7 md:h-7 text-primary" />
          <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent drop-shadow-lg">
            {title}
          </span>
        </h2>
      </div>

      {/* Carousel Container */}
      <div className="relative group/carousel">
        {/* Left Arrow */}
        <div className={`absolute left-0 top-0 bottom-8 z-30 w-16 bg-gradient-to-r from-background/80 to-transparent pointer-events-none transition-opacity duration-300 ${showLeftArrow ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={() => scroll("left")}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 border border-white/10 text-white hover:bg-white hover:text-black transition-all duration-300 pointer-events-auto opacity-0 group-hover/carousel:opacity-100 hidden md:flex items-center justify-center backdrop-blur-sm hover:scale-110"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-12 pb-12 pt-2 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index < 6 ? index * 0.05 : 0, ease: "easeOut" }}
              className="flex-shrink-0 w-[200px] sm:w-[240px] md:w-[280px] relative group"
            >
              <Link href={`/${type}/${item.id}`} className="block">
                <div className="relative">
                  {/* Massive Rank Number */}
                  <div className="absolute -left-4 bottom-0 z-10 pointer-events-none">
                    <span 
                      className="text-[180px] md:text-[220px] font-black leading-none"
                      style={{
                        WebkitTextStroke: "3px rgba(255, 255, 255, 0.15)",
                        WebkitTextFillColor: "transparent",
                        textShadow: "0 0 40px rgba(0, 0, 0, 0.8)",
                      }}
                    >
                      {item.rank}
                    </span>
                  </div>

                  {/* Card */}
                  <div className="relative ml-12 aspect-[2/3] rounded-lg overflow-hidden bg-surface shadow-2xl transition-all duration-300 group-hover:shadow-[0_0_50px_rgba(229,9,20,0.5)] group-hover:scale-105 group-hover:z-50 z-20">
                    <Image
                      src={item.cover}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 200px, (max-width: 1024px) 240px, 280px"
                      unoptimized
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-sm md:text-base font-bold text-white line-clamp-2 mb-2 drop-shadow-lg">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-primary rounded text-xs font-bold text-white">
                            #{item.rank}
                          </span>
                          <span className="text-xs text-gray-300 capitalize">{type}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Right Arrow */}
        <div className={`absolute right-0 top-0 bottom-8 z-30 w-16 bg-gradient-to-l from-background/80 to-transparent pointer-events-none transition-opacity duration-300 ${showRightArrow ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={() => scroll("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 border border-white/10 text-white hover:bg-white hover:text-black transition-all duration-300 pointer-events-auto opacity-0 group-hover/carousel:opacity-100 hidden md:flex items-center justify-center backdrop-blur-sm hover:scale-110"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </div>
      </div>
    </section>
  );
}
