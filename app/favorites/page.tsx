'use client'

import { motion } from 'framer-motion'
import { Heart, Trash2, Play, BookOpen, Film, Tv } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useUserStore } from '@/lib/stores/userStore'
import { useState } from 'react'

type ContentType = 'all' | 'drama' | 'anime' | 'komik' | 'shorts'

const tabs: { id: ContentType; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'Semua', icon: <Heart className="w-4 h-4" /> },
  { id: 'drama', label: 'Drama', icon: <Tv className="w-4 h-4" /> },
  { id: 'anime', label: 'Anime', icon: <Film className="w-4 h-4" /> },
  { id: 'komik', label: 'Komik', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'shorts', label: 'Shorts', icon: <Play className="w-4 h-4" /> },
]

export default function FavoritesPage() {
  const { favorites, removeFavorite, clearFavorites } = useUserStore()
  const [activeTab, setActiveTab] = useState<ContentType>('all')

  const filteredFavorites = activeTab === 'all' 
    ? favorites 
    : favorites.filter(f => f.type === activeTab)

  const getContentLink = (item: typeof favorites[0]) => {
    switch (item.type) {
      case 'drama':
        return `/drama/${item.id}`
      case 'anime':
        return `/anime/${item.id}`
      case 'komik':
        return `/komik/${item.id}`
      case 'shorts':
        return `/shorts/${item.id}`
      default:
        return '/'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'drama': return 'bg-purple-500'
      case 'anime': return 'bg-blue-500'
      case 'komik': return 'bg-green-500'
      case 'shorts': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                Favorit Saya
              </h1>
              <p className="text-gray-400 mt-2">
                {favorites.length} konten tersimpan
              </p>
            </div>
            {favorites.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Hapus semua favorit?')) {
                    clearFavorites()
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Hapus Semua
              </button>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide"
        >
          {tabs.map((tab) => {
            const count = tab.id === 'all' 
              ? favorites.length 
              : favorites.filter(f => f.type === tab.id).length
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                {tab.icon}
                {tab.label}
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-white/10'
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </motion.div>

        {filteredFavorites.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <Heart className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Belum ada favorit</h2>
            <p className="text-gray-400 mb-6">
              Tambahkan konten favorit dengan menekan tombol hati
            </p>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/80 transition-colors"
            >
              Jelajahi Konten
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          >
            {filteredFavorites.map((item, index) => (
              <motion.div
                key={`${item.type}-${item.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative"
              >
                <Link href={getContentLink(item)}>
                  <div className="card-hover rounded-xl overflow-hidden">
                    <div className="relative aspect-[2/3]">
                      <Image
                        src={item.poster || '/placeholder.jpg'}
                        alt={item.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className={`absolute top-2 left-2 ${getTypeColor(item.type)} text-white text-xs px-2 py-1 rounded-full capitalize`}>
                        {item.type}
                      </div>
                      
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                          {item.type === 'komik' ? (
                            <BookOpen className="w-6 h-6 text-white" />
                          ) : (
                            <Play className="w-6 h-6 text-white fill-white" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-card">
                      <h3 className="font-medium text-sm line-clamp-2">{item.title}</h3>
                    </div>
                  </div>
                </Link>
                
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    removeFavorite(item.id)
                  }}
                  className="absolute top-2 right-2 p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
