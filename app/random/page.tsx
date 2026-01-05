'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Shuffle, Play, Heart, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useUserStore } from '@/lib/stores/userStore'

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

export default function RandomPage() {
  const [drama, setDrama] = useState<RandomDrama | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addFavorite, removeFavorite, isFavorite } = useUserStore()

  const fetchRandomDrama = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/sansekai/dramabox/randomdrama')
      const data = await response.json()
      
      if (data.result || data.data || data) {
        const result = data.result || data.data || data
        setDrama({
          id: result.id || result.bookId || result.drama_id || '',
          title: result.title || result.bookName || result.name || '',
          poster: result.poster || result.coverWap || result.cover || result.cover_url || '',
          cover: result.cover || result.coverWap || result.cover_horizontal || '',
          synopsis: result.synopsis || result.introduction || result.description || '',
          genre: result.genre || result.tags || result.categories || [],
          episodes: result.total_episodes || result.chapterCount || result.episode_count,
          rating: result.rating || result.score,
        })
      } else {
        setError('Data tidak ditemukan')
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
                  src={drama.cover || drama.poster}
                  alt={drama.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                
                <div className="absolute bottom-4 left-4 sm:left-8 flex gap-4 items-end">
                  <div className="relative w-28 sm:w-36 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
                    <Image
                      src={drama.poster}
                      alt={drama.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
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
