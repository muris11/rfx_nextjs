import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Play, Star, Film } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ContentRow from "@/components/content/ContentRow";

const SANSEKAI_BASE_URL = process.env.SANSEKAI_BASE_URL || "https://api.sansekai.my.id/api";

interface Props {
  params: Promise<{ id: string }>;
}

async function getAnimeDetail(id: string) {
  try {
    const res = await fetch(`${SANSEKAI_BASE_URL}/anime/detail?id=${encodeURIComponent(id)}`, {
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const data = await res.json();
      return data.data || data;
    }
  } catch {}
  return null;
}

async function getRelatedAnime() {
  try {
    const res = await fetch(`${SANSEKAI_BASE_URL}/anime/latest`, {
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const data = await res.json();
      return data.data || [];
    }
  } catch {}
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const anime = await getAnimeDetail(id);
  
  return {
    title: anime?.title || "Anime Detail",
    description: anime?.description || anime?.synopsis || "",
  };
}

export default async function AnimeDetailPage({ params }: Props) {
  const { id } = await params;
  const [anime, relatedAnime] = await Promise.all([
    getAnimeDetail(id),
    getRelatedAnime(),
  ]);

  if (!anime) {
    return (
      <div className="pt-20 pb-10 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Anime Not Found</h1>
          <Link href="/anime">
            <Button>Back to Anime</Button>
          </Link>
        </div>
      </div>
    );
  }

  const title = anime.title || "Unknown Title";
  const cover = anime.cover || anime.poster || "";
  const description = anime.description || anime.synopsis || "";
  const rating = anime.rating || anime.score;
  const episodes = anime.episodes || anime.episodeCount || 0;
  const genres = anime.genres || [];
  const status = anime.status || "";
  const type = anime.type || "";

  const episodeList = anime.episodeList || [];

  const relatedItems = relatedAnime.slice(0, 12).map((item: { id?: string; title?: string; cover?: string; rating?: number }) => ({
    id: item.id || "",
    title: item.title || "",
    cover: item.cover || "",
    rating: item.rating,
  }));

  return (
    <div className="pt-16 pb-10">
      <div className="relative h-[50vh] min-h-[400px]">
        <Image
          src={cover}
          alt={title}
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D] via-transparent to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0">
            <div className="relative w-48 md:w-64 aspect-[2/3] rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={cover}
                alt={title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>

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
              {type && (
                <Badge variant="secondary">{type}</Badge>
              )}
              {episodes > 0 && (
                <div className="flex items-center gap-1 text-[#B3B3B3]">
                  <Film className="w-4 h-4" />
                  <span>{episodes} Episodes</span>
                </div>
              )}
              {status && (
                <Badge variant={status === "Completed" ? "success" : "warning"}>
                  {status}
                </Badge>
              )}
            </div>

            {genres.length > 0 && (
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
              <Link href={`/anime/${id}/watch?ep=1`}>
                <Button size="lg" className="gap-2">
                  <Play className="w-5 h-5 fill-white" />
                  Watch Now
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {episodeList.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-white mb-4">Episodes</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {episodeList.map((ep: { id?: string; title?: string; number?: number }, index: number) => (
                <Link
                  key={ep.id || index}
                  href={`/anime/${id}/watch?ep=${ep.id || index + 1}`}
                  className="bg-[#1A1A1A] hover:bg-[#E50914] rounded-lg p-3 text-center transition-colors"
                >
                  <span className="text-white font-medium">
                    {ep.title || `Episode ${ep.number || index + 1}`}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {relatedItems.length > 0 && (
          <div className="mt-12">
            <ContentRow
              title="You May Also Like"
              items={relatedItems}
              type="anime"
            />
          </div>
        )}
      </div>
    </div>
  );
}
