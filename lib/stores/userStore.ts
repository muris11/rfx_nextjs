import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WatchHistoryItem {
  id: string;
  title: string;
  poster: string;
  type: "drama" | "anime" | "komik" | "shorts";
  episodeId?: string;
  episodeTitle?: string;
  progress: number;
  duration: number;
  timestamp: number;
}

interface FavoriteItem {
  id: string;
  title: string;
  poster: string;
  type: "drama" | "anime" | "komik" | "shorts";
  addedAt: number;
}

interface UserStore {
  watchHistory: WatchHistoryItem[];
  favorites: FavoriteItem[];
  addToHistory: (item: Omit<WatchHistoryItem, "timestamp">) => void;
  updateProgress: (id: string, episodeId: string | undefined, progress: number, duration: number) => void;
  removeFromHistory: (id: string, episodeId?: string) => void;
  clearHistory: () => void;
  addFavorite: (item: { id: string; title: string; poster: string; type: "drama" | "anime" | "komik" | "shorts" }) => void;
  removeFavorite: (id: string) => void;
  clearFavorites: () => void;
  isFavorite: (id: string) => boolean;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      watchHistory: [],
      favorites: [],

      addToHistory: (item) => {
        set((state) => {
          const key = item.episodeId ? `${item.id}-${item.episodeId}` : item.id;
          const filtered = state.watchHistory.filter((h) => {
            const hKey = h.episodeId ? `${h.id}-${h.episodeId}` : h.id;
            return hKey !== key;
          });
          return {
            watchHistory: [
              { ...item, timestamp: Date.now() },
              ...filtered,
            ].slice(0, 100),
          };
        });
      },

      updateProgress: (id, episodeId, progress, duration) => {
        set((state) => ({
          watchHistory: state.watchHistory.map((h) => {
            const matches = h.id === id && h.episodeId === episodeId;
            return matches ? { ...h, progress, duration, timestamp: Date.now() } : h;
          }),
        }));
      },

      removeFromHistory: (id, episodeId) => {
        set((state) => ({
          watchHistory: state.watchHistory.filter((h) => {
            if (episodeId) {
              return !(h.id === id && h.episodeId === episodeId);
            }
            return h.id !== id;
          }),
        }));
      },

      clearHistory: () => set({ watchHistory: [] }),

      addFavorite: (item) => {
        set((state) => {
          if (state.favorites.some((f) => f.id === item.id)) return state;
          return {
            favorites: [{ ...item, addedAt: Date.now() }, ...state.favorites],
          };
        });
      },

      removeFavorite: (id) => {
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== id),
        }));
      },

      clearFavorites: () => set({ favorites: [] }),

      isFavorite: (id) => {
        return get().favorites.some((f) => f.id === id);
      },
    }),
    {
      name: "rfx-user-store",
    }
  )
);
