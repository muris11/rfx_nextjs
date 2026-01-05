"use client";

import { useWatchHistory } from "@/lib/hooks/useUserData";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play, X } from "lucide-react";

export default function ContinueWatching() {
  const { continueWatching, removeFromHistory } = useWatchHistory();

  if (continueWatching.length === 0) return null;

  const getWatchUrl = (item: typeof continueWatching[0]) => {
    const ep = item.episodeId || '1';
    switch (item.type) {
      case 'drama':
        return `/drama/${item.id}/watch/${ep}`;
      case 'anime':
        return `/anime/${item.id}/watch`;
      case 'komik':
        return `/komik/${item.id}/read/${ep}`;
      case 'shorts':
        return `/shorts/${item.id}`;
      default:
        return `/drama/${item.id}/watch/${ep}`;
    }
  };

  const getProgressPercent = (item: typeof continueWatching[0]) => {
    if (!item.duration || item.duration === 0) return 0;
    return Math.round((item.progress / item.duration) * 100);
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl md:text-2xl font-bold text-white">Continue Watching</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {continueWatching.slice(0, 4).map((item, index) => (
          <motion.div
            key={`${item.id}-${item.episodeId}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
          >
            <Link
              href={getWatchUrl(item)}
              className="block"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden bg-[#1A1A1A]">
                <Image
                  src={item.poster}
                  alt={item.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-14 h-14 rounded-full bg-[#E50914] flex items-center justify-center shadow-lg"
                  >
                    <Play className="w-7 h-7 text-white fill-white ml-1" />
                  </motion.div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#E50914] rounded-full"
                      style={{ width: `${getProgressPercent(item)}%` }}
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeFromHistory(item.id, item.episodeId);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                  aria-label="Remove from continue watching"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              <div className="mt-2">
                <h3 className="text-sm font-medium text-white line-clamp-1">{item.title}</h3>
                {item.episodeTitle && (
                  <p className="text-xs text-[#B3B3B3]">{item.episodeTitle}</p>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
