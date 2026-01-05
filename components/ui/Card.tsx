"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Heart, Star, Info, Plus } from "lucide-react";
import { useFavorites } from "@/lib/hooks/useUserData";
import { toast } from "sonner";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CardProps {
  id: string;
  title: string;
  cover: string;
  type: "drama" | "anime" | "komik" | "shorts";
  subtitle?: string;
  rating?: number | string;
  episodes?: number;
  className?: string;
  index?: number;
  backdrop?: string; // New: backdrop image for hover preview
  description?: string; // New: for quick view
  year?: string; // New: for quick view
  genre?: string[]; // New: for quick view
}

export default function Card({ 
  id, 
  title, 
  cover, 
  type, 
  // subtitle, 
  rating, 
  episodes,
  className = "",
  backdrop,
  description,
  year,
  genre,
}: CardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const href = type === "shorts" ? `/shorts/${id}` : `/${type}/${id}`;
  const favorite = isFavorite(id);
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleFavorite({ id, title, poster: cover, type });
    toast.success(added ? "Ditambahkan ke favorit" : "Dihapus dari favorit");
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };
  
  const ratingValue = typeof rating === "number" ? rating : rating != null ? Number(rating) : null;
  const hasRating = typeof ratingValue === "number" && Number.isFinite(ratingValue);

  return (
    <>
      <div 
        className={className}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={href} className="group block h-full relative">
          {/* Card Poster Container */}
          <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-surface shadow-lg transition-all duration-300 group-hover:shadow-[0_0_40px_rgba(229,9,20,0.4)] group-hover:scale-110 group-hover:z-50 z-10 origin-center ease-out">
            
            {/* Image with backdrop preview on hover */}
            <AnimatePresence mode="wait">
              {isHovered && backdrop ? (
                <motion.div
                  key="backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={backdrop}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    unoptimized
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="poster"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={cover || "/placeholder.svg"}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    unoptimized
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                  />
                </motion.div>
              )}
            </AnimatePresence>
          
          {/* Hover Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Center Play Button - Larger and more prominent */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 delay-75">
            <div className="w-14 h-14 rounded-full bg-primary/90 backdrop-blur-md border-2 border-white flex items-center justify-center shadow-2xl hover:bg-primary transition-colors">
              <Play className="w-7 h-7 text-white fill-white ml-0.5" />
            </div>
          </div>

          {/* Info Badge Container */}
          <div className="absolute top-2 left-2 right-2 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
             {/* Rating Badge */}
             {hasRating && (
                <div className="bg-black/70 backdrop-blur-md px-2.5 py-1.5 rounded-md text-xs font-bold text-[#46d369] flex items-center gap-1.5 shadow-md border border-white/10">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{ratingValue.toFixed(1)}</span>
                </div>
             )}

            {/* Action Buttons */}
            <div className="flex gap-1.5">
              {description && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleQuickView}
                  className="p-2 rounded-full bg-black/60 text-white hover:bg-white hover:text-black border border-white/10 backdrop-blur-md transition-all"
                  title="Quick View"
                >
                  <Info className="w-4 h-4" />
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleFavorite}
                className={`p-2 rounded-full transition-all ${
                  favorite
                    ? "bg-primary text-white shadow-[0_0_15px_rgba(229,9,20,0.6)]"
                    : "bg-black/60 text-white hover:bg-white hover:text-black border border-white/10"
                }`}
                title={favorite ? "Remove from favorites" : "Add to favorites"}
              >
                {favorite ? <Heart className="w-4 h-4 fill-white" /> : <Plus className="w-4 h-4" />}
              </motion.button>
            </div>
          </div>

          {/* Bottom Info - Visible on hover inside the card */}
          <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 delay-75">
            <h3 className="text-xs font-bold text-white line-clamp-1 mb-1.5 drop-shadow-lg">{title}</h3>
            
            <div className="flex items-center gap-2 text-[10px] text-gray-300">
               {episodes && (
                 <span className="text-white font-semibold">{episodes} EP</span>
               )}
               <span className="w-1 h-1 rounded-full bg-gray-500" />
               <span className="line-clamp-1 capitalize">{type}</span>
            </div>
          </div>
        </div>

        {/* Card Info Text - Always visible below card */}
        <div className="mt-2.5 space-y-1 px-1 transition-opacity duration-300 group-hover:opacity-60">
          <h3 className="text-sm font-semibold text-gray-200 line-clamp-1 group-hover:text-white transition-colors">
            {title}
          </h3>
          {year && (
            <p className="text-xs text-text-muted">{year}</p>
          )}
        </div>
      </Link>
    </div>

    {/* Quick View Modal */}
    <AnimatePresence>
      {showQuickView && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200]"
            onClick={() => setShowQuickView(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-2xl bg-surface rounded-xl overflow-hidden shadow-2xl z-[201] border border-white/10"
          >
            {/* Header Image */}
            <div className="relative h-64 w-full">
              <Image
                src={backdrop || cover}
                alt={title}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent" />
              
              {/* Close Button */}
              <button
                onClick={() => setShowQuickView(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 hover:bg-white/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  {year && <span>{year}</span>}
                  {hasRating && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1 text-[#46d369]">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-semibold">{ratingValue.toFixed(1)}</span>
                      </div>
                    </>
                  )}
                  {episodes && (
                    <>
                      <span>•</span>
                      <span>{episodes} Episodes</span>
                    </>
                  )}
                </div>
              </div>

              {genre && genre.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {genre.map((g, i) => (
                    <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-xs text-white">
                      {g}
                    </span>
                  ))}
                </div>
              )}

              {description && (
                <p className="text-sm text-text-secondary line-clamp-3 leading-relaxed">
                  {description}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Link href={href} className="flex-1">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 bg-white text-black font-bold px-6 py-3 rounded-lg hover:bg-white/90 transition-all"
                  >
                    <Play className="w-5 h-5 fill-black" />
                    Watch Now
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    handleFavorite(e);
                    setShowQuickView(false);
                  }}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    favorite
                      ? "bg-primary/20 text-primary border border-primary"
                      : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                  }`}
                >
                  {favorite ? "Remove" : "Add"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  </>
  );
}
