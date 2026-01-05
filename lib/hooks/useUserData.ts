"use client";

import { useUserStore } from "@/lib/stores/userStore";
import { useCallback } from "react";

export function useWatchHistory() {
  const { watchHistory, addToHistory, updateProgress, removeFromHistory, clearHistory } =
    useUserStore();

  const continueWatching = watchHistory.filter(
    (item) => item.progress && item.progress > 0 && item.duration > 0 && (item.progress / item.duration) < 0.95
  );

  const recentlyWatched = watchHistory.slice(0, 10);

  return {
    watchHistory,
    continueWatching,
    recentlyWatched,
    addToHistory,
    updateProgress,
    removeFromHistory,
    clearHistory,
  };
}

export function useFavorites() {
  const { favorites, addFavorite, removeFavorite, isFavorite, clearFavorites } = useUserStore();

  const toggleFavorite = useCallback(
    (item: { id: string; title: string; poster: string; type: "drama" | "anime" | "komik" | "shorts" }) => {
      if (isFavorite(item.id)) {
        removeFavorite(item.id);
        return false;
      } else {
        addFavorite(item);
        return true;
      }
    },
    [addFavorite, removeFavorite, isFavorite]
  );

  return {
    favorites,
    addFavorite,
    removeFavorite,
    clearFavorites,
    isFavorite,
    toggleFavorite,
  };
}
