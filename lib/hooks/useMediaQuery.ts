"use client";

import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  // Initialize with false to avoid hydration mismatch
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Avoid running on server
    if (typeof window === "undefined") return;

    const media = window.matchMedia(query);
    
    // Set initial value only once
    const updateMatches = () => setMatches(media.matches);
    updateMatches();

    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}

export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 768px)");
}

export function useIsTablet(): boolean {
  return useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
}

export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1025px)");
}
