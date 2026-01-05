"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X, Film, Tv, BookOpen, Zap, Home, Heart, History, Shuffle } from "lucide-react";
import SearchBar from "../content/SearchBar";
import Sidebar from "./Sidebar";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/drama", label: "Drama", icon: Film },
  { href: "/anime", label: "Anime", icon: Tv },
  { href: "/komik", label: "Komik", icon: BookOpen },
  { href: "/shorts", label: "Shorts", icon: Zap },
];

const extraLinks = [
  { href: "/favorites", label: "Favorit", icon: Heart },
  { href: "/history", label: "Riwayat", icon: History },
  { href: "/random", label: "Random", icon: Shuffle },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-xl border-b border-white/5 shadow-lg"
            : "bg-black/40 backdrop-blur-md border-b border-transparent"
        }`}
      >
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo & Main Nav */}
            <div className="flex items-center gap-12">
              <Link href="/" className="flex items-center gap-2 group relative z-50">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-3xl font-black tracking-tighter text-primary drop-shadow-[0_0_15px_rgba(229,9,20,0.5)]"
                >
                  RFX
                </motion.span>
              </Link>
              
              <div className="hidden md:flex items-center gap-2">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href || 
                    (link.href !== "/" && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 group"
                    >
                      {isActive && (
                        <>
                          <motion.div
                            layoutId="activeNavPill"
                            className="absolute inset-0 bg-primary/20 rounded-full backdrop-blur-md shadow-[0_0_20px_rgba(229,9,20,0.4)]"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                          <motion.div
                            layoutId="activeNavGlow"
                            className="absolute inset-0 bg-primary/10 rounded-full blur-md"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        </>
                      )}
                      <span className={`relative z-10 transition-colors duration-300 ${
                        isActive 
                          ? "text-white font-bold" 
                          : "text-text-secondary group-hover:text-white"
                      }`}>
                        {link.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* Extra Links - Desktop */}
              <div className="hidden lg:flex items-center gap-2 border-r border-white/10 pr-4 mr-2">
                {extraLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`p-2.5 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 ${
                        isActive 
                          ? "text-primary bg-primary/10 shadow-[0_0_15px_rgba(229,9,20,0.3)]" 
                          : "text-text-secondary hover:text-white hover:bg-white/10"
                      }`}
                      title={link.label}
                    >
                      <Icon className="w-5 h-5" />
                    </Link>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                {isSearchOpen ? (
                  <motion.div
                    key="search"
                    initial={{ opacity: 0, width: 0, scale: 0.95 }}
                    animate={{ opacity: 1, width: "auto", scale: 1 }}
                    exit={{ opacity: 0, width: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center gap-2"
                  >
                    <div className="relative z-50">
                      <SearchBar onClose={() => setIsSearchOpen(false)} />
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsSearchOpen(false)}
                      className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.button
                    key="searchBtn"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2.5 rounded-full text-text-secondary hover:text-white hover:bg-white/10 transition-colors"
                    aria-label="Search"
                  >
                    <Search className="w-5 h-5" />
                  </motion.button>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSidebarOpen(true)}
                className="p-2.5 rounded-full text-text-secondary hover:text-white hover:bg-white/10 transition-colors md:hidden"
                aria-label="Menu"
              >
                <Menu className="w-6 h-6" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        links={[...navLinks, ...extraLinks]}
        currentPath={pathname}
      />
    </>
  );
}
