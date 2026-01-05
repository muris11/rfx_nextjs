import Link from "next/link";
import { Github, Instagram, Globe, Mail, Heart } from "lucide-react";

const footerLinks = {
  browse: [
    { href: "/drama", label: "Drama" },
    { href: "/anime", label: "Anime" },
    { href: "/komik", label: "Komik" },
    { href: "/shorts", label: "Shorts" },
  ],
  categories: [
    { href: "/drama?genre=romance", label: "Romance" },
    { href: "/drama?genre=action", label: "Action" },
    { href: "/drama?genre=comedy", label: "Comedy" },
    { href: "/drama?genre=thriller", label: "Thriller" },
  ],
  support: [
    { href: "/help", label: "Help Center" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/cookies", label: "Cookie Policy" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border mt-8 pb-20 md:pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-block">
              <span className="text-4xl font-black text-primary tracking-tighter">RFX</span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed max-w-sm">
              Experience the best of Asian entertainment. Stream dramas, anime, and comics from around the world in one place.
              High quality, fast streaming, and always free.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Instagram, href: "https://instagram.com/rfqy_sptr", label: "Instagram" },
                { icon: Github, href: "https://github.com/muris11", label: "GitHub" },
                { icon: Globe, href: "https://rifqysaputra.my.id", label: "Portfolio" },
                { icon: Mail, href: "mailto:rifqysaputra1102@gmail.com", label: "Email" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-text-secondary hover:text-white hover:bg-primary transition-all duration-300 hover:scale-110"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Links Columns */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Browse</h3>
            <ul className="space-y-3">
              {footerLinks.browse.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"/>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="lg:col-span-1">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Genres</h3>
            <ul className="space-y-3">
              {footerLinks.categories.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"/>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="lg:col-span-1">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"/>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
        
        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} RFX. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span>Made with</span>
            <span>by</span>
            <a 
              href="https://rifqysaputra.my.id" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-white transition-colors font-medium"
            >
              Rifqy Saputra
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
