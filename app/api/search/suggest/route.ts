import { NextRequest, NextResponse } from "next/server";

const SAPIMU_BASE_URL = process.env.SAPIMU_BASE_URL || "https://sapimu.au";
const SAPIMU_TOKEN = process.env.SAPIMU_API_TOKEN || "";
const SANSEKAI_BASE_URL = process.env.SANSEKAI_BASE_URL || "https://api.sansekai.my.id/api";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");
  
  if (!query) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const suggestions: { id: string; title: string; type: string }[] = [];

    const [sapimuRes, sansekaiDramaRes, sansekaiAnimeRes] = await Promise.allSettled([
      fetch(`${SAPIMU_BASE_URL}/dramabox/api/suggest/${encodeURIComponent(query)}?lang=en`, {
        headers: { Authorization: `Bearer ${SAPIMU_TOKEN}` },
      }),
      fetch(`${SANSEKAI_BASE_URL}/dramabox/search?q=${encodeURIComponent(query)}`),
      fetch(`${SANSEKAI_BASE_URL}/anime/search?q=${encodeURIComponent(query)}`),
    ]);

    if (sapimuRes.status === "fulfilled" && sapimuRes.value.ok) {
      const data = await sapimuRes.value.json();
      if (data.data && Array.isArray(data.data)) {
        data.data.slice(0, 5).forEach((item: { bookId?: string; bookName?: string }) => {
          if (item.bookId && item.bookName) {
            suggestions.push({
              id: item.bookId,
              title: item.bookName,
              type: "drama",
            });
          }
        });
      }
    }

    if (sansekaiDramaRes.status === "fulfilled" && sansekaiDramaRes.value.ok) {
      const data = await sansekaiDramaRes.value.json();
      if (data.data && Array.isArray(data.data)) {
        data.data.slice(0, 3).forEach((item: { id?: string; title?: string }) => {
          if (item.id && item.title) {
            suggestions.push({
              id: `sansekai-${item.id}`,
              title: item.title,
              type: "drama",
            });
          }
        });
      }
    }

    if (sansekaiAnimeRes.status === "fulfilled" && sansekaiAnimeRes.value.ok) {
      const data = await sansekaiAnimeRes.value.json();
      if (data.data && Array.isArray(data.data)) {
        data.data.slice(0, 3).forEach((item: { id?: string; title?: string }) => {
          if (item.id && item.title) {
            suggestions.push({
              id: item.id,
              title: item.title,
              type: "anime",
            });
          }
        });
      }
    }

    return NextResponse.json({ suggestions: suggestions.slice(0, 10) });
  } catch (error) {
    console.error("Search suggest error:", error);
    return NextResponse.json({ suggestions: [] });
  }
}
