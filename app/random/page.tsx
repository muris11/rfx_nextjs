'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Shuffle, Play, Heart, ArrowRight, Film } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useUserStore } from '@/lib/stores/userStore'

const PLACEHOLDER_COVER = '/placeholder-cover.svg'

interface DramaItem {
  bookId?: string
  id?: string
  bookName?: string
  title?: string
  coverWap?: string
  cover?: string
  introduction?: string
  synopsis?: string
  score?: number
  rating?: number
  chapterCount?: number
  episodes?: number
  tags?: string[]
  genre?: string[]
}

interface RandomDrama {
  id: string
  title: string
  poster: string
  cover?: string
  synopsis?: string
  genre?: string[]
  episodes?: number
  rating?: number
}

function extractItems(data: unknown): DramaItem[] {
  if (!data) return []
  if (Array.isArray(data)) return data
  if (typeof data === 'object' && data !== null) {
    const obj = data as Record<string, unknown>
    if (Array.isArray(obj.list)) return obj.list as DramaItem[]
    if (Array.isArray(obj.data)) return obj.data as DramaItem[]
    if (Array.isArray(obj.result)) return obj.result as DramaItem[]
    if (obj.data && typeof obj.data === 'object') {
      const inner = obj.data as Record<string, unknown>
      if (Array.isArray(inner.list)) return inner.list as DramaItem[]
    }
  }
  return []
}

export default function RandomPage() {
  const [drama, setDrama] = useState<RandomDrama | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addFavorite, removeFavorite, isFavorite } = useUserStore()

  const fetchRandomDrama = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch from multiple endpoints to get a pool of dramas
      const endpoints = [
        '/api/sansekai/dramabox/trending',
        '/api/sansekai/dramabox/foryou',
        '/api/sansekai/dramabox/latest',
        '/api/sapimu/dramabox/api/foryou/1?lang=in',
        '/api/sapimu/dramabox/api/rank/1?lang=in',
      ]
      
      const allItems: DramaItem[] = []
      const seenIds = new Set<string>()
      
      // Fetch all endpoints in parallel
      const results = await Promise.all(
        endpoints.map(async (endpoint) => {
          try {
            const res = await fetch(endpoint)
            if (res.ok) return res.json()
          } catch {}
          return null
        })
      )
      
      // Extract and deduplicate items
      results.forEach((data) => {
        const items = extractItems(data)
        items.forEach((item) => {
          const id = item.bookId || item.id || ''
          const poster = item.coverWap || item.cover || ''
          // Only add items with valid id and poster
          if (id && poster && !seenIds.has(id)) {
            seenIds.add(id)
            allItems.push(item)
          }
        })
      })
      
      if (allItems.length > 0) {
        // Pick a random drama
        const randomIndex = Math.floor(Math.random() * allItems.length)
        const result = allItems[randomIndex]
        
        setDrama({
          id: result.bookId || result.id || '',
          title: result.bookName || result.title || 'Unknown Title',
          poster: result.coverWap || result.cover || '',
          cover: result.cover || result.coverWap || '',
          synopsis: result.introduction || result.synopsis || '',
          genre: result.tags || result.genre || [],
          episodes: result.chapterCount || result.episodes,
          rating: result.score || result.rating,
        })
      } else {
        setError('Tidak ada drama ditemukan. Coba lagi nanti.')
      }
    } catch (err) {
      console.error('Error fetching random drama:', err)
      setError('Gagal memuat drama acak')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRandomDrama()
  }, [fetchRandomDrama])

  const toggleFavorite = () => {
    if (!drama) return
    
    if (isFavorite(drama.id)) {
      removeFavorite(drama.id)
    } else {
      addFavorite({
        id: drama.id,
        title: drama.title,
        poster: drama.poster,
        type: 'drama'
      })
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
            <Shuffle className="w-8 h-8 text-primary" />
            Random Drama
          </h1>
          <p className="text-gray-400 mt-2">
            Bingung mau nonton apa? Biarkan kami pilihkan untuk Anda!
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {loading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-400">Mencari drama untuk Anda...</p>
            </motion.div>
          ) : error ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={fetchRandomDrama}
                className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/80 transition-colors"
              >
                Coba Lagi
              </button>
            </motion.div>
          ) : drama ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card rounded-2xl overflow-hidden"
            >
              <div className="relative h-64 sm:h-80">
                <Image
                  src={(drama.cover || drama.poster) || PLACEHOLDER_COVER}
                  alt={drama.title || 'Random Drama'}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                
                <div className="absolute bottom-4 left-4 sm:left-8 flex gap-4 items-end">
                  <div className="relative w-28 sm:w-36 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl bg-gray-800">
                    {drama.poster ? (
                      <Image
                        src={drama.poster}
                        alt={drama.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
                        <Film className="w-12 h-12 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="pb-2">
                    <h2 className="text-2xl sm:text-3xl font-bold">{drama.title}</h2>
                    {drama.rating && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-yellow-500">★</span>
                        <span>{drama.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                {drama.genre && drama.genre.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {drama.genre.slice(0, 5).map((g, i) => (
                      <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-sm">
                        {g}
                      </span>
                    ))}
                  </div>
                )}

                {drama.episodes && (
                  <p className="text-gray-400 mb-4">
                    {drama.episodes} Episode
                  </p>
                )}

                {drama.synopsis && (
                  <p className="text-gray-300 leading-relaxed mb-6 line-clamp-4">
                    {drama.synopsis}
                  </p>
                )}

                <div className="flex flex-wrap gap-4">
                  <Link
                    href={`/drama/${drama.id}`}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-primary text-white rounded-full hover:bg-primary/80 transition-colors"
                  >
                    <Play className="w-5 h-5 fill-white" />
                    Tonton Sekarang
                  </Link>
                  
                  <button
                    onClick={toggleFavorite}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full transition-colors ${
                      isFavorite(drama.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite(drama.id) ? 'fill-white' : ''}`} />
                    {isFavorite(drama.id) ? 'Favorit' : 'Tambah Favorit'}
                  </button>
                </div>
              </div>
            </motion.div>
          ) : null}

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-8"
          >
            <button
              onClick={fetchRandomDrama}
              disabled={loading}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Shuffle className={`w-5 h-5 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              Acak Lagi
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
