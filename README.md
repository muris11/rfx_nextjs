# 🎬 RFX - Watch Beyond Borders

<div align="center">

![RFX Banner](https://img.shields.io/badge/RFX-Streaming%20Platform-E50914?style=for-the-badge&logo=netflix)

**Modern streaming platform untuk Drama, Anime, Komik, dan Shorts**

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11.0-FF0055?style=flat-square&logo=framer)](https://www.framer.com/motion/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[🌐 Live Demo](https://rfx.based.my.id) • [📖 Documentation](#features) • [🚀 Quick Start](#getting-started) • [💬 Report Bug](https://github.com/muris11/rfx_nextjs/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Design System](#design-system)
- [Performance](#performance)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Overview

**RFX** adalah platform streaming modern yang menyediakan akses ke berbagai konten entertainment dari seluruh dunia. Dengan desain yang terinspirasi dari Netflix dan dioptimalkan untuk performa maksimal, RFX memberikan pengalaman menonton yang seamless di semua device.

### ✨ Highlights

- 🎯 **Netflix-inspired UI/UX** - Modern, clean, dan intuitive
- ⚡ **Lightning Fast** - Optimized dengan Next.js 16 & Turbopack
- 📱 **PWA Ready** - Install sebagai app di mobile & desktop
- 🎨 **Beautiful Animations** - Smooth micro-interactions dengan Framer Motion
- 🌙 **Dark Theme** - Eye-friendly dengan modern color palette
- 🔍 **Smart Search** - Auto-suggest dengan thumbnail preview
- 💾 **Local Storage** - Track favorites & watch history
- 🎭 **Multi-Category** - Drama, Anime, Komik, Shorts dalam satu platform

---

## 🚀 Features

### 🎬 Content Discovery

- **Hero Carousel** - Full-screen cinematic showcase dengan auto-play
- **Top 10 Trending** - Special section dengan numbered rankings
- **Content Rows** - Horizontal scrollable dengan lazy loading
- **Continue Watching** - Resume dari terakhir kali ditonton
- **Random Discover** - Temukan konten baru secara random

### 🎨 UI/UX Excellence

- **Quick View Modal** - Preview info tanpa pindah halaman
- **Backdrop Preview** - Hover untuk lihat backdrop image
- **Smooth Transitions** - Page & component transitions yang fluid
- **Responsive Design** - Perfect di mobile, tablet, dan desktop
- **Glassmorphism** - Modern glass effects di seluruh UI
- **Gradient Typography** - Eye-catching section titles

### ⚙️ Technical Features

- **Server-Side Rendering** - Fast initial load dengan Next.js SSR
- **API Proxy** - Seamless integration dengan multiple APIs
- **Image Optimization** - Blur placeholder & lazy loading
- **Code Splitting** - Automatic bundle optimization
- **Error Handling** - Graceful error boundaries & fallbacks
- **TypeScript** - Full type safety

### 📱 PWA Capabilities

- **Offline Support** - Service worker untuk offline access
- **Add to Home Screen** - Install sebagai native app
- **Push Notifications** - (Coming soon)
- **Background Sync** - (Coming soon)

---

## 🛠️ Tech Stack

### Core Framework
- **[Next.js 16.1.1](https://nextjs.org/)** - React framework dengan App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe JavaScript

### Styling & UI
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion 11](https://www.framer.com/motion/)** - Production-ready animations
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library

### State & Data
- **React Hooks** - useState, useEffect, useCallback, useRef
- **Local Storage** - Client-side persistence
- **Server Components** - Next.js server-side rendering

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting
- **[PostCSS](https://postcss.org/)** - CSS processing
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications

### External APIs
- **Sapimu API** - Drama & movies data
- **Sansekai API** - Anime data
- **Custom Proxy** - API routing & caching

---

## 🏁 Getting Started

### Prerequisites

- **Node.js** 18.x atau lebih baru
- **npm** atau **yarn** atau **pnpm**
- **Git**

### Installation

1. **Clone repository**
   ```bash
   git clone https://github.com/muris11/rfx_nextjs.git
   cd rfx_nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   # atau
   yarn install
   # atau
   pnpm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` dan tambahkan konfigurasi yang diperlukan:
   ```env
   NEXT_PUBLIC_APP_URL=https://rfx.based.my.id
   NEXT_PUBLIC_APP_NAME=RFX
   ```

4. **Run development server**
   ```bash
   npm run dev
   # atau
   yarn dev
   # atau
   pnpm dev
   ```

5. **Open browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
rfx/
├── app/                          # Next.js App Router
│   ├── anime/                    # Anime pages
│   │   ├── [id]/                 # Detail page
│   │   │   └── watch/            # Watch page
│   │   ├── AnimeList.tsx         # List component
│   │   └── page.tsx              # Main page
│   ├── drama/                    # Drama pages (similar structure)
│   ├── komik/                    # Komik pages (similar structure)
│   ├── shorts/                   # Shorts pages (similar structure)
│   ├── api/                      # API routes
│   │   ├── sansekai/[...path]/   # Anime API proxy
│   │   └── sapimu/[...path]/     # Drama API proxy
│   ├── favorites/                # Favorites page
│   ├── history/                  # Watch history
│   ├── search/                   # Search page
│   ├── help/                     # Help center
│   ├── HomeContent.tsx           # Homepage content
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   └── globals.css               # Global styles
│
├── components/                   # Reusable components
│   ├── content/                  # Content components
│   │   ├── Card.tsx              # Content card dengan quick view
│   │   ├── Carousel.tsx          # Hero carousel
│   │   ├── ContentRow.tsx        # Horizontal content row
│   │   ├── Top10Row.tsx          # Top 10 section
│   │   ├── ContinueWatching.tsx  # Continue watching row
│   │   ├── SearchBar.tsx         # Search dengan suggestions
│   │   └── VideoPlayer.tsx       # Video player
│   ├── layout/                   # Layout components
│   │   ├── Navbar.tsx            # Navigation bar
│   │   ├── Footer.tsx            # Footer
│   │   ├── Sidebar.tsx           # Mobile sidebar
│   │   └── BottomNav.tsx         # Mobile bottom nav
│   ├── ui/                       # UI primitives
│   │   ├── Button.tsx            # Button component
│   │   ├── Badge.tsx             # Badge component
│   │   └── Skeleton.tsx          # Loading skeletons
│   └── providers/                # Context providers
│       └── Providers.tsx         # App providers wrapper
│
├── lib/                          # Utilities & helpers
│   ├── api/                      # API utilities
│   ├── hooks/                    # Custom React hooks
│   │   └── useUserData.ts        # User data management
│   └── utils/                    # Helper functions
│
├── public/                       # Static assets
│   ├── manifest.json             # PWA manifest
│   ├── placeholder.svg           # Placeholder images
│   └── icons/                    # App icons
│
├── .env.local                    # Environment variables
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
├── vercel.json                   # Vercel deployment config
├── DEPLOYMENT.md                 # Deployment guide
└── README.md                     # This file
```

---

## 🔌 API Integration

### Anime API (Sansekai)
```typescript
// Proxy endpoint
/api/sansekai/[...path]

// Example usage
fetch('/api/sansekai/anime/popular')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Drama API (Sapimu)
```typescript
// Proxy endpoint
/api/sapimu/[...path]

// Example usage
fetch('/api/sapimu/drama/trending')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Search API
```typescript
// Search suggestions
fetch('/api/search/suggest?q=naruto')
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
--color-primary: #E50914;        /* Netflix Red */
--color-primary-hover: #ff1a1a;
--color-accent: #00D9FF;         /* Cyberpunk Blue */

/* Neutrals */
--color-background: #0a0a0a;     /* Deep Black */
--color-surface: #141414;        /* Card Background */
--color-surface-hover: #1a1a1a;

/* Text */
--color-text-primary: #ffffff;
--color-text-secondary: #b3b3b3;
--color-text-muted: #808080;
```

### Typography

```css
/* Font Family */
font-family: var(--font-inter), system-ui, sans-serif;

/* Font Sizes */
text-xs:    0.75rem  (12px)
text-sm:    0.875rem (14px)
text-base:  1rem     (16px)
text-lg:    1.125rem (18px)
text-xl:    1.25rem  (20px)
text-2xl:   1.5rem   (24px)
text-3xl:   1.875rem (30px)
```

### Spacing Scale

```
0.5 → 2px
1   → 4px
2   → 8px
3   → 12px
4   → 16px
6   → 24px
8   → 32px
12  → 48px
16  → 64px
```

### Animations

- **Duration**: 200ms - 500ms
- **Easing**: cubic-bezier(0.16, 1, 0.3, 1)
- **Hover Scale**: 1.05 - 1.10
- **Transitions**: opacity, transform, colors

---

## ⚡ Performance

### Lighthouse Scores (Target)

- **Performance**: 90+ 🟢
- **Accessibility**: 95+ 🟢
- **Best Practices**: 95+ 🟢
- **SEO**: 100 🟢

### Optimization Techniques

✅ **Image Optimization**
- Blur placeholder untuk lazy loading
- WebP format support
- Responsive images dengan Next.js Image

✅ **Code Splitting**
- Dynamic imports untuk heavy components
- Route-based splitting otomatis

✅ **Caching Strategy**
- Static assets: 1 year cache
- API responses: 60s stale-while-revalidate
- Service worker untuk offline

✅ **Bundle Optimization**
- Tree shaking
- Minification
- Compression (gzip/brotli)

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Push ke GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin master
   ```

2. **Import di Vercel**
   - Buka [vercel.com](https://vercel.com)
   - Import GitHub repository
   - Auto-detect Next.js configuration
   - Deploy!

3. **Environment Variables**
   - Set di Vercel Dashboard → Settings → Environment Variables
   - Tambahkan semua variabel dari `.env.local`

### Alternative Platforms

- **Netlify**: `npm run build` → Deploy `.next` folder
- **Railway**: Auto-deploy dengan GitHub integration
- **Docker**: Lihat `Dockerfile.example` (coming soon)

### Custom Domain

```bash
# Vercel CLI
vercel domains add rfx.based.my.id
```

Atau atur di Vercel Dashboard → Settings → Domains

**Live Demo**: [https://rfx.based.my.id](https://rfx.based.my.id)

---

## 🤝 Contributing

Kontribusi sangat diterima! Berikut cara berkontribusi:

1. **Fork repository**
2. **Create feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit changes**
   ```bash
   git commit -m "Add some AmazingFeature"
   ```
4. **Push to branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open Pull Request** di [GitHub](https://github.com/muris11/rfx_nextjs/pulls)

### Development Guidelines

- Gunakan **TypeScript** untuk semua file baru
- Follow **ESLint** rules
- Write **meaningful commit messages**
- Add **comments** untuk logic yang complex
- Update **documentation** jika perlu

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👥 Authors

<div align="center">

### 👨‍💻 **Rifqy Saputra**
*Creator & Lead Developer*

[![Portfolio](https://img.shields.io/badge/Portfolio-rifqysaputra.my.id-E50914?style=for-the-badge&logo=google-chrome&logoColor=white)](https://rifqysaputra.my.id)
[![GitHub](https://img.shields.io/badge/GitHub-muris11-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/muris11)
[![Instagram](https://img.shields.io/badge/Instagram-rfqy__sptr-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/rfqy_sptr)

</div>

| Platform | Link |
|----------|------|
| 🌐 **Portfolio** | [rifqysaputra.my.id](https://rifqysaputra.my.id) |
| 📸 **Instagram** | [@rfqy_sptr](https://instagram.com/rfqy_sptr) |
| 💻 **GitHub** | [@muris11](https://github.com/muris11) |
| 🎬 **RFX Live** | [rfx.based.my.id](https://rfx.based.my.id) |

---

## 🙏 Acknowledgments

- 👨‍💻 **Developer**: [Rifqy Saputra](https://rifqysaputra.my.id)
- 🎨 **Design Inspiration**: [Netflix](https://netflix.com)
- 🎯 **Icons**: [Lucide Icons](https://lucide.dev)
- ✨ **Fonts**: [Inter](https://rsms.me/inter/)
- 🔗 **API**: Sapimu & Sansekai

---

## 📞 Support

Butuh bantuan? Buka [issue](https://github.com/muris11/rfx_nextjs/issues) atau hubungi:

| Contact | Link |
|---------|------|
| 🌐 **Portfolio** | [rifqysaputra.my.id](https://rifqysaputra.my.id) |
| 📸 **Instagram** | [@rfqy_sptr](https://instagram.com/rfqy_sptr) |
| 💻 **GitHub** | [@muris11](https://github.com/muris11) |
| 🎬 **Live Demo** | [rfx.based.my.id](https://rfx.based.my.id) |

---

<div align="center">

**⭐ Star project ini jika kamu merasa terbantu!**

---

### Made with ❤️ by [Rifqy Saputra](https://rifqysaputra.my.id)

[![Portfolio](https://img.shields.io/badge/Portfolio-rifqysaputra.my.id-E50914?style=flat-square)](https://rifqysaputra.my.id)
[![Instagram](https://img.shields.io/badge/IG-@rfqy__sptr-E4405F?style=flat-square&logo=instagram)](https://instagram.com/rfqy_sptr)
[![GitHub](https://img.shields.io/badge/GitHub-@muris11-181717?style=flat-square&logo=github)](https://github.com/muris11)

[🌐 Visit Live Demo](https://rfx.based.my.id)

---

**© 2026 Rifqy Saputra. All rights reserved.**

</div>
