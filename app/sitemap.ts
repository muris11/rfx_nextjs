import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://rfx.based.my.id'
  
  // Static pages
  const staticPages = [
    '',
    '/drama',
    '/anime',
    '/komik',
    '/shorts',
    '/search',
    '/favorites',
    '/history',
    '/random',
    '/help',
    '/terms',
    '/privacy',
    '/cookies',
  ]

  const staticRoutes = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return staticRoutes
}
