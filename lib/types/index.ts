export interface Drama {
  id: string;
  title: string;
  cover: string;
  description?: string;
  genre?: string[];
  rating?: number;
  episodes?: number;
  status?: string;
  year?: string;
}

export interface Episode {
  id: string;
  number: number;
  title?: string;
  thumbnail?: string;
  duration?: string;
  videoUrl?: string;
}

export interface Anime {
  id: string;
  title: string;
  cover: string;
  description?: string;
  genre?: string[];
  rating?: number;
  episodes?: number;
  status?: string;
  type?: string;
}

export interface Komik {
  id: string;
  title: string;
  cover: string;
  description?: string;
  genre?: string[];
  rating?: number;
  chapters?: number;
  status?: string;
  author?: string;
}

export interface Chapter {
  id: string;
  number: number;
  title?: string;
  images?: string[];
}

export interface Short {
  id: string;
  title: string;
  cover: string;
  videoUrl?: string;
  duration?: string;
}

export interface SearchResult {
  type: 'drama' | 'anime' | 'komik';
  id: string;
  title: string;
  cover: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  totalPages?: number;
  hasMore?: boolean;
}
