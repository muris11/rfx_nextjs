"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Info, Star, Calendar, Clock, Hd } from "lucide-react";

interface CarouselItem {
  id: string;
  title: string;
  description?: string;
  cover: string;
  type: "drama" | "anime" | "komik";
  rating?: number;
  year?: string;
  quality?: string;
  duration?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  interval?: number;
}

export default function Carousel({ items, autoPlay = true, interval = 8000 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  // const progressRef = useRef<HTMLDivElement>(null);

  const next = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const goTo = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);

  // Reset timer on slide change or interaction
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (autoPlay && !isHovered) {
      timerRef.current = setInterval(next, interval);
    }
  }, [autoPlay, interval, next, isHovered]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  // Preload next image
  useEffect(() => {
    if (items.length > 1) {
      const nextIndex = (currentIndex + 1) % items.length;
      const img = new window.Image();
      img.src = items[nextIndex].cover;
    }
  }, [currentIndex, items]);

  if (!items.length) return null;

  const current = items[currentIndex];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 1.1,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
        scale: { duration: 8, ease: "linear" as const }
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 1,
      transition: { duration: 0.5 }
    }),
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1 + 0.3, duration: 0.5, ease: "easeOut" as const }
    })
  };

  return (
    <div 
      className="relative h-[85vh] md:h-[90vh] min-h-[600px] w-full overflow-hidden bg-black group mb-8 mt-16 md:mt-20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background with Motion */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 z-0"
        >
          <Image
            src={current.cover}
            alt={current.title}
            fill
            className="object-cover object-center"
            priority
            unoptimized
          />
          
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40" />
        </motion.div>
      </AnimatePresence>

      {/* Content Container */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center pt-28 md:pt-32 pb-16 px-6 md:px-16 lg:px-24">
        <div className="max-w-2xl space-y-4">
          
          {/* Metadata Badges - Larger and more prominent */}
          <motion.div 
            custom={0}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            key={`meta-${currentIndex}`}
            className="flex items-center gap-2.5"
          >
            <span className="px-3 py-1.5 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded shadow-lg">
              Featured
            </span>
            <span className="px-3 py-1.5 bg-white/20 text-white text-xs font-semibold uppercase tracking-wider rounded backdrop-blur-sm">
              {current.type}
            </span>
            {current.quality && (
              <span className="px-3 py-1.5 bg-white/20 text-white text-xs font-bold uppercase rounded flex items-center gap-1.5 backdrop-blur-sm">
                <Hd className="w-3.5 h-3.5" />
                {current.quality}
              </span>
            )}
          </motion.div>

          {/* Title */}
          <motion.h1 
            custom={1}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            key={`title-${currentIndex}`}
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-2xl"
          >
            {current.title}
          </motion.h1>

          {/* Info Line - Year, Episodes/Duration, Rating */}
          <motion.div 
            custom={2}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            key={`info-${currentIndex}`}
            className="flex items-center gap-4 text-sm md:text-base text-white/90"
          >
            {current.year && (
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                {current.year}
              </span>
            )}
            {current.duration && (
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 md:w-5 md:h-5" />
                {current.duration}
              </span>
            )}
            {current.rating && (
              <span className="flex items-center gap-2 text-[#46d369] font-semibold">
                <Star className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                {(current.rating * 10).toFixed(0)}% Match
              </span>
            )}
          </motion.div>

          {/* Description */}
          {current.description && (
            <motion.p 
              custom={3}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              key={`desc-${currentIndex}`}
              className="text-sm md:text-base lg:text-lg text-white/80 line-clamp-2 leading-relaxed max-w-xl"
            >
              {current.description}
            </motion.p>
          )}

          {/* Buttons - Larger and more prominent */}
          <motion.div 
            custom={4}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            key={`btns-${currentIndex}`}
            className="flex items-center gap-3 pt-2"
          >
            <Link href={`/${current.type}/${current.id}/watch/1`}>
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(255, 255, 255, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 bg-white text-black font-bold px-8 py-3.5 rounded-lg hover:bg-white/90 transition-all shadow-xl"
              >
                <Play className="w-6 h-6 fill-black" />
                <span className="text-base">Tonton Sekarang</span>
              </motion.button>
            </Link>
            <Link href={`/${current.type}/${current.id}`}>
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.35)" }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 bg-white/20 text-white font-semibold px-8 py-3.5 rounded-lg transition-all backdrop-blur-sm border border-white/30"
              >
                <Info className="w-6 h-6" />
                <span className="text-base">Info</span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Progress Bar */}
      {autoPlay && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-30">
          <motion.div
            key={currentIndex}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: interval / 1000, ease: "linear" }}
            className="h-full bg-[#E50914]"
          />
        </div>
      )}

      {/* Navigation Arrows - Only visible on hover/desktop */}
      {items.length > 1 && (
        <>
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            whileTap={{ scale: 0.9 }}
            onClick={prev}
            className="absolute left-6 z-30 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full border border-white/10 bg-black/20 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 hidden md:flex group-hover:opacity-100 opacity-0"
            aria-label="Previous"
          >
            <ChevronLeft className="w-8 h-8" />
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            whileTap={{ scale: 0.9 }}
            onClick={next}
            className="absolute right-6 z-30 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full border border-white/10 bg-black/20 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 hidden md:flex group-hover:opacity-100 opacity-0"
            aria-label="Next"
          >
            <ChevronRight className="w-8 h-8" />
          </motion.button>
        </>
      )}

      {/* Slide Indicators */}
      <div className="absolute bottom-4 right-8 z-30 flex gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`h-1.5 rounded-full transition-all duration-500 shadow-sm ${
              index === currentIndex 
                ? "w-8 bg-[#E50914] shadow-[0_0_10px_#E50914]" 
                : "w-2 bg-white/30 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
