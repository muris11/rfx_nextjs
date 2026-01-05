"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ContentGrid from "@/components/content/ContentGrid";
import Button from "@/components/ui/Button";

interface ShortsListProps {
  tab: string;
}

const tabs = [
  { id: "all", label: "All Shorts", source: "both" },
  { id: "melolo", label: "Melolo", source: "sansekai" },
  { id: "netshort", label: "NetShort", source: "sansekai" },
  { id: "starshort", label: "StarShort", source: "sapimu" },
  { id: "shortmax", label: "ShortMax", source: "sapimu" },
  { id: "flickreels", label: "FlickReels", source: "sapimu" },
  { id: "hishort", label: "HiShort", source: "sapimu" },
  { id: "dramawave", label: "DramaWave", source: "sapimu" },
  { id: "netshort-vip", label: "NetShort VIP", source: "sapimu" },
];

interface ShortItem {
  id?: string;
  bookId?: string;
  drama_id?: string;
  shortPlayId?: string;
  playlet_id?: string;
  slug?: string;
  title?: string;
  bookName?: string;
  name?: string;
  shortPlayName?: string;
  playlet_title?: string;
  cover?: string;
  coverWap?: string;
  poster?: string;
  cover_url?: string;
  image?: string;
  thumbnail?: string;
  coverUrl?: string;
  coverImage?: string;
  rating?: number;
  score?: number;
}

// Robust extractItems that handles all API response formats
function extractItems(data: unknown): ShortItem[] {
  if (!data) return [];
  
  // Direct array
  if (Array.isArray(data)) return data;
  
  if (typeof data === "object" && data !== null) {
    const obj = data as Record<string, unknown>;
    
    // Common patterns - check all possible keys including discovered formats
    const arrayKeys = [
      "data", "result", "list", "items", "dramas", "videos", "books", "series", 
      "plays", "shortPlays", "hot", "new", "recommend", "member",
      "popular", "trending", "latest", "dataList" // Added Sapimu formats
    ];
    
    for (const key of arrayKeys) {
      if (Array.isArray(obj[key])) {
        return obj[key] as ShortItem[];
      }
    }
    
    // Melolo bookmall format: {cell: {books: [...]}}
    if (obj.cell && typeof obj.cell === "object") {
      const cell = obj.cell as Record<string, unknown>;
      if (Array.isArray(cell.books)) {
        return cell.books as ShortItem[];
      }
      // Check other possible keys in cell
      for (const key of arrayKeys) {
        if (Array.isArray(cell[key])) {
          return cell[key] as ShortItem[];
        }
      }
    }
    
    // Nested data object (data.list, data.items, data.dataList, etc.)
    if (obj.data && typeof obj.data === "object" && !Array.isArray(obj.data)) {
      const inner = obj.data as Record<string, unknown>;
      for (const key of arrayKeys) {
        if (Array.isArray(inner[key])) {
          return inner[key] as ShortItem[];
        }
      }
      
      // NetShort format: {data: {data: {dataList: [...]}}}
      if (inner.data && typeof inner.data === "object" && !Array.isArray(inner.data)) {
        const deepInner = inner.data as Record<string, unknown>;
        for (const key of arrayKeys) {
          if (Array.isArray(deepInner[key])) {
            return deepInner[key] as ShortItem[];
          }
        }
      }
      
      // HiShort format: data.hot and data.new are arrays - combine them
      const combined: ShortItem[] = [];
      if (Array.isArray(inner.hot)) combined.push(...(inner.hot as ShortItem[]));
      if (Array.isArray(inner.new)) combined.push(...(inner.new as ShortItem[]));
      if (Array.isArray(inner.recommend)) combined.push(...(inner.recommend as ShortItem[]));
      if (Array.isArray(inner.popular)) combined.push(...(inner.popular as ShortItem[]));
      if (combined.length > 0) return combined;
    }
    
    // Result nested (result.data, result.list)
    if (obj.result && typeof obj.result === "object" && !Array.isArray(obj.result)) {
      const inner = obj.result as Record<string, unknown>;
      for (const key of arrayKeys) {
        if (Array.isArray(inner[key])) {
          return inner[key] as ShortItem[];
        }
      }
    }
  }
  
  return [];
}

export default function ShortsList({ tab }: ShortsListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<ShortItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(tab);
  const [endpointCount, setEndpointCount] = useState(0);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const debug: string[] = [];
      
      try {
        const allItems: ShortItem[] = [];
        const seenIds = new Set<string>();
        let successCount = 0;

        const addItems = (data: unknown, endpoint: string) => {
          const extracted = extractItems(data);
          debug.push(`${endpoint}: ${extracted.length} items`);
          
          extracted.forEach((item) => {
            const id = item.id || item.bookId || item.drama_id || item.shortPlayId || "";
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
            debug.push(`${endpoint}: Error`);
          }
          return { data: null, endpoint };
        };

        let endpoints: string[] = [];

        if (currentTab === "all") {
          endpoints = [
            // SANSEKAI Melolo
            "/api/sansekai/melolo/trending",
            "/api/sansekai/melolo/latest",
            // SANSEKAI NetShort
            "/api/sansekai/netshort/theaters",
            ...Array.from({ length: 5 }, (_, i) => `/api/sansekai/netshort/foryou?page=${i + 1}`),
            // SAPIMU Melolo
            "/api/sapimu/melolo/bookmall",
            // SAPIMU StarShort
            "/api/sapimu/starshort/api/v1/dramas?lang=3",
            "/api/sapimu/starshort/api/v1/dramas/new?lang=3",
            "/api/sapimu/starshort/api/v1/dramas/rising?lang=3",
            "/api/sapimu/starshort/api/v1/dramas/recommended?lang=3",
            // SAPIMU ShortMax
            "/api/sapimu/shortmax/api/v1/home?lang=en",
            // SAPIMU FlickReels
            "/api/sapimu/flickreels/api/v1/for-you?lang=id",
            "/api/sapimu/flickreels/api/v1/hot-rank?lang=id",
            // SAPIMU HiShort
            "/api/sapimu/hishort/api/home?lang=in",
            // SAPIMU DramaWave
            "/api/sapimu/dramawave/api/v1/feed/popular?page=1&lang=id-ID",
            "/api/sapimu/dramawave/api/v1/feed/new?page=1&lang=id-ID",
            "/api/sapimu/dramawave/api/v1/feed/free?page=1&lang=id-ID",
            "/api/sapimu/dramawave/api/v1/feed/vip?page=1&lang=id-ID",
            // SAPIMU NetShort
            "/api/sapimu/netshort/api/recommend?limit=100&lang=id_ID",
            "/api/sapimu/netshort/api/member?limit=100&lang=id_ID",
          ];
        } else if (currentTab === "melolo") {
          endpoints = [
            "/api/sansekai/melolo/trending",
            "/api/sansekai/melolo/latest",
            "/api/sapimu/melolo/bookmall",
          ];
        } else if (currentTab === "netshort") {
          endpoints = [
            "/api/sansekai/netshort/theaters",
            ...Array.from({ length: 10 }, (_, i) => `/api/sansekai/netshort/foryou?page=${i + 1}`),
          ];
        } else if (currentTab === "starshort") {
          endpoints = [
            "/api/sapimu/starshort/api/v1/dramas?lang=3",
            "/api/sapimu/starshort/api/v1/dramas/new?lang=3",
            "/api/sapimu/starshort/api/v1/dramas/rising?lang=3",
            "/api/sapimu/starshort/api/v1/dramas/recommended?lang=3",
          ];
        } else if (currentTab === "shortmax") {
          endpoints = [
            "/api/sapimu/shortmax/api/v1/home?lang=en",
            "/api/sapimu/shortmax/api/v1/home?lang=id",
          ];
        } else if (currentTab === "flickreels") {
          endpoints = [
            "/api/sapimu/flickreels/api/v1/for-you?lang=id",
            "/api/sapimu/flickreels/api/v1/hot-rank?lang=id",
          ];
        } else if (currentTab === "hishort") {
          endpoints = [
            "/api/sapimu/hishort/api/home?lang=in",
          ];
        } else if (currentTab === "dramawave") {
          endpoints = [
            ...Array.from({ length: 3 }, (_, i) => `/api/sapimu/dramawave/api/v1/feed/popular?page=${i + 1}&lang=id-ID`),
            ...Array.from({ length: 3 }, (_, i) => `/api/sapimu/dramawave/api/v1/feed/new?page=${i + 1}&lang=id-ID`),
            "/api/sapimu/dramawave/api/v1/feed/free?page=1&lang=id-ID",
            "/api/sapimu/dramawave/api/v1/feed/vip?page=1&lang=id-ID",
            "/api/sapimu/dramawave/api/v1/feed/exclusive?page=1&lang=id-ID",
            "/api/sapimu/dramawave/api/v1/feed/dubbing?page=1&lang=id-ID",
            "/api/sapimu/dramawave/api/v1/feed/male?page=1&lang=id-ID",
            "/api/sapimu/dramawave/api/v1/feed/female?page=1&lang=id-ID",
          ];
        } else if (currentTab === "netshort-vip") {
          endpoints = [
            "/api/sapimu/netshort/api/member?limit=100&lang=id_ID",
            "/api/sapimu/netshort/api/recommend?limit=100&lang=id_ID",
          ];
        }

        const results = await Promise.all(endpoints.map(fetchEndpoint));
        results.forEach(({ data, endpoint }) => {
          if (data) addItems(data, endpoint);
        });

        setItems(allItems);
        setEndpointCount(successCount);
        setDebugInfo(debug);
      } catch (error) {
        console.error("Failed to fetch shorts:", error);
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
    router.push(`/shorts?${params.toString()}`);
  };

  const normalizedItems = items.map((item) => ({
    id: item.id || item.bookId || item.drama_id || item.shortPlayId || item.playlet_id || item.slug || "",
    title: item.title || item.bookName || item.name || item.shortPlayName || item.playlet_title || "",
    cover: item.cover || item.coverWap || item.poster || item.cover_url || item.image || item.thumbnail || item.coverUrl || item.coverImage || "",
    rating: item.rating || item.score,
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
          Platform: <span className="text-white font-semibold">{tabs.find((t) => t.id === currentTab)?.label}</span>
          {" "}• Endpoints called: <span className="text-[#FF3D71]">{endpointCount}</span>
          {" "}• Total items: <span className="text-[#00D9FF]">{items.length}</span>
        </p>
        {debugInfo.length > 0 && (
          <details className="mt-2">
            <summary className="text-xs text-gray-500 cursor-pointer">Debug Info</summary>
            <pre className="text-xs text-gray-400 mt-1 max-h-40 overflow-auto">
              {debugInfo.join("\n")}
            </pre>
          </details>
        )}
      </div>

      <ContentGrid items={normalizedItems} type="shorts" isLoading={isLoading} />

      {!isLoading && normalizedItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#B3B3B3]">No content available for {tabs.find((t) => t.id === currentTab)?.label}</p>
          <p className="text-xs text-gray-600 mt-2">Check Debug Info above for details</p>
        </div>
      )}
    </div>
  );
}
