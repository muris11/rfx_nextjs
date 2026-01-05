"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Film, Tv, BookOpen, Zap, Heart, MoreHorizontal, History, Shuffle, X } from "lucide-react";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/drama", label: "Drama", icon: Film },
  { href: "/shorts", label: "Shorts", icon: Zap },
  { href: "/favorites", label: "Favorit", icon: Heart },
  { href: "/more", label: "Lainnya", icon: MoreHorizontal, isMore: true },
];

const moreItems = [
  { href: "/anime", label: "Anime", icon: Tv, desc: "Latest Anime Series" },
  { href: "/komik", label: "Komik", icon: BookOpen, desc: "Read Popular Comics" },
  { href: "/history", label: "Riwayat", icon: History, desc: "Watch History" },
  { href: "/random", label: "Random", icon: Shuffle, desc: "Surprise Me!" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Auto-hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setShowMore(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <AnimatePresence>
        {/* More Menu Overlay */}
        {showMore && (
          <motion.div
            key="more-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[90] md:hidden"
            onClick={() => setShowMore(false)}
          />
        )}

        {/* More Menu Sheet */}
        {showMore && (
          <motion.div
            key="more-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring" as const, damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[95] md:hidden bg-[#121212] rounded-t-3xl border-t border-white/10 pb-20 overflow-hidden"
          >
            <div className="flex justify-center pt-3 pb-6" onClick={() => setShowMore(false)}>
              <div className="w-12 h-1.5 bg-white/20 rounded-full" />
            </div>
            
            <div className="px-6 pb-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">More Menu</h3>
                <button onClick={() => setShowMore(false)} className="p-2 bg-white/5 rounded-full">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {moreItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setShowMore(false)}
                    className="flex flex-col gap-2 p-4 rounded-2xl bg-white/5 border border-white/5 active:scale-95 transition-all"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#E50914]/10 flex items-center justify-center text-[#E50914]">
                      {item.icon && <item.icon className="w-5 h-5" />}
                    </div>
                    <div>
                      <span className="block font-bold text-white text-sm">{item.label}</span>
                      <span className="block text-[10px] text-gray-500">{item.desc}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Navigation Bar */}
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : 100 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-0 left-0 right-0 z-[80] md:hidden bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/10 safe-pb"
      >
        <div className="flex items-center justify-between px-2 h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || 
              (item.href !== "/" && !item.isMore && pathname.startsWith(item.href));
            const isMoreActive = item.isMore && showMore;

            if (item.isMore) {
              return (
                <button
                  key={item.href}
                  onClick={() => setShowMore(!showMore)}
                  className="relative flex-1 flex flex-col items-center justify-center gap-1 py-1 h-full touch-manipulation"
                >
                  <div className={`p-1.5 rounded-xl transition-all duration-300 ${
                    isMoreActive ? "bg-[#E50914]/10" : ""
                  }`}>
                    <Icon className={`w-6 h-6 transition-colors duration-300 ${
                      isMoreActive ? "text-[#E50914]" : "text-[#A3A3A3]"
                    }`} />
                  </div>
                  <span className={`text-[10px] font-medium transition-colors duration-300 ${
                    isMoreActive ? "text-[#E50914]" : "text-[#A3A3A3]"
                  }`}>
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setShowMore(false)}
                className="relative flex-1 flex flex-col items-center justify-center gap-1 py-1 h-full touch-manipulation group"
              >
                {isActive && (
                  <motion.div
                    layoutId="bottomNavGlow"
                    className="absolute inset-0 bg-gradient-to-t from-[#E50914]/10 to-transparent opacity-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                  />
                )}
                
                <div className="relative p-1.5">
                  <Icon className={`w-6 h-6 transition-all duration-300 ${
                    isActive ? "text-[#E50914] -translate-y-1" : "text-[#A3A3A3] group-active:scale-90"
                  }`} />
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeDot"
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#E50914] rounded-full"
                    />
                  )}
                </div>
                
                <span className={`text-[10px] font-medium transition-all duration-300 ${
                  isActive ? "text-[#E50914]" : "text-[#A3A3A3]"
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </motion.nav>
    </>
  );
}
