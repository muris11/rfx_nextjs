import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import VideoPlayer from "@/components/content/VideoPlayer";

const SANSEKAI_BASE_URL = process.env.SANSEKAI_BASE_URL || "https://api.sansekai.my.id/api";

interface Props {
  params: Promise<{ id: string }>;
}

async function getShortDetail(id: string) {
  try {
    const res = await fetch(`${SANSEKAI_BASE_URL}/melolo/detail?id=${encodeURIComponent(id)}`, {
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const data = await res.json();
      return data.data || data;
    }
  } catch {}
  return null;
}

async function getShortStream(id: string) {
  try {
    const res = await fetch(`${SANSEKAI_BASE_URL}/melolo/stream?id=${encodeURIComponent(id)}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      return data.data || data;
    }
  } catch {}
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const detail = await getShortDetail(id);
  
  return {
    title: detail?.title || "Watch Short",
    description: detail?.description || "",
  };
}

export default async function ShortPlayerPage({ params }: Props) {
  const { id } = await params;
  
  const [detail, stream] = await Promise.all([
    getShortDetail(id),
    getShortStream(id),
  ]);

  const title = detail?.title || "Short Drama";
  const description = detail?.description || "";
  const videoUrl = stream?.url || stream?.source || "";

  return (
    <div className="pt-16 pb-10 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <Link
            href="/shorts"
            className="inline-flex items-center gap-2 text-[#B3B3B3] hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Shorts
          </Link>
        </div>

        <div className="space-y-6">
          <VideoPlayer src={videoUrl} title={title} />

          <div className="bg-[#1A1A1A] rounded-lg p-4 space-y-3">
            <h1 className="text-xl font-semibold text-white">{title}</h1>
            {description && (
              <p className="text-[#B3B3B3]">{description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
