'use client'

import { motion } from 'framer-motion'
import { History, Trash2, Play, Clock, BookOpen } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useUserStore } from '@/lib/stores/userStore'

function formatDistanceToNow(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'Baru saja'
  if (minutes < 60) return `${minutes} menit lalu`
  if (hours < 24) return `${hours} jam lalu`
  if (days < 7) return `${days} hari lalu`
  return new Date(timestamp).toLocaleDateString('id-ID')
}

export default function HistoryPage() {
  const { watchHistory, removeFromHistory, clearHistory } = useUserStore()

  const sortedHistory = [...watchHistory].sort((a, b) => b.timestamp - a.timestamp)

  const getWatchLink = (item: typeof watchHistory[0]) => {
    switch (item.type) {
      case 'drama':
        return `/drama/${item.id}/watch/${item.episodeId || 1}`
      case 'anime':
        return `/anime/${item.id}/watch`
      case 'komik':
        return `/komik/${item.id}/read/${item.episodeId || 1}`
      case 'shorts':
        return `/shorts/${item.id}`
      default:
        return '/'
    }
  }

  const formatProgress = (progress: number, duration: number) => {
    if (!duration) return '0%'
    const percentage = Math.round((progress / duration) * 100)
    return `${percentage}%`
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
                <History className="w-8 h-8 text-primary" />
                Riwayat Tonton
              </h1>
              <p className="text-gray-400 mt-2">
                {watchHistory.length} konten ditonton
              </p>
            </div>
            {watchHistory.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Hapus semua riwayat?')) {
                    clearHistory()
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

        {sortedHistory.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <History className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Belum ada riwayat</h2>
            <p className="text-gray-400 mb-6">
              Mulai menonton untuk melihat riwayat di sini
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
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {sortedHistory.map((item, index) => (
              <motion.div
                key={`${item.type}-${item.id}-${item.episodeId}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative bg-card rounded-xl overflow-hidden hover:bg-white/5 transition-colors"
              >
                <Link href={getWatchLink(item)} className="flex gap-4 p-4">
                  <div className="relative w-32 sm:w-40 aspect-video rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.poster || '/placeholder.jpg'}
                      alt={item.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    {item.duration > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                        <div 
                          className="h-full bg-primary"
                          style={{ width: formatProgress(item.progress, item.duration) }}
                        />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.type === 'komik' ? (
                        <BookOpen className="w-8 h-8 text-white" />
                      ) : (
                        <Play className="w-8 h-8 text-white fill-white" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg line-clamp-1">{item.title}</h3>
                    {item.episodeTitle && (
                      <p className="text-gray-400 text-sm line-clamp-1 mt-1">
                        {item.episodeTitle}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDistanceToNow(item.timestamp)}
                      </span>
                      {item.duration > 0 && (
                        <span>
                          {formatProgress(item.progress, item.duration)} ditonton
                        </span>
                      )}
                    </div>
                    <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full capitalize ${
                      item.type === 'drama' ? 'bg-purple-500/20 text-purple-400' :
                      item.type === 'anime' ? 'bg-blue-500/20 text-blue-400' :
                      item.type === 'komik' ? 'bg-green-500/20 text-green-400' :
                      'bg-orange-500/20 text-orange-400'
                    }`}>
                      {item.type}
                    </span>
                  </div>
                </Link>
                
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    removeFromHistory(item.id, item.episodeId)
                  }}
                  className="absolute top-4 right-4 p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
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
