import { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  links: NavLink[];
  currentPath: string;
}

const sidebarVariants = {
  closed: {
    x: "100%",
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 40,
    },
  },
  open: {
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 40,
    },
  },
};

const overlayVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
};

export default function Sidebar({ isOpen, onClose, links, currentPath }: SidebarProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[110] md:hidden"
            onClick={onClose}
          />
          
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed top-0 right-0 bottom-0 w-80 bg-surface border-l border-white/5 z-[120] shadow-2xl md:hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <span className="text-2xl font-black tracking-tighter text-primary drop-shadow-[0_0_15px_rgba(229,9,20,0.5)]">RFX</span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 text-text-secondary hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>
            
            <nav className="flex-1 overflow-y-auto p-6">
              <ul className="space-y-2">
                {links.map((link) => {
                  const Icon = link.icon;
                  const isActive = currentPath === link.href || 
                    (link.href !== "/" && currentPath.startsWith(link.href));
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                          isActive
                            ? "bg-primary text-white shadow-lg shadow-primary/30"
                            : "text-text-secondary hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium text-lg">{link.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            
            <div className="p-6 border-t border-white/5 bg-background/50">
              <p className="text-sm text-center text-text-muted">
                RFX - Watch Beyond Borders
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
