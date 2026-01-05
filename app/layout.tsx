import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Providers from "@/components/providers/Providers";
import StructuredData from "@/components/seo/StructuredData";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rfx.based.my.id"),
  title: {
    default:
      "RFX - Watch Beyond Borders | Stream Drama, Anime & Komik Online Free",
    template: "%s | RFX - Premium Streaming Platform",
  },
  description:
    "Watch latest Asian drama, anime episodes, read manga & komik online for free. Stream Korean drama, Japanese anime, Chinese series, Thai lakorn with English subtitles. Your ultimate entertainment destination at RFX.",
  keywords: [
    // General streaming
    "streaming",
    "watch online",
    "free streaming",
    "online entertainment",
    // Drama keywords
    "drama",
    "korean drama",
    "kdrama",
    "chinese drama",
    "cdrama",
    "japanese drama",
    "jdrama",
    "thai drama",
    "thai lakorn",
    "asian drama",
    "drama sub indo",
    "drama subtitle indonesia",
    "nonton drama online",
    // Anime keywords
    "anime",
    "anime online",
    "anime streaming",
    "watch anime",
    "anime sub indo",
    "anime subtitle indonesia",
    "nonton anime",
    "anime terbaru",
    "anime sub english",
    "japanese anime",
    "manga anime",
    // Komik/Manga keywords
    "komik",
    "manga",
    "manhwa",
    "manhua",
    "webtoon",
    "read manga online",
    "baca komik online",
    "komik online",
    "manga reader",
    // Shorts keywords
    "shorts",
    "short videos",
    "drama clips",
    "anime clips",
    // Quality indicators
    "HD streaming",
    "high quality",
    "english subtitles",
    "subtitle indonesia",
    // Platform specific
    "rfx",
    "rfx streaming",
    "watch beyond borders",
    // Genre specific
    "romance drama",
    "action anime",
    "comedy series",
    "thriller drama",
    // Recent/trending
    "latest drama",
    "new anime",
    "trending series",
    "popular drama",
  ],
  authors: [{ name: "RFX Team", url: "https://rfx.based.my.id" }],
  creator: "RFX Streaming Platform",
  publisher: "RFX",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "RFX Stream",
    startupImage: [
      {
        url: "/logo.png",
        media: "(device-width: 768px) and (device-height: 1024px)",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["id_ID", "ja_JP", "ko_KR", "zh_CN", "th_TH"],
    url: "https://rfx.based.my.id",
    siteName: "RFX - Watch Beyond Borders",
    title: "RFX | Stream Asian Drama, Anime & Komik Online Free",
    description:
      "Your ultimate destination for streaming Asian entertainment. Watch Korean drama, Japanese anime, Chinese series, read manga & komik with English & Indonesian subtitles. 100% Free HD streaming.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "RFX - Watch Beyond Borders | Premium Streaming Platform",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@rfx_stream",
    creator: "@rfx_stream",
    title: "RFX | Stream Drama, Anime & Komik Free",
    description:
      "Watch latest Asian drama, anime episodes, read manga online. Korean drama, Japanese anime, Chinese series with subtitles. Stream now at RFX!",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://rfx.based.my.id",
    languages: {
      "en-US": "https://rfx.based.my.id",
      "id-ID": "https://rfx.based.my.id",
    },
  },
  category: "entertainment",
  classification: "Streaming Platform",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#E50914",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="o2ir9CkyJIYS4cLjvjujSQuopXw1t7pRUAEA5tK8YBo"
        />
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="shortcut icon" href="/logo.png" />
        <StructuredData />
      </head>
      <body
        className={`${inter.variable} font-sans bg-background text-foreground antialiased`}
      >
        <Providers>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg"
          >
            Skip to content
          </a>
          <Navbar />
          <main id="main-content" className="min-h-screen">
            {children}
          </main>
          <Footer />
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
