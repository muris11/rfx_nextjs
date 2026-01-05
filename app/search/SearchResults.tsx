"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import ContentGrid from "@/components/content/ContentGrid";
import Button from "@/components/ui/Button";

interface SearchResultsProps {
  query: string;
  type: string;
}

const types = [
  { id: "all", label: "All" },
  { id: "drama", label: "Drama" },
  { id: "anime", label: "Anime" },
  { id: "komik", label: "Comics" },
];

interface SearchItem {
  id?: string;
  bookId?: string;
  title?: string;
  bookName?: string;
  cover?: string;
  coverWap?: string;
  rating?: number;
  score?: number;
  type?: string;
}

export default function SearchResults({ query, type }: SearchResultsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(query);
  const [items, setItems] = useState<{ drama: SearchItem[]; anime: SearchItem[]; komik: SearchItem[] }>({
    drama: [],
    anime: [],
    komik: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentType, setCurrentType] = useState(type);

  useEffect(() => {
    if (!query) return;
    
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const [dramaRes, animeRes, komikRes] = await Promise.allSettled([
          fetch(`/api/sansekai/dramabox/search?q=${encodeURIComponent(query)}`),
          fetch(`/api/sansekai/anime/search?q=${encodeURIComponent(query)}`),
          fetch(`/api/sansekai/komik/search?q=${encodeURIComponent(query)}`),
        ]);

        const drama = dramaRes.status === "fulfilled" && dramaRes.value.ok
          ? (await dramaRes.value.json()).data || []
          : [];
        const anime = animeRes.status === "fulfilled" && animeRes.value.ok
          ? (await animeRes.value.json()).data || []
          : [];
        const komik = komikRes.status === "fulfilled" && komikRes.value.ok
          ? (await komikRes.value.json()).data || []
          : [];

        setItems({ drama, anime, komik });
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("q", searchQuery.trim());
      router.push(`/search?${params.toString()}`);
    }
  };

  const handleTypeChange = (newType: string) => {
    setCurrentType(newType);
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", newType);
    router.push(`/search?${params.toString()}`);
  };

  const normalizeItem = (item: SearchItem) => ({
    id: item.id || item.bookId || "",
    title: item.title || item.bookName || "",
    cover: item.cover || item.coverWap || "",
    rating: item.rating || item.score,
  });

  const getFilteredItems = () => {
    if (currentType === "drama") return items.drama.map(normalizeItem);
    if (currentType === "anime") return items.anime.map(normalizeItem);
    if (currentType === "komik") return items.komik.map(normalizeItem);
    return [
      ...items.drama.map(normalizeItem),
      ...items.anime.map(normalizeItem),
      ...items.komik.map(normalizeItem),
    ];
  };

  const getContentType = (): "drama" | "anime" | "komik" => {
    if (currentType === "anime") return "anime";
    if (currentType === "komik") return "komik";
    return "drama";
  };

  const filteredItems = getFilteredItems();
  const totalResults = items.drama.length + items.anime.length + items.komik.length;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="relative max-w-2xl">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search dramas, anime, comics..."
          className="w-full h-14 pl-14 pr-6 bg-[#1A1A1A] border border-white/20 rounded-xl text-white text-lg placeholder:text-[#666] focus:outline-none focus:border-[#E50914] transition-colors"
        />
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#E50914] text-white rounded-lg hover:bg-[#b8070f] transition-colors"
        >
          Search
        </button>
      </form>

      {query && (
        <>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-wrap gap-2">
              {types.map((t) => (
                <Button
                  key={t.id}
                  variant={currentType === t.id ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => handleTypeChange(t.id)}
                >
                  {t.label}
                  {t.id === "all" && ` (${totalResults})`}
                  {t.id === "drama" && ` (${items.drama.length})`}
                  {t.id === "anime" && ` (${items.anime.length})`}
                  {t.id === "komik" && ` (${items.komik.length})`}
                </Button>
              ))}
            </div>
          </div>

          {currentType === "all" ? (
            <div className="space-y-10">
              {items.drama.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Drama ({items.drama.length})</h2>
                  <ContentGrid
                    items={items.drama.map(normalizeItem)}
                    type="drama"
                    isLoading={isLoading}
                  />
                </div>
              )}
              {items.anime.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Anime ({items.anime.length})</h2>
                  <ContentGrid
                    items={items.anime.map(normalizeItem)}
                    type="anime"
                    isLoading={isLoading}
                  />
                </div>
              )}
              {items.komik.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Comics ({items.komik.length})</h2>
                  <ContentGrid
                    items={items.komik.map(normalizeItem)}
                    type="komik"
                    isLoading={isLoading}
                  />
                </div>
              )}
              {!isLoading && totalResults === 0 && (
                <div className="text-center py-12">
                  <p className="text-[#B3B3B3]">No results found for &quot;{query}&quot;</p>
                </div>
              )}
            </div>
          ) : (
            <ContentGrid
              items={filteredItems}
              type={getContentType()}
              isLoading={isLoading}
            />
          )}
        </>
      )}

      {!query && (
        <div className="text-center py-12">
          <p className="text-[#B3B3B3]">Enter a search term to find content</p>
        </div>
      )}
    </div>
  );
}
