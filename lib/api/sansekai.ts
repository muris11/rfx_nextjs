const BASE_URL = process.env.SANSEKAI_BASE_URL || 'https://api.sansekai.my.id/api';

async function fetchSansekai(endpoint: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Sansekai API error: ${response.status}`);
  }
  
  return response.json();
}

export const sansekaiApi = {
  // DramaBox
  dramabox: {
    getVip: () => fetchSansekai('/dramabox/vip'),
    
    getDubindo: (classify?: 'terpopuler' | 'terbaru', page = 1) => {
      let url = '/dramabox/dubindo';
      const params = new URLSearchParams();
      if (classify) params.append('classify', classify);
      if (page > 1) params.append('page', page.toString());
      if (params.toString()) url += `?${params.toString()}`;
      return fetchSansekai(url);
    },
    
    getRandomDrama: () => fetchSansekai('/dramabox/randomdrama'),
    
    getForYou: () => fetchSansekai('/dramabox/foryou'),
    
    getLatest: () => fetchSansekai('/dramabox/latest'),
    
    getTrending: () => fetchSansekai('/dramabox/trending'),
    
    getPopularSearch: () => fetchSansekai('/dramabox/populersearch'),
    
    search: (query: string) => 
      fetchSansekai(`/dramabox/search?query=${encodeURIComponent(query)}`),
    
    getDetail: (bookId: string) => 
      fetchSansekai(`/dramabox/detail?bookId=${bookId}`),
    
    getAllEpisode: (bookId: string) => 
      fetchSansekai(`/dramabox/allepisode?bookId=${bookId}`),
  },
  
  // NetShort
  netshort: {
    getTheaters: () => fetchSansekai('/netshort/theaters'),
    
    getForYou: (page = 1) => {
      let url = '/netshort/foryou';
      if (page > 1) url += `?page=${page}`;
      return fetchSansekai(url);
    },
    
    search: (query: string) => 
      fetchSansekai(`/netshort/search?query=${encodeURIComponent(query)}`),
    
    getAllEpisode: (shortPlayId: string) => 
      fetchSansekai(`/netshort/allepisode?shortPlayId=${shortPlayId}`),
  },
  
  // Melolo
  melolo: {
    getLatest: () => fetchSansekai('/melolo/latest'),
    
    getTrending: () => fetchSansekai('/melolo/trending'),
    
    search: (query: string, limit = 10, offset = 0) => 
      fetchSansekai(`/melolo/search?query=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`),
    
    getDetail: (bookId: string) => 
      fetchSansekai(`/melolo/detail?bookId=${bookId}`),
    
    getStream: (videoId: string) => 
      fetchSansekai(`/melolo/stream?videoId=${videoId}`),
  },
  
  // Anime
  anime: {
    getLatest: (page = 1) => {
      let url = '/anime/latest';
      if (page > 1) url += `?page=${page}`;
      return fetchSansekai(url);
    },
    
    search: (query: string) => 
      fetchSansekai(`/anime/search?query=${encodeURIComponent(query)}`),
    
    getDetail: (urlId: string) => 
      fetchSansekai(`/anime/detail?urlId=${urlId}`),
    
    getMovie: () => fetchSansekai('/anime/movie'),
    
    getVideo: (chapterUrlId: string, reso = '480p') => 
      fetchSansekai(`/anime/getvideo?chapterUrlId=${chapterUrlId}&reso=${reso}`),
  },
  
  // Komik
  komik: {
    getRecommended: (type: 'manhwa' | 'manhua' | 'manga') => 
      fetchSansekai(`/komik/recommended?type=${type}`),
    
    getLatest: (type: 'project' | 'mirror') => 
      fetchSansekai(`/komik/latest?type=${type}`),
    
    search: (query: string) => 
      fetchSansekai(`/komik/search?query=${encodeURIComponent(query)}`),
    
    getPopular: (page = 1) => {
      let url = '/komik/popular';
      if (page > 1) url += `?page=${page}`;
      return fetchSansekai(url);
    },
    
    getDetail: (mangaId: string) => 
      fetchSansekai(`/komik/detail?manga_id=${mangaId}`),
    
    getChapterList: (mangaId: string) => 
      fetchSansekai(`/komik/chapterlist?manga_id=${mangaId}`),
    
    getImage: (chapterId: string) => 
      fetchSansekai(`/komik/getimage?chapter_id=${chapterId}`),
  },
};

export default sansekaiApi;
