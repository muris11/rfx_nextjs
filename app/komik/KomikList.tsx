"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ContentGrid from "@/components/content/ContentGrid";
import Button from "@/components/ui/Button";

interface KomikListProps {
  tab: string;
  page: number;
}

const tabs = [
  { id: "all", label: "All" },
  { id: "popular", label: "Popular" },
  { id: "latest", label: "Latest" },
  { id: "manhwa", label: "Manhwa" },
  { id: "manhua", label: "Manhua" },
  { id: "manga", label: "Manga" },
];

interface KomikItem {
  id?: string;
  manga_id?: string;
  title?: string;
  cover?: string;
  cover_image_url?: string;
  cover_portrait_url?: string;
  thumbnail?: string;
  rating?: number;
  user_rate?: number;
  chapters?: number;
  latest_chapter_number?: number;
}

function extractItems(data: unknown): KomikItem[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === "object" && data !== null) {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data as KomikItem[];
    if (Array.isArray(obj.list)) return obj.list as KomikItem[];
    if (Array.isArray(obj.result)) return obj.result as KomikItem[];
  }
  return [];
}

export default function KomikList({ tab, page }: KomikListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<KomikItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(tab);
  const [endpointCount, setEndpointCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        const allItems: KomikItem[] = [];
        const seenIds = new Set<string>();
        let successCount = 0;

        const addItems = (data: unknown) => {
          const extracted = extractItems(data);
          extracted.forEach((item) => {
            const id = item.manga_id || item.id || "";
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

        let endpoints: string[] = [];

        if (currentTab === "all") {
          // Fetch ALL komik endpoints
          endpoints = [
            // Popular pages 1-10
            ...Array.from({ length: 10 }, (_, i) => `/api/sansekai/komik/popular?page=${i + 1}`),
            // Recommended by type
            "/api/sansekai/komik/recommended?type=manhwa",
            "/api/sansekai/komik/recommended?type=manhua",
            "/api/sansekai/komik/recommended?type=manga",
            // Latest
            "/api/sansekai/komik/latest?type=project",
            "/api/sansekai/komik/latest?type=mirror",
          ];
        } else if (currentTab === "popular") {
          endpoints = Array.from({ length: 10 }, (_, i) => `/api/sansekai/komik/popular?page=${i + 1}`);
        } else if (currentTab === "latest") {
          endpoints = [
            "/api/sansekai/komik/latest?type=project",
            "/api/sansekai/komik/latest?type=mirror",
          ];
        } else if (currentTab === "manhwa") {
          endpoints = [
            "/api/sansekai/komik/recommended?type=manhwa",
            ...Array.from({ length: 5 }, (_, i) => `/api/sansekai/komik/popular?page=${i + 1}`),
          ];
        } else if (currentTab === "manhua") {
          endpoints = [
            "/api/sansekai/komik/recommended?type=manhua",
            ...Array.from({ length: 5 }, (_, i) => `/api/sansekai/komik/popular?page=${i + 1}`),
          ];
        } else if (currentTab === "manga") {
          endpoints = [
            "/api/sansekai/komik/recommended?type=manga",
            ...Array.from({ length: 5 }, (_, i) => `/api/sansekai/komik/popular?page=${i + 1}`),
          ];
        }

        const results = await Promise.all(endpoints.map(fetchEndpoint));
        results.forEach(addItems);

        setItems(allItems);
        setEndpointCount(successCount);
      } catch (error) {
        console.error("Failed to fetch komik:", error);
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
    router.push(`/komik?${params.toString()}`);
  };

  const normalizedItems = items.map((item) => ({
    id: item.manga_id || item.id || "",
    title: item.title || "",
    cover: item.cover_image_url || item.cover_portrait_url || item.cover || item.thumbnail || "",
    rating: item.user_rate || item.rating,
    episodes: item.latest_chapter_number || item.chapters,
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
      </div>

      <ContentGrid items={normalizedItems} type="komik" isLoading={isLoading} />

      {!isLoading && normalizedItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#B3B3B3]">No comics found</p>
        </div>
      )}
    </div>
  );
}
