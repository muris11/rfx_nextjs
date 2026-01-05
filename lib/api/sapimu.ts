const BASE_URL = process.env.SAPIMU_BASE_URL || 'https://sapimu.au';
const TOKEN = process.env.SAPIMU_API_TOKEN || '';

async function fetchSapimu(endpoint: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Sapimu API error: ${response.status}`);
  }
  
  return response.json();
}

export const sapimuApi = {
  // DramaBox
  dramabox: {
    getForYou: (page = 1, lang = 'in') => 
      fetchSapimu(`/dramabox/api/foryou/${page}?lang=${lang}`),
    
    getNew: (page = 1, lang = 'in', pageSize = 20) => 
      fetchSapimu(`/dramabox/api/new/${page}?lang=${lang}&pageSize=${pageSize}`),
    
    getRank: (page = 1, lang = 'in') => 
      fetchSapimu(`/dramabox/api/rank/${page}?lang=${lang}`),
    
    getClassify: (genre: string, page = 1, sort = 1, lang = 'in') => 
      fetchSapimu(`/dramabox/api/classify?lang=${lang}&pageNo=${page}&genre=${genre}&sort=${sort}`),
    
    search: (query: string, page = 1, lang = 'in') => 
      fetchSapimu(`/dramabox/api/search/${encodeURIComponent(query)}/${page}?lang=${lang}`),
    
    getSuggest: (query: string, lang = 'in') => 
      fetchSapimu(`/dramabox/api/suggest/${encodeURIComponent(query)}?lang=${lang}`),
    
    getChapters: (id: string, lang = 'in') => 
      fetchSapimu(`/dramabox/api/chapters/${id}?lang=${lang}`),
    
    getChaptersDetail: (id: string, lang = 'in') => 
      fetchSapimu(`/dramabox/api/chapters/detail/${id}?lang=${lang}`),
    
    watch: (id: string, episode: number, lang = 'in') => 
      fetchSapimu(`/dramabox/api/watch/${id}/${episode}?lang=${lang}&source=search_result`),
  },
  
  // Melolo
  melolo: {
    search: (query: string) => 
      fetchSapimu(`/melolo/search?query=${encodeURIComponent(query)}`),
    
    getSeries: (seriesId: string) => 
      fetchSapimu(`/melolo/series?series_id=${seriesId}`),
    
    getVideo: (videoId: string) => 
      fetchSapimu(`/melolo/video?video_id=${videoId}`),
    
    getBookmall: () => 
      fetchSapimu(`/melolo/bookmall`),
  },
  
  // StarShort
  starshort: {
    getLanguages: () => 
      fetchSapimu(`/starshort/api/v1/languages`),
    
    getDramas: (lang = 3) => 
      fetchSapimu(`/starshort/api/v1/dramas?lang=${lang}`),
    
    getNew: (lang = 3) => 
      fetchSapimu(`/starshort/api/v1/dramas/new?lang=${lang}`),
    
    getRising: (lang = 3) => 
      fetchSapimu(`/starshort/api/v1/dramas/rising?lang=${lang}`),
    
    getRecommended: (lang = 3) => 
      fetchSapimu(`/starshort/api/v1/dramas/recommended?lang=${lang}`),
    
    search: (query: string, lang = 3) => 
      fetchSapimu(`/starshort/api/v1/dramas/search?q=${encodeURIComponent(query)}&lang=${lang}`),
    
    getTabs: (lang = 3) => 
      fetchSapimu(`/starshort/api/v1/tabs?lang=${lang}`),
    
    getDetail: (id: string, lang = 3) => 
      fetchSapimu(`/starshort/api/v1/dramas/${id}?lang=${lang}`),
    
    getEpisodes: (id: string, lang = 3) => 
      fetchSapimu(`/starshort/api/v1/dramas/${id}/episodes?lang=${lang}`),
    
    getVideo: (id: string, ep: number, lang = 3) => 
      fetchSapimu(`/starshort/api/v1/dramas/${id}/episodes/${ep}?lang=${lang}`),
  },
  
  // ShortMax
  shortmax: {
    getLanguages: () => 
      fetchSapimu(`/shortmax/api/v1/languages`),
    
    getHome: (lang = 'en') => 
      fetchSapimu(`/shortmax/api/v1/home?lang=${lang}`),
    
    search: (query: string, lang = 'en') => 
      fetchSapimu(`/shortmax/api/v1/search?q=${encodeURIComponent(query)}&lang=${lang}`),
    
    getEpisodes: (id: string, lang = 'en') => 
      fetchSapimu(`/shortmax/api/v1/episodes/${id}?lang=${lang}`),
    
    play: (id: string, ep: number, lang = 'en') => 
      fetchSapimu(`/shortmax/api/v1/play/${id}?lang=${lang}&ep=${ep}`),
  },
  
  // FlickReels
  flickreels: {
    getInfo: (lang = 'in') => 
      fetchSapimu(`/flickreels/api/v1?lang=${lang}`),
    
    search: (query: string, lang = 'id') => 
      fetchSapimu(`/flickreels/api/v1/search?q=${encodeURIComponent(query)}&lang=${lang}`),
    
    getForYou: (lang = 'id') => 
      fetchSapimu(`/flickreels/api/v1/for-you?lang=${lang}`),
    
    getHotRank: (lang = 'id') => 
      fetchSapimu(`/flickreels/api/v1/hot-rank?lang=${lang}`),
    
    getChapters: (id: string, lang = 'id') => 
      fetchSapimu(`/flickreels/api/v1/chapters/${id}?lang=${lang}`),
    
    stream: (id: string, ep: number, lang = 'in') => 
      fetchSapimu(`/flickreels/api/v1/stream/${id}/${ep}?lang=${lang}`),
    
    download: (id: string, ep: number, lang = 'in') => 
      fetchSapimu(`/flickreels/api/v2/download/${id}/${ep}?lang=${lang}`),
  },
  
  // HiShort
  hishort: {
    getHome: (lang = 'in') => 
      fetchSapimu(`/hishort/api/home?lang=${lang}`),
    
    search: (query: string, lang = 'in') => 
      fetchSapimu(`/hishort/api/search/${encodeURIComponent(query)}?lang=${lang}`),
    
    getDrama: (id: string, lang = 'in') => 
      fetchSapimu(`/hishort/api/drama/${id}?lang=${lang}`),
    
    getEpisode: (id: string, lang = 'in') => 
      fetchSapimu(`/hishort/api/episode/${id}?lang=${lang}`),
    
    health: (lang = 'in') => 
      fetchSapimu(`/hishort/health?lang=${lang}`),
  },
  
  // DramaWave
  dramawave: {
    getLanguages: () => 
      fetchSapimu(`/dramawave/api/v1/languages`),
    
    getSearchHot: (lang = 'id-ID') => 
      fetchSapimu(`/dramawave/api/v1/search/hot?lang=${lang}`),
    
    search: (query: string, lang = 'id-ID') => 
      fetchSapimu(`/dramawave/api/v1/search?q=${encodeURIComponent(query)}&lang=${lang}`),
    
    getPopular: (page = 1, lang = 'id-ID') => 
      fetchSapimu(`/dramawave/api/v1/feed/popular?page=${page}&lang=${lang}`),
    
    getNew: (page = 1, lang = 'id-ID') => 
      fetchSapimu(`/dramawave/api/v1/feed/new?page=${page}&lang=${lang}`),
    
    getFree: (page = 1, lang = 'id-ID') => 
      fetchSapimu(`/dramawave/api/v1/feed/free?page=${page}&lang=${lang}`),
    
    getVip: (page = 1, lang = 'id-ID') => 
      fetchSapimu(`/dramawave/api/v1/feed/vip?page=${page}&lang=${lang}`),
    
    getExclusive: (page = 1, lang = 'id-ID') => 
      fetchSapimu(`/dramawave/api/v1/feed/exclusive?page=${page}&lang=${lang}`),
    
    getDubbing: (page = 1, lang = 'id-ID') => 
      fetchSapimu(`/dramawave/api/v1/feed/dubbing?page=${page}&lang=${lang}`),
    
    getMale: (page = 1, lang = 'id-ID') => 
      fetchSapimu(`/dramawave/api/v1/feed/male?page=${page}&lang=${lang}`),
    
    getFemale: (page = 1, lang = 'id-ID') => 
      fetchSapimu(`/dramawave/api/v1/feed/female?page=${page}&lang=${lang}`),
    
    getComingSoon: (page = 1, lang = 'id-ID') => 
      fetchSapimu(`/dramawave/api/v1/feed/coming-soon?page=${page}&lang=${lang}`),
    
    getDrama: (id: string, lang = 'id-ID') => 
      fetchSapimu(`/dramawave/api/v1/dramas/${id}?lang=${lang}`),
    
    getEpisode: (id: string, ep: number, lang = 'id-ID') => 
      fetchSapimu(`/dramawave/api/v1/dramas/${id}/episodes/${ep}?lang=${lang}`),
    
    play: (id: string, ep: number, lang = 'id-ID') => 
      fetchSapimu(`/dramawave/api/v1/dramas/${id}/play/${ep}?lang=${lang}`),
    
    parseVideo: (url: string) => 
      fetchSapimu(`/dramawave/api/v1/video/parse?url=${encodeURIComponent(url)}`),
  },
  
  // NetShort (Sapimu version)
  netshort: {
    getLanguages: () => 
      fetchSapimu(`/netshort/api/languages`),
    
    getTabs: (lang = 'id_ID') => 
      fetchSapimu(`/netshort/api/tabs?lang=${lang}`),
    
    getHome: (tabId: string, limit = 10, lang = 'id_ID') => 
      fetchSapimu(`/netshort/api/get-home?tabId=${tabId}&limit=${limit}&lang=${lang}`),
    
    getRecommend: (limit = 10, lang = 'id_ID') => 
      fetchSapimu(`/netshort/api/recommend?limit=${limit}&lang=${lang}`),
    
    getMember: (limit = 10, lang = 'id_ID') => 
      fetchSapimu(`/netshort/api/member?limit=${limit}&lang=${lang}`),
    
    search: (keyword: string, limit = 20, lang = 'id_ID') => 
      fetchSapimu(`/netshort/api/search?keyword=${encodeURIComponent(keyword)}&limit=${limit}&lang=${lang}`),
    
    getSearchRecommend: (lang = 'id_ID') => 
      fetchSapimu(`/netshort/api/search/recommend?lang=${lang}`),
    
    getEpisodes: (seriesId: string) => 
      fetchSapimu(`/netshort/api/getepisode/${seriesId}`),
    
    getVideo: (seriesId: string, episodeId: string, episodeNo: number) => 
      fetchSapimu(`/netshort/api/getepisode/${seriesId}/${episodeId}?episodeNo=${episodeNo}`),
  },
};

export default sapimuApi;
