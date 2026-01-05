"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ContentGrid from "@/components/content/ContentGrid";
import Button from "@/components/ui/Button";

interface AnimeListProps {
  tab: string;
  page: number;
}

const tabs = [
  { id: "all", label: "All" },
  { id: "latest", label: "Latest" },
  { id: "movie", label: "Movies" },
];

interface AnimeItem {
  id?: string;
  url?: string;
  title?: string;
  judul?: string;
  cover?: string;
  poster?: string;
  rating?: number;
  score?: string;
  episodes?: number;
  total_episode?: number;
}

function extractItems(data: unknown): AnimeItem[] {
  if (!data) return [];
  
  // Direct array
  if (Array.isArray(data)) return data;
  
  if (typeof data === "object" && data !== null) {
    const obj = data as Record<string, unknown>;
    
    // Common patterns
    if (Array.isArray(obj.data)) return obj.data as AnimeItem[];
    if (Array.isArray(obj.result)) return obj.result as AnimeItem[];
    if (Array.isArray(obj.list)) return obj.list as AnimeItem[];
    if (Array.isArray(obj.items)) return obj.items as AnimeItem[];
    if (Array.isArray(obj.animes)) return obj.animes as AnimeItem[];
    if (Array.isArray(obj.movies)) return obj.movies as AnimeItem[];
    
    // Nested data object
    if (obj.data && typeof obj.data === "object" && !Array.isArray(obj.data)) {
      const inner = obj.data as Record<string, unknown>;
      if (Array.isArray(inner.list)) return inner.list as AnimeItem[];
      if (Array.isArray(inner.result)) return inner.result as AnimeItem[];
      if (Array.isArray(inner.items)) return inner.items as AnimeItem[];
    }
  }
  return [];
}

export default function AnimeList({ tab, page }: AnimeListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<AnimeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(tab);
  const [endpointCount, setEndpointCount] = useState(0);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const debug: string[] = [];
      
      try {
        const allItems: AnimeItem[] = [];
        const seenIds = new Set<string>();
        let successCount = 0;

        const addItems = (data: unknown, endpoint: string) => {
          const extracted = extractItems(data);
          debug.push(`${endpoint}: ${extracted.length} items`);
          
          extracted.forEach((item) => {
            // Use id or url as unique identifier
            const id = item.id || item.url || "";
            if (id && !seenIds.has(id)) {
              seenIds.add(id);
              allItems.push(item);
            }
          });
        };

        const fetchEndpoint = async (endpoint: string): Promise<{ data: unknown; endpoint: string }> => {
          try {
            const res = await fetch(endpoint);
            if (res.ok) {
              successCount++;
              const data = await res.json();
              return { data, endpoint };
            } else {
              debug.push(`${endpoint}: HTTP ${res.status}`);
            }
          } catch (err) {
            debug.push(`${endpoint}: Error - ${err}`);
          }
          return { data: null, endpoint };
        };

        let endpoints: string[] = [];

        if (currentTab === "all") {
          endpoints = [
            ...Array.from({ length: 10 }, (_, i) => `/api/sansekai/anime/latest?page=${i + 1}`),
            "/api/sansekai/anime/movie",
          ];
        } else if (currentTab === "latest") {
          endpoints = Array.from({ length: 10 }, (_, i) => `/api/sansekai/anime/latest?page=${i + 1}`);
        } else if (currentTab === "movie") {
          endpoints = ["/api/sansekai/anime/movie"];
        }

        const results = await Promise.all(endpoints.map(fetchEndpoint));
        results.forEach(({ data, endpoint }) => {
          if (data) addItems(data, endpoint);
        });

        setItems(allItems);
        setEndpointCount(successCount);
        setDebugInfo(debug);
      } catch (error) {
        console.error("Failed to fetch anime:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentTab]);

  const handleTabChange = (newTab: string) => {
    setCurrentTab(newTab);
    setItems([]);
    setDebugInfo([]);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);
    params.delete("page");
    router.push(`/anime?${params.toString()}`);
  };

  const normalizedItems = items.map((item) => ({
    id: item.id || item.url || "",
    title: item.title || item.judul || "",
    cover: item.cover || item.poster || "",
    rating: item.rating || (item.score ? parseFloat(item.score) : undefined),
    episodes: item.episodes || item.total_episode,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Button
            key={t.id}
            variant={currentTab === t.id ? "primary" : "secondary"}
            size="sm"
            onClick={() => handleTabChange(t.id)}
          >
            {t.label}
          </Button>
        ))}
      </div>

      <div className="glass-light rounded-xl p-4">
        <p className="text-sm text-[#B3B3B3]">
          Tab: <span className="text-white font-semibold">{tabs.find((t) => t.id === currentTab)?.label}</span>
          {" "}• Endpoints called: <span className="text-[#FF3D71]">{endpointCount}</span>
          {" "}• Total items: <span className="text-[#00D9FF]">{items.length}</span>
        </p>
        {debugInfo.length > 0 && (
          <details className="mt-2">
            <summary className="text-xs text-gray-500 cursor-pointer">Debug Info</summary>
            <pre className="text-xs text-gray-400 mt-1 max-h-32 overflow-auto">
              {debugInfo.join("\n")}
            </pre>
          </details>
        )}
      </div>

      <ContentGrid items={normalizedItems} type="anime" isLoading={isLoading} />

      {!isLoading && normalizedItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#B3B3B3]">No anime content available</p>
        </div>
      )}
    </div>
  );
}
