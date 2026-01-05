import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, AlertTriangle, ExternalLink } from "lucide-react";

const SANSEKAI_BASE_URL = process.env.SANSEKAI_BASE_URL || "https://api.sansekai.my.id/api";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ep?: string }>;
}

interface ApiError {
  error?: string;
  message?: string;
}

async function getAnimeVideo(id: string): Promise<{ url?: string; source?: string; stream?: string; error?: string } | null> {
  try {
    const res = await fetch(`${SANSEKAI_BASE_URL}/anime/getvideo?id=${encodeURIComponent(id)}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      return data.data || data;
    } else {
      const errorData: ApiError = await res.json().catch(() => ({}));
      return { error: errorData.message || `API Error: ${res.status}` };
    }
  } catch (err) {
    return { error: `Failed to connect to API: ${err}` };
  }
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

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { id } = await params;
  const { ep } = await searchParams;
  const animeInfo = await getAnimeDetail(id);
  const title = animeInfo?.title || "Watch Anime";
  
  return {
    title: `${title}${ep ? ` - Episode ${ep}` : ""}`,
  };
}

export default async function WatchAnimePage({ params, searchParams }: Props) {
  const { id } = await params;
  const { ep } = await searchParams;
  const episode = ep || "1";
  
  const [videoData, animeInfo] = await Promise.all([
    getAnimeVideo(ep || id),
    getAnimeDetail(id),
  ]);

  const videoUrl = videoData?.url || videoData?.source || videoData?.stream || "";
  const apiError = videoData?.error;
  const title = animeInfo?.title || "Anime";
  const episodeList = animeInfo?.episodeList || [];

  return (
    <div className="pt-16 pb-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <Link
            href={`/anime/${id}`}
            className="inline-flex items-center gap-2 text-[#B3B3B3] hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to {title}
          </Link>
        </div>

        <div className="space-y-6">
          {/* Video Player or Error Message */}
          {apiError || !videoUrl ? (
            <div className="aspect-video bg-[#1A1A1A] rounded-lg flex flex-col items-center justify-center p-8">
              <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Video Tidak Tersedia</h2>
              <p className="text-[#B3B3B3] text-center max-w-lg mb-4">
                {apiError || "Maaf, video untuk episode ini tidak dapat dimuat. API streaming anime sedang tidak tersedia atau sudah diblacklist."}
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <a 
                  href={`https://otakudesu.cloud/search/?s=${encodeURIComponent(title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#E50914] text-white px-4 py-2 rounded-lg hover:bg-[#ff1a1a] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Cari di Otakudesu
                </a>
                <a 
                  href={`https://samehadaku.moe/?s=${encodeURIComponent(title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Cari di Samehadaku
                </a>
              </div>
            </div>
          ) : (
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <video 
                src={videoUrl} 
                controls 
                autoPlay 
                className="w-full h-full"
                poster={animeInfo?.cover || animeInfo?.poster}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          <div className="bg-[#1A1A1A] rounded-lg p-4">
            <h1 className="text-xl font-semibold text-white">{title}</h1>
            <p className="text-[#B3B3B3] mt-1">Episode {episode}</p>
          </div>

          {episodeList.length > 0 && (
            <div className="bg-[#1A1A1A] rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Episodes</h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                {episodeList.map((epItem: { id?: string; number?: number }, index: number) => {
                  const isActive = epItem.id === ep;
                  return (
                    <Link
                      key={epItem.id || index}
                      href={`/anime/${id}/watch?ep=${epItem.id || index + 1}`}
                      className={`aspect-square flex items-center justify-center rounded-lg font-medium transition-colors ${
                        isActive
                          ? "bg-[#E50914] text-white"
                          : "bg-[#2A2A2A] hover:bg-[#333] text-white"
                      }`}
                    >
                      {epItem.number || index + 1}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
