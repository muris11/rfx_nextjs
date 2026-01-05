import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, AlertCircle } from "lucide-react";
import VideoPlayer from "@/components/content/VideoPlayer";
import EpisodeList from "@/components/content/EpisodeList";
import Button from "@/components/ui/Button";

const SAPIMU_BASE_URL = process.env.SAPIMU_BASE_URL || "https://sapimu.au";
const SAPIMU_TOKEN = process.env.SAPIMU_API_TOKEN || "";
const SANSEKAI_BASE_URL = process.env.SANSEKAI_BASE_URL || "https://api.sansekai.my.id/api";

interface Props {
  params: Promise<{ id: string; ep: string }>;
}

async function getVideoUrl(id: string, episode: number) {
  // Try Sapimu API first
  try {
    const res = await fetch(
      `${SAPIMU_BASE_URL}/dramabox/api/watch/${id}/${episode - 1}?lang=in&source=search_result`,
      {
        headers: { Authorization: `Bearer ${SAPIMU_TOKEN}` },
        next: { revalidate: 60 },
      }
    );
    if (res.ok) {
      const data = await res.json();
      const videoData = data.data || data;
      if (videoData?.playUrl || videoData?.url || videoData?.videoUrl) {
        return videoData;
      }
    }
  } catch {}
  
  // Try Sansekai API as fallback
  try {
    const res = await fetch(
      `${SANSEKAI_BASE_URL}/dramabox/allepisode?bookId=${id}`,
      { next: { revalidate: 60 } }
    );
    if (res.ok) {
      const data = await res.json();
      const episodes = data.data || data.result || [];
      if (Array.isArray(episodes) && episodes[episode - 1]) {
        return episodes[episode - 1];
      }
    }
  } catch {}
  
  return null;
}

async function getDramaInfo(id: string) {
  // Try Sapimu first
  try {
    const res = await fetch(
      `${SAPIMU_BASE_URL}/dramabox/api/chapters/detail/${id}?lang=in`,
      {
        headers: { Authorization: `Bearer ${SAPIMU_TOKEN}` },
        next: { revalidate: 300 },
      }
    );
    if (res.ok) {
      const data = await res.json();
      return data.data || data;
    }
  } catch {}
  
  // Try Sansekai as fallback
  try {
    const res = await fetch(
      `${SANSEKAI_BASE_URL}/dramabox/detail?bookId=${id}`,
      { next: { revalidate: 300 } }
    );
    if (res.ok) {
      const data = await res.json();
      return data.data || data.result || data;
    }
  } catch {}
  
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, ep } = await params;
  const dramaInfo = await getDramaInfo(id);
  const title = dramaInfo?.bookName || dramaInfo?.title || "Watch Drama";
  
  return {
    title: `${title} - Episode ${ep}`,
  };
}

export default async function WatchDramaPage({ params }: Props) {
  const { id, ep } = await params;
  const episode = parseInt(ep) || 1;
  
  const [videoData, dramaInfo] = await Promise.all([
    getVideoUrl(id, episode),
    getDramaInfo(id),
  ]);

  const videoUrl = videoData?.playUrl || videoData?.url || videoData?.videoUrl || videoData?.video_url || "";
  const title = dramaInfo?.bookName || dramaInfo?.title || "Drama";
  const poster = dramaInfo?.coverWap || dramaInfo?.cover || "";
  const totalEpisodes = dramaInfo?.chapterCount || dramaInfo?.total_episodes || dramaInfo?.episodes || 0;
  const chapters = dramaInfo?.chapters || [];

  const episodes = chapters.length > 0
    ? chapters.map((ch: { chapterIndex?: number; chapterName?: string; title?: string }, index: number) => ({
        id: `${index}`,
        number: (ch.chapterIndex ?? index) + 1,
        title: ch.chapterName || ch.title,
      }))
    : Array.from({ length: totalEpisodes || 20 }, (_, i) => ({
        id: `${i}`,
        number: i + 1,
      }));

  return (
    <div className="pt-16 pb-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <Link
            href={`/drama/${id}`}
            className="inline-flex items-center gap-2 text-[#B3B3B3] hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to {title}
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {videoUrl ? (
              <VideoPlayer
                src={videoUrl}
                poster={poster}
                title={`${title} - Episode ${episode}`}
                dramaId={id}
                episode={episode}
                type="drama"
                hasPrevious={episode > 1}
                hasNext={episode < totalEpisodes}
              />
            ) : (
              <div className="aspect-video bg-[#1A1A1A] rounded-lg flex flex-col items-center justify-center">
                <AlertCircle className="w-12 h-12 text-yellow-500 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Video Not Available</h3>
                <p className="text-gray-400 text-center mb-4 max-w-md">
                  Unable to load video for this episode. The video might be unavailable or require VIP access.
                </p>
                <div className="flex gap-4">
                  {episode > 1 && (
                    <Link href={`/drama/${id}/watch/${episode - 1}`}>
                      <Button variant="secondary">Previous Episode</Button>
                    </Link>
                  )}
                  {episode < totalEpisodes && (
                    <Link href={`/drama/${id}/watch/${episode + 1}`}>
                      <Button>Next Episode</Button>
                    </Link>
                  )}
                </div>
              </div>
            )}

            <div className="bg-[#1A1A1A] rounded-lg p-4">
              <h1 className="text-xl font-semibold text-white">{title}</h1>
              <p className="text-[#B3B3B3] mt-1">
                Episode {episode} {totalEpisodes > 0 && `of ${totalEpisodes}`}
              </p>
            </div>

            {/* Episode Navigation */}
            <div className="flex justify-between">
              {episode > 1 ? (
                <Link href={`/drama/${id}/watch/${episode - 1}`}>
                  <Button variant="secondary" className="gap-2">
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                </Link>
              ) : <div />}
              
              {episode < totalEpisodes ? (
                <Link href={`/drama/${id}/watch/${episode + 1}`}>
                  <Button className="gap-2">
                    Next
                    <ChevronLeft className="w-4 h-4 rotate-180" />
                  </Button>
                </Link>
              ) : <div />}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[#1A1A1A] rounded-lg p-4 sticky top-20">
              <EpisodeList
                episodes={episodes}
                currentEpisode={episode}
                dramaId={id}
                type="drama"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
