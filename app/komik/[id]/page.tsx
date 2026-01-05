import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Star, User } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ContentRow from "@/components/content/ContentRow";

const SANSEKAI_BASE_URL = process.env.SANSEKAI_BASE_URL || "https://api.sansekai.my.id/api";

interface Props {
  params: Promise<{ id: string }>;
}

async function getKomikDetail(id: string) {
  try {
    // Use manga_id parameter as per API documentation
    const res = await fetch(`${SANSEKAI_BASE_URL}/komik/detail?manga_id=${encodeURIComponent(id)}`, {
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const data = await res.json();
      return data.data || data.result || data;
    }
  } catch {}
  return null;
}

async function getChapterList(id: string) {
  try {
    // Use manga_id parameter as per API documentation
    const res = await fetch(`${SANSEKAI_BASE_URL}/komik/chapterlist?manga_id=${encodeURIComponent(id)}`, {
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.data && Array.isArray(data.data)) return data.data;
      if (data.result && Array.isArray(data.result)) return data.result;
      if (Array.isArray(data)) return data;
    }
  } catch {}
  return [];
}

async function getRelatedKomik() {
  try {
    const res = await fetch(`${SANSEKAI_BASE_URL}/komik/popular`, {
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
  const komik = await getKomikDetail(id);
  
  return {
    title: komik?.title || "Comic Detail",
    description: komik?.description || komik?.synopsis || "",
  };
}

interface ChapterItem {
  id?: string;
  chapter_id?: string;
  title?: string;
  name?: string;
  number?: number;
  date?: string;
  created_at?: string;
}

export default async function KomikDetailPage({ params }: Props) {
  const { id } = await params;
  const [komik, chapters, relatedKomik] = await Promise.all([
    getKomikDetail(id),
    getChapterList(id),
    getRelatedKomik(),
  ]);

  if (!komik) {
    return (
      <div className="pt-20 pb-10 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Comic Not Found</h1>
          <Link href="/komik">
            <Button>Back to Comics</Button>
          </Link>
        </div>
      </div>
    );
  }

  const title = komik.title || komik.name || "Unknown Title";
  const cover = komik.cover_image_url || komik.cover_portrait_url || komik.cover || komik.thumbnail || komik.image || "";
  const description = komik.description || komik.synopsis || "";
  const rating = komik.user_rate || komik.rating || komik.score;
  const author = komik.taxonomy?.Author?.[0]?.name || komik.author || komik.artist || "";
  const genres = komik.taxonomy?.Genre?.map((g: { name: string }) => g.name) || komik.genres || komik.genre || [];
  const statusValue = komik.status;
  const statusText = statusValue === 1 ? "Ongoing" : statusValue === 0 ? "Completed" : typeof statusValue === "string" ? statusValue : "";
  const type = komik.taxonomy?.Format?.[0]?.name || komik.type || "";

  const relatedItems = relatedKomik.slice(0, 12).map((item: { id?: string; title?: string; cover?: string; rating?: number }) => ({
    id: item.id || "",
    title: item.title || "",
    cover: item.cover || "",
    rating: item.rating,
  }));

  // Get first chapter ID
  const firstChapter = chapters[0];
  const firstChapterId = firstChapter?.id || firstChapter?.chapter_id || "1";

  return (
    <div className="pt-16 pb-10">
      <div className="relative h-[50vh] min-h-[400px]">
        {cover && (
          <Image
            src={cover}
            alt={title}
            fill
            className="object-cover blur-sm"
            priority
            unoptimized
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/80 to-[#0D0D0D]/60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
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
                  <BookOpen className="w-12 h-12 text-gray-600" />
                </div>
              )}
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
              {author && (
                <div className="flex items-center gap-1 text-[#B3B3B3]">
                  <User className="w-4 h-4" />
                  <span>{author}</span>
                </div>
              )}
              {chapters.length > 0 && (
                <div className="flex items-center gap-1 text-[#B3B3B3]">
                  <BookOpen className="w-4 h-4" />
                  <span>{chapters.length} Chapters</span>
                </div>
              )}
              {statusText && (
                <Badge variant={statusText.toLowerCase().includes("complet") ? "success" : "warning"}>
                  {statusText}
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

            {chapters.length > 0 && (
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href={`/komik/${id}/read/${firstChapterId}`}>
                  <Button size="lg" className="gap-2">
                    <BookOpen className="w-5 h-5" />
                    Start Reading
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {chapters.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-white mb-4">Chapters ({chapters.length})</h2>
            <div className="bg-[#1A1A1A] rounded-lg divide-y divide-white/10 max-h-[500px] overflow-y-auto">
              {chapters.map((chapter: ChapterItem, index: number) => {
                const chapterId = chapter.id || chapter.chapter_id || (index + 1);
                const chapterTitle = chapter.title || chapter.name || `Chapter ${chapter.number || index + 1}`;
                const chapterDate = chapter.date || chapter.created_at;
                
                return (
                  <Link
                    key={chapterId}
                    href={`/komik/${id}/read/${chapterId}`}
                    className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                  >
                    <span className="text-white font-medium">{chapterTitle}</span>
                    {chapterDate && (
                      <span className="text-sm text-[#666]">{chapterDate}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {relatedItems.length > 0 && (
          <div className="mt-12">
            <ContentRow
              title="You May Also Like"
              items={relatedItems}
              type="komik"
            />
          </div>
        )}
      </div>
    </div>
  );
}
