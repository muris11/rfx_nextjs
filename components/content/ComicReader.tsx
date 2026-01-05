"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, List, X } from "lucide-react";
import Link from "next/link";

interface Chapter {
  id?: string;
  chapter_id?: string;
  title?: string;
  name?: string;
  number?: number;
}

interface ComicReaderProps {
  images: string[];
  komikId: string;
  currentChapter: number;
  totalChapters: number;
  chapterTitle?: string;
  chapters?: Chapter[];
}

export default function ComicReader({
  images,
  komikId,
  currentChapter,
  totalChapters,
  chapterTitle,
  chapters = [],
}: ComicReaderProps) {
  const [zoom, setZoom] = useState(100);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [showChapterList, setShowChapterList] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index));
  }, []);

  const handleImageError = useCallback((index: number) => {
    setImageErrors((prev) => new Set(prev).add(index));
  }, []);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "+" || e.key === "=") handleZoomIn();
      if (e.key === "-") handleZoomOut();
      if (e.key === "Escape") setShowChapterList(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const hasPrev = currentChapter > 1;
  const hasNext = currentChapter < totalChapters;

  const prevChapterId = chapters[currentChapter - 2]?.id || chapters[currentChapter - 2]?.chapter_id || (currentChapter - 1);
  const nextChapterId = chapters[currentChapter]?.id || chapters[currentChapter]?.chapter_id || (currentChapter + 1);

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Top Navigation Bar */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-[#0D0D0D]/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/komik/${komikId}`}
              className="text-[#B3B3B3] hover:text-white transition-colors"
            >
              ← Back
            </Link>
            <span className="text-white font-medium truncate max-w-[200px] md:max-w-none">
              Chapter {currentChapter}
              {chapterTitle && `: ${chapterTitle}`}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Chapter List Button */}
            <button
              onClick={() => setShowChapterList(!showChapterList)}
              className="p-2 bg-[#1A1A1A] rounded-lg text-white hover:bg-[#2A2A2A] transition-colors"
              title="Chapter List"
            >
              <List className="w-5 h-5" />
            </button>

            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-2 bg-[#1A1A1A] rounded-lg p-1">
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 50}
                className="p-2 text-white hover:text-[#E50914] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-sm text-white w-12 text-center">{zoom}%</span>
              <button
                onClick={handleZoomIn}
                disabled={zoom >= 200}
                className="p-2 text-white hover:text-[#E50914] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-2">
              {hasPrev && (
                <Link
                  href={`/komik/${komikId}/read/${prevChapterId}`}
                  className="p-2 bg-[#1A1A1A] rounded-lg text-white hover:bg-[#2A2A2A] transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Link>
              )}
              {hasNext && (
                <Link
                  href={`/komik/${komikId}/read/${nextChapterId}`}
                  className="p-2 bg-[#1A1A1A] rounded-lg text-white hover:bg-[#2A2A2A] transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chapter List Sidebar */}
      {showChapterList && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowChapterList(false)}
          />
          <div className="fixed right-0 top-0 bottom-0 w-80 max-w-full bg-[#1A1A1A] z-50 overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white">Chapters</h3>
              <button
                onClick={() => setShowChapterList(false)}
                className="p-2 text-white hover:text-[#E50914] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="divide-y divide-white/10">
              {chapters.map((ch, index) => {
                const chId = ch.id || ch.chapter_id || (index + 1);
                const isActive = index + 1 === currentChapter;
                return (
                  <Link
                    key={chId}
                    href={`/komik/${komikId}/read/${chId}`}
                    onClick={() => setShowChapterList(false)}
                    className={`block p-4 transition-colors ${
                      isActive 
                        ? "bg-[#E50914] text-white" 
                        : "text-white hover:bg-white/5"
                    }`}
                  >
                    {ch.title || ch.name || `Chapter ${ch.number || index + 1}`}
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Comic Images */}
      <div className="pt-32 pb-20">
        <div
          className="mx-auto transition-all duration-200"
          style={{ maxWidth: `${zoom}%` }}
        >
          {images.length === 0 ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <p className="text-gray-400">No images to display</p>
            </div>
          ) : (
            images.map((image, index) => (
              <div key={index} className="relative">
                {!loadedImages.has(index) && !imageErrors.has(index) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#1A1A1A] min-h-[400px]">
                    <div className="w-8 h-8 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                {imageErrors.has(index) ? (
                  <div className="flex items-center justify-center bg-[#1A1A1A] min-h-[200px]">
                    <p className="text-gray-500">Failed to load image {index + 1}</p>
                  </div>
                ) : (
                  <Image
                    src={image}
                    alt={`Page ${index + 1}`}
                    width={800}
                    height={1200}
                    className="w-full h-auto"
                    onLoad={() => handleImageLoad(index)}
                    onError={() => handleImageError(index)}
                    unoptimized
                    priority={index < 3}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0D0D0D]/95 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {hasPrev ? (
            <Link
              href={`/komik/${komikId}/read/${prevChapterId}`}
              className="flex items-center gap-2 text-white hover:text-[#E50914] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Previous Chapter</span>
              <span className="sm:hidden">Prev</span>
            </Link>
          ) : (
            <div />
          )}

          <span className="text-sm text-[#B3B3B3]">
            {currentChapter} / {totalChapters}
          </span>

          {hasNext ? (
            <Link
              href={`/komik/${komikId}/read/${nextChapterId}`}
              className="flex items-center gap-2 text-white hover:text-[#E50914] transition-colors"
            >
              <span className="hidden sm:inline">Next Chapter</span>
              <span className="sm:hidden">Next</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
