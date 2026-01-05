"use client";

import Link from "next/link";
import { Play, CheckCircle } from "lucide-react";

interface Episode {
  id: string;
  number: number;
  title?: string;
  thumbnail?: string;
  duration?: string;
  isWatched?: boolean;
}

interface EpisodeListProps {
  episodes: Episode[];
  currentEpisode?: number;
  dramaId: string;
  type?: "drama" | "anime";
}

export default function EpisodeList({ 
  episodes, 
  currentEpisode,
  dramaId,
  type = "drama"
}: EpisodeListProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Episodes</h3>
      <div className="grid gap-2 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#333] scrollbar-track-transparent">
        {episodes.map((episode) => {
          const isActive = episode.number === currentEpisode;
          return (
            <Link
              key={episode.id}
              href={`/${type}/${dramaId}/watch/${episode.number}`}
              className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-[#E50914] text-white"
                  : "bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white"
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                isActive ? "bg-white/20" : "bg-[#333]"
              }`}>
                {isActive ? (
                  <Play className="w-4 h-4 fill-current" />
                ) : episode.isWatched ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <span className="text-sm font-medium">{episode.number}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  Episode {episode.number}
                  {episode.title && `: ${episode.title}`}
                </p>
                {episode.duration && (
                  <p className={`text-xs ${isActive ? "text-white/70" : "text-[#B3B3B3]"}`}>
                    {episode.duration}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
