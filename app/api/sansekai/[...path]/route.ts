import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.SANSEKAI_BASE_URL || "https://api.sansekai.my.id/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const pathStr = path.join("/");
    const searchParams = request.nextUrl.searchParams.toString();
    const url = `${BASE_URL}/${pathStr}${searchParams ? `?${searchParams}` : ""}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Sansekai API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
