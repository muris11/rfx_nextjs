import { Metadata } from "next";
import ComicReader from "@/components/content/ComicReader";
import Link from "next/link";
import Button from "@/components/ui/Button";

const SANSEKAI_BASE_URL = process.env.SANSEKAI_BASE_URL || "https://api.sansekai.my.id/api";

interface Props {
  params: Promise<{ id: string; chapter: string }>;
}

async function getChapterImages(chapterId: string) {
  try {
    // Use chapter_id parameter as per API documentation
    const res = await fetch(`${SANSEKAI_BASE_URL}/komik/getimage?chapter_id=${encodeURIComponent(chapterId)}`, {
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const json = await res.json();
      const data = json.data;
      
      // Handle nested structure: data.chapter.data contains array of image URLs
      if (data?.chapter?.data && Array.isArray(data.chapter.data)) {
        return data.chapter.data;
      }
      // Fallback to other formats
      if (data && Array.isArray(data)) return data;
      if (data?.images && Array.isArray(data.images)) return data.images;
      if (data?.result && Array.isArray(data.result)) return data.result;
      if (Array.isArray(json)) return json;
    }
  } catch (e) {
    console.error("Error fetching chapter images:", e);
  }
  return [];
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const komikInfo = await getKomikDetail(id);
  const title = komikInfo?.title || "Read Comic";
  
  return {
    title: `${title} - Reading`,
  };
}

export default async function ReadKomikPage({ params }: Props) {
  const { id, chapter } = await params;
  
  const [images, komikInfo, chapters] = await Promise.all([
    getChapterImages(chapter),
    getKomikDetail(id),
    getChapterList(id),
  ]);

  // Extract image URLs from various formats
  const imageUrls: string[] = [];
  if (Array.isArray(images)) {
    for (const img of images) {
      if (typeof img === 'string' && img.startsWith('http')) {
        imageUrls.push(img);
      } else if (typeof img === 'object' && img !== null) {
        const imgObj = img as { url?: string; src?: string; image?: string; link?: string };
        const url = imgObj.url || imgObj.src || imgObj.image || imgObj.link;
        if (url && typeof url === 'string') {
          imageUrls.push(url);
        }
      }
    }
  }

  // Find current chapter index
  const currentChapterIndex = chapters.findIndex((ch: { id?: string; chapter_id?: string }) => 
    ch.id === chapter || ch.chapter_id === chapter
  );
  const currentChapterNum = currentChapterIndex >= 0 ? currentChapterIndex + 1 : 1;
  const currentChapter = chapters[currentChapterIndex];

  // If no images found, show error
  if (imageUrls.length === 0) {
    return (
      <div className="pt-20 pb-10 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">No Images Found</h1>
          <p className="text-gray-400 mb-6">Unable to load images for this chapter.</p>
          <Link href={`/komik/${id}`}>
            <Button>Back to Comic</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ComicReader
      images={imageUrls}
      komikId={id}
      currentChapter={currentChapterNum}
      totalChapters={chapters.length}
      chapterTitle={currentChapter?.title || currentChapter?.name}
      chapters={chapters}
    />
  );
}
