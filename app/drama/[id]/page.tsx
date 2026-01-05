import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Play, Star, Calendar, Film } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ContentRow from "@/components/content/ContentRow";

const SAPIMU_BASE_URL = process.env.SAPIMU_BASE_URL || "https://sapimu.au";
const SAPIMU_TOKEN = process.env.SAPIMU_API_TOKEN || "";
const SANSEKAI_BASE_URL = process.env.SANSEKAI_BASE_URL || "https://api.sansekai.my.id/api";

interface Props {
  params: Promise<{ id: string }>;
}

async function getDramaDetail(id: string) {
  // Try Sapimu API first (with bookId format)
  try {
    const res = await fetch(`${SAPIMU_BASE_URL}/dramabox/api/chapters/detail/${id}?lang=in`, {
      headers: { Authorization: `Bearer ${SAPIMU_TOKEN}` },
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.data || data.bookName || data.title) {
        return { source: "sapimu", data: data.data || data };
      }
    }
  } catch {}
  
  // Try Sansekai API as fallback
  try {
    const res = await fetch(`${SANSEKAI_BASE_URL}/dramabox/detail?bookId=${id}`, {
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.data || data.result) {
        return { source: "sansekai", data: data.data || data.result || data };
      }
    }
  } catch {}
  
  return null;
}

async function getRelatedDramas() {
  try {
    const res = await fetch(`${SANSEKAI_BASE_URL}/dramabox/trending`, {
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const data = await res.json();
      return data.data || data.result || [];
    }
  } catch {}
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const drama = await getDramaDetail(id);
  
  return {
    title: drama?.data?.bookName || drama?.data?.title || "Drama Detail",
    description: drama?.data?.introduction || drama?.data?.description || "",
  };
}

export default async function DramaDetailPage({ params }: Props) {
  const { id } = await params;
  const [dramaResult, relatedDramas] = await Promise.all([
    getDramaDetail(id),
    getRelatedDramas(),
  ]);

  if (!dramaResult) {
    return (
      <div className="pt-20 pb-10 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Drama Not Found</h1>
          <p className="text-gray-400 mb-6">The drama you&apos;re looking for doesn&apos;t exist or is unavailable.</p>
          <Link href="/drama">
            <Button>Back to Drama</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { data: drama } = dramaResult;
  const title = drama.bookName || drama.title || drama.name || "Unknown Title";
  const cover = drama.coverWap || drama.cover || drama.poster || "";
  const description = drama.introduction || drama.description || drama.synopsis || "";
  const rating = drama.score || drama.rating;
  const episodes = drama.chapterCount || drama.episodes || drama.total_episodes || 0;
  const genres = drama.tags || drama.genres || drama.genre || [];
  const year = drama.year || drama.release_year || "";
  const status = drama.status || (drama.isFinish ? "Completed" : "Ongoing");

  const relatedItems = relatedDramas.slice(0, 12).map((item: { id?: string; bookId?: string; title?: string; bookName?: string; cover?: string; coverWap?: string; rating?: number; score?: number }) => ({
    id: item.id || item.bookId || "",
    title: item.title || item.bookName || "",
    cover: item.cover || item.coverWap || "",
    rating: item.rating || item.score,
  }));

  return (
    <div className="pt-16 pb-10">
      {/* Hero Background */}
      <div className="relative h-[50vh] min-h-[400px]">
        {cover && (
          <Image
            src={cover}
            alt={title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D] via-transparent to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0">
            <div className="relative w-48 md:w-64 aspect-[2/3] rounded-lg overflow-hidden shadow-2xl">
              {cover ? (
                <Image
                  src={cover}
                  alt={title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-[#1A1A1A] flex items-center justify-center">
                  <Film className="w-12 h-12 text-gray-600" />
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              {title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              {rating && (
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{typeof rating === 'number' ? rating.toFixed(1) : rating}</span>
                </div>
              )}
              {year && (
                <div className="flex items-center gap-1 text-[#B3B3B3]">
                  <Calendar className="w-4 h-4" />
                  <span>{year}</span>
                </div>
              )}
              {episodes > 0 && (
                <div className="flex items-center gap-1 text-[#B3B3B3]">
                  <Film className="w-4 h-4" />
                  <span>{episodes} Episodes</span>
                </div>
              )}
              {status && (
                <Badge variant={status.toLowerCase().includes("complet") ? "success" : "warning"}>
                  {status}
                </Badge>
              )}
            </div>

            {Array.isArray(genres) && genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {genres.map((genre: string, index: number) => (
                  <Badge key={index}>{genre}</Badge>
                ))}
              </div>
            )}

            {description && (
              <p className="text-[#B3B3B3] leading-relaxed max-w-3xl">
                {description}
              </p>
            )}

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href={`/drama/${id}/watch/1`}>
                <Button size="lg" className="gap-2">
                  <Play className="w-5 h-5 fill-white" />
                  Watch Now
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Episode Grid */}
        {episodes > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-white mb-4">Episodes ({episodes})</h2>
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
              {Array.from({ length: Math.min(episodes, 100) }, (_, i) => i + 1).map((ep) => (
                <Link
                  key={ep}
                  href={`/drama/${id}/watch/${ep}`}
                  className="aspect-square flex items-center justify-center bg-[#1A1A1A] hover:bg-[#E50914] rounded-lg text-white font-medium transition-colors"
                >
                  {ep}
                </Link>
              ))}
            </div>
            {episodes > 100 && (
              <p className="text-gray-400 text-sm mt-4">
                Showing first 100 episodes. Total: {episodes} episodes
              </p>
            )}
          </div>
        )}

        {/* Related */}
        {relatedItems.length > 0 && (
          <div className="mt-12">
            <ContentRow
              title="You May Also Like"
              items={relatedItems}
              type="drama"
            />
          </div>
        )}
      </div>
    </div>
  );
}
