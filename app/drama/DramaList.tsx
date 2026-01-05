"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ContentGrid from "@/components/content/ContentGrid";
import Button from "@/components/ui/Button";

interface DramaListProps {
  tab: string;
  genre?: string;
  page: number;
}

const tabs = [
  { id: "all", label: "All" },
  { id: "trending", label: "Trending" },
  { id: "latest", label: "Latest" },
  { id: "foryou", label: "For You" },
  { id: "ranking", label: "Ranking" },
  { id: "vip", label: "VIP" },
  { id: "dubindo", label: "Dub Indo" },
  { id: "populersearch", label: "Popular Search" },
];

interface DramaItem {
  bookId?: string;
  id?: string;
  bookName?: string;
  title?: string;
  coverWap?: string;
  cover?: string;
  score?: number;
  rating?: number;
  chapterCount?: number;
  episodes?: number;
}

interface ColumnVo {
  columnId?: number;
  title?: string;
  bookList?: DramaItem[];
}

function extractItems(data: unknown): DramaItem[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === "object" && data !== null) {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.list)) return obj.list as DramaItem[];
    if (Array.isArray(obj.data)) return obj.data as DramaItem[];
    if (Array.isArray(obj.result)) return obj.result as DramaItem[];
    if (obj.data && typeof obj.data === "object") {
      const inner = obj.data as Record<string, unknown>;
      if (Array.isArray(inner.list)) return inner.list as DramaItem[];
    }
    // Handle VIP nested structure
    if (Array.isArray(obj.columnVoList)) {
      const vipItems: DramaItem[] = [];
      for (const column of obj.columnVoList as ColumnVo[]) {
        if (column.bookList && Array.isArray(column.bookList)) {
          vipItems.push(...column.bookList);
        }
      }
      return vipItems;
    }
  }
  return [];
}

export default function DramaList({ tab, page }: DramaListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<DramaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(tab);
  const [endpointCount, setEndpointCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        const allItems: DramaItem[] = [];
        const seenIds = new Set<string>();
        let successCount = 0;

        const addItems = (data: unknown) => {
          const items = extractItems(data);
          items.forEach((item) => {
            const id = item.bookId || item.id || "";
            if (id && !seenIds.has(id)) {
              seenIds.add(id);
              allItems.push(item);
            }
          });
        };

        const fetchEndpoint = async (endpoint: string): Promise<unknown> => {
          try {
            const res = await fetch(endpoint);
            if (res.ok) {
              successCount++;
              return res.json();
            }
          } catch {}
          return null;
        };

        // Define ALL endpoints to fetch based on tab
        let endpoints: string[] = [];

        if (currentTab === "all") {
          // FETCH ALL AVAILABLE ENDPOINTS FROM BOTH APIs
          endpoints = [
            // === SANSEKAI DramaBox - ALL LIST ENDPOINTS ===
            "/api/sansekai/dramabox/trending",
            "/api/sansekai/dramabox/latest",
            "/api/sansekai/dramabox/foryou",
            "/api/sansekai/dramabox/vip",
            "/api/sansekai/dramabox/dubindo?classify=terpopuler",
            "/api/sansekai/dramabox/dubindo?classify=terbaru",
            "/api/sansekai/dramabox/randomdrama",
            "/api/sansekai/dramabox/populersearch",
            // === SAPIMU DramaBox - ALL PAGES (1-10) ===
            ...Array.from({ length: 10 }, (_, i) => `/api/sapimu/dramabox/api/foryou/${i + 1}?lang=in`),
            ...Array.from({ length: 10 }, (_, i) => `/api/sapimu/dramabox/api/new/${i + 1}?lang=in&pageSize=50`),
            ...Array.from({ length: 10 }, (_, i) => `/api/sapimu/dramabox/api/rank/${i + 1}?lang=in`),
          ];
        } else if (currentTab === "trending") {
          endpoints = [
            "/api/sansekai/dramabox/trending",
            "/api/sansekai/dramabox/populersearch",
            ...Array.from({ length: 5 }, (_, i) => `/api/sapimu/dramabox/api/rank/${i + 1}?lang=in`),
          ];
        } else if (currentTab === "latest") {
          endpoints = [
            "/api/sansekai/dramabox/latest",
            ...Array.from({ length: 10 }, (_, i) => `/api/sapimu/dramabox/api/new/${i + 1}?lang=in&pageSize=50`),
          ];
        } else if (currentTab === "foryou") {
          endpoints = [
            "/api/sansekai/dramabox/foryou",
            ...Array.from({ length: 10 }, (_, i) => `/api/sapimu/dramabox/api/foryou/${i + 1}?lang=in`),
          ];
        } else if (currentTab === "ranking") {
          endpoints = [
            ...Array.from({ length: 10 }, (_, i) => `/api/sapimu/dramabox/api/rank/${i + 1}?lang=in`),
            "/api/sansekai/dramabox/trending",
            "/api/sansekai/dramabox/populersearch",
          ];
        } else if (currentTab === "vip") {
          endpoints = ["/api/sansekai/dramabox/vip"];
        } else if (currentTab === "dubindo") {
          endpoints = [
            "/api/sansekai/dramabox/dubindo?classify=terpopuler",
            "/api/sansekai/dramabox/dubindo?classify=terbaru",
          ];
        } else if (currentTab === "populersearch") {
          endpoints = ["/api/sansekai/dramabox/populersearch"];
        }

        // Fetch all endpoints in parallel
        const results = await Promise.all(endpoints.map(fetchEndpoint));
        results.forEach(addItems);

        setItems(allItems);
        setEndpointCount(successCount);
      } catch (error) {
        console.error("Failed to fetch dramas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentTab]);

  const handleTabChange = (newTab: string) => {
    setCurrentTab(newTab);
    setItems([]);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);
    params.delete("page");
    router.push(`/drama?${params.toString()}`);
  };

  const normalizedItems = items.map((item) => ({
    id: item.bookId || item.id || "",
    title: item.bookName || item.title || "",
    cover: item.coverWap || item.cover || "",
    rating: item.score || item.rating,
    episodes: item.chapterCount || item.episodes,
  }));

  return (
    <div className="space-y-6">
      {/* Main Tabs */}
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

      {/* Stats */}
      <div className="glass-light rounded-xl p-4">
        <p className="text-sm text-[#B3B3B3]">
          Tab: <span className="text-white font-semibold">{tabs.find((t) => t.id === currentTab)?.label}</span>
          {" "}• Endpoints called: <span className="text-[#FF3D71]">{endpointCount}</span>
          {" "}• Total items: <span className="text-[#00D9FF]">{items.length}</span>
        </p>
      </div>

      <ContentGrid items={normalizedItems} type="drama" isLoading={isLoading} />

      {!isLoading && normalizedItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#B3B3B3]">No dramas found</p>
        </div>
      )}
    </div>
  );
}
