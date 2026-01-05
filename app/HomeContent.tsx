'use client'

import { useEffect, useState } from 'react'
import Carousel from "@/components/ui/Carousel";
import ContentRow from "@/components/content/ContentRow";
import ContinueWatching from "@/components/content/ContinueWatching";
import { HomeSkeleton } from '@/components/ui/HomeSkeleton';

interface ContentItem {
  id: string;
  title: string;
  cover: string;
  subtitle?: string;
  rating?: number;
  episodes?: number;
}

interface HeroItem {
  id: string;
  title: string;
  description: string;
  cover: string;
  type: "drama" | "anime" | "komik";
  rating?: number;
  year?: string;
  quality?: string;
  duration?: string;
}

interface RawItem {
  bookId?: string;
  id?: string;
  bookName?: string;
  title?: string;
  name?: string;
  coverWap?: string;
  cover?: string;
  poster?: string;
  cover_url?: string;
  introduction?: string;
  description?: string;
  score?: number;
  rating?: number;
  chapterCount?: number;
  episodes?: number;
  total_episodes?: number;
  total_episode?: number;
  drama_id?: string;
  image?: string;
  thumbnail?: string;
  cover_image_url?: string;
  manga_id?: string;
  year?: string;
  releaseDate?: string;
  quality?: string;
  duration?: string;
  // Additional fields from various APIs
  coverImg?: string;
  picUrl?: string;
  img?: string;
  posterUrl?: string;
  shortPlayId?: string;
  series_id?: string;
}

interface ColumnVo {
  columnId?: number;
  title?: string;
  bookList?: RawItem[];
}

// Enhanced utility to safely extract items from various API responses
function extractItems(data: unknown): RawItem[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === 'object' && data !== null) {
    const obj = data as Record<string, unknown>;
    
    // Common array properties - check in order of likelihood
    const listProps = [
      'data', 'result', 'list', 'items', 'dramas', 'videos', 'books',
      'content', 'results', 'records', 'rows', 'series', 'shows'
    ];
    
    for (const prop of listProps) {
      if (Array.isArray(obj[prop])) {
        return obj[prop] as RawItem[];
      }
    }
    
    // Handle VIP nested structure (DramaBox)
    if (Array.isArray(obj.columnVoList)) {
      const vipItems: RawItem[] = [];
      for (const column of obj.columnVoList as ColumnVo[]) {
        if (column.bookList && Array.isArray(column.bookList)) {
          vipItems.push(...column.bookList);
        }
      }
      return vipItems;
    }
    
    // Handle nested data object
    if (obj.data && typeof obj.data === 'object') {
      const inner = obj.data as Record<string, unknown>;
      for (const prop of listProps) {
        if (Array.isArray(inner[prop])) {
          return inner[prop] as RawItem[];
        }
      }
    }
    
    // Handle result.data nested structure
    if (obj.result && typeof obj.result === 'object') {
      const result = obj.result as Record<string, unknown>;
      if (Array.isArray(result.data)) {
        return result.data as RawItem[];
      }
    }
  }
  return [];
}

// Normalize items to a consistent format
function normalizeItems(items: RawItem[]): ContentItem[] {
  const seenIds = new Set<string>();
  const result: ContentItem[] = [];
  
  for (const item of items) {
    const id = item.bookId || item.id || item.drama_id || item.manga_id || item.shortPlayId || item.series_id || "";
    if (!id || seenIds.has(String(id))) continue;
    seenIds.add(String(id));
    
    const cover = item.coverWap || item.cover || item.poster || item.cover_url || 
                  item.image || item.thumbnail || item.cover_image_url || 
                  item.coverImg || item.picUrl || item.img || item.posterUrl || "";
    if (!cover) continue; // Skip items without cover

    result.push({
      id: String(id),
      title: item.bookName || item.title || item.name || "Untitled",
      cover,
      subtitle: item.introduction || item.description || "",
      rating: item.score || item.rating,
      episodes: item.chapterCount || item.episodes || item.total_episodes || item.total_episode,
    });
  }
  
  return result;
}

async function fetchApi(endpoint: string): Promise<RawItem[]> {
  try {
    const res = await fetch(endpoint, { 
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    if (!res.ok) {
      console.warn(`API ${endpoint} returned ${res.status}`);
      return [];
    }
    const data = await res.json();
    return extractItems(data);
  } catch (err) {
    console.warn(`Failed to fetch ${endpoint}:`, err);
    return [];
  }
}

async function fetchMultiple(endpoints: string[]): Promise<RawItem[]> {
  const results = await Promise.allSettled(endpoints.map(fetchApi));
  return results
    .filter((r): r is PromiseFulfilledResult<RawItem[]> => r.status === 'fulfilled')
    .flatMap(r => r.value);
}

export default function HomeContent() {
  const [loading, setLoading] = useState(true);
  const [heroItems, setHeroItems] = useState<HeroItem[]>([]);
  const [sections, setSections] = useState<{
    title: string;
    items: ContentItem[];
    type: "drama" | "anime" | "komik" | "shorts";
    href: string;
  }[]>([]);

  useEffect(() => {
    const loadData = async () => {
      
      // === DRAMA SECTION - Multiple sources for redundancy ===
      const dramaEndpoints = [
        "/api/sansekai/dramabox/trending",
        "/api/sansekai/dramabox/latest",
        "/api/sansekai/dramabox/foryou",
        "/api/sapimu/dramabox/api/rank/1?lang=in",
        "/api/sapimu/dramabox/api/foryou/1?lang=in",
        "/api/sapimu/dramabox/api/new/1?lang=in&pageSize=30",
      ];
      const dramaItems = await fetchMultiple(dramaEndpoints);

      // === SHORTS SECTION - Multiple platforms ===
      const shortsEndpoints = [
        "/api/sansekai/netshort/theaters",
        "/api/sansekai/melolo/trending",
        "/api/sansekai/melolo/latest",
        "/api/sapimu/shortmax/api/v1/home?lang=en",
        "/api/sapimu/starshort/api/v1/dramas?lang=3",
        "/api/sapimu/flickreels/api/v1/for-you?lang=id",
        "/api/sapimu/hishort/api/home?lang=in",
      ];
      const shortsItems = await fetchMultiple(shortsEndpoints);

      // === ANIME SECTION ===
      const animeEndpoints = [
        "/api/sansekai/anime/latest?page=1",
        "/api/sansekai/anime/latest?page=2",
        "/api/sansekai/anime/movie",
      ];
      const animeItems = await fetchMultiple(animeEndpoints);

      // === KOMIK SECTION ===
      const komikEndpoints = [
        "/api/sansekai/komik/popular?page=1",
        "/api/sansekai/komik/popular?page=2",
        "/api/sansekai/komik/recommended?type=manhwa",
        "/api/sansekai/komik/recommended?type=manhua",
        "/api/sansekai/komik/latest?type=project",
      ];
      const komikItems = await fetchMultiple(komikEndpoints);

      // Build Hero Carousel - prefer drama, fallback to anime
      const normalizedDrama = normalizeItems(dramaItems);
      const normalizedAnime = normalizeItems(animeItems);
      
      const heroSource = normalizedDrama.length > 0 ? normalizedDrama : normalizedAnime;
      const heroType = normalizedDrama.length > 0 ? "drama" : "anime";
      
      if (heroSource.length > 0) {
        const heroes = heroSource.slice(0, 8).map((item) => {
          const raw = dramaItems.find(r => 
            (r.bookId || r.id || r.drama_id) === item.id
          ) || animeItems.find(r => r.id === item.id);
          
          return {
            id: item.id,
            title: item.title,
            description: item.subtitle || "",
            cover: item.cover,
            type: heroType as "drama" | "anime" | "komik",
            rating: item.rating,
            year: raw?.year || raw?.releaseDate || "2024",
            quality: raw?.quality || "HD",
            duration: raw?.duration || `${item.episodes || 12} Episodes`
          };
        });
        setHeroItems(heroes);
      }

      // Build Sections - only add if items exist
      const newSections: typeof sections = [];
      
      if (normalizedDrama.length > 0) {
        newSections.push({
          title: "Trending Drama",
          items: normalizedDrama.slice(0, 20),
          type: "drama",
          href: "/drama?tab=trending"
        });
      }
      
      const normalizedShorts = normalizeItems(shortsItems);
      if (normalizedShorts.length > 0) {
        newSections.push({
          title: "Popular Shorts",
          items: normalizedShorts.slice(0, 20),
          type: "shorts",
          href: "/shorts?tab=popular"
        });
      }
      
      if (normalizedAnime.length > 0) {
        newSections.push({
          title: "Latest Anime",
          items: normalizedAnime.slice(0, 20),
          type: "anime",
          href: "/anime?tab=latest"
        });
      }
      
      const normalizedKomik = normalizeItems(komikItems);
      if (normalizedKomik.length > 0) {
        newSections.push({
          title: "Top Comics",
          items: normalizedKomik.slice(0, 20),
          type: "komik",
          href: "/komik?tab=popular"
        });
      }

      setSections(newSections);
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return <HomeSkeleton />;
  }

  // If no data at all, show an error state
  if (heroItems.length === 0 && sections.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <div className="text-6xl">😢</div>
          <h2 className="text-2xl font-bold text-white">Failed to Load Content</h2>
          <p className="text-gray-400 max-w-md">
            We couldn&apos;t fetch any content right now. Please check your internet connection and try again.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Carousel */}
      {heroItems.length > 0 && <Carousel items={heroItems} />}

      {/* Main Content Area */}
      <div className="max-w-[1920px] mx-auto relative z-20 px-0">
        
        {/* Continue Watching Section */}
        <div className="px-4 sm:px-6 lg:px-12 mb-8">
           <ContinueWatching />
        </div>

        {/* Content Rows */}
        <div className="space-y-10 pb-16">
          {sections.map((section, index) => (
            <ContentRow
              key={`${section.type}-${index}`}
              title={section.title}
              items={section.items}
              type={section.type}
              href={section.href}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
