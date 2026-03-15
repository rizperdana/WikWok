import { WikiArticle } from '@/types';

// Enhanced caching system
const searchCache = new Map<string, { data: WikiArticle[]; timestamp: number }>();
const trendingCache = new Map<string, { data: TrendingTopic[]; timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 15; // 15 minutes for search results
const TRENDING_CACHE_DURATION = 1000 * 60 * 5; // 5 minutes for trending

function getCachedData<T>(cache: Map<string, { data: T; timestamp: number }>, key: string, duration: number): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < duration) {
    return cached.data;
  }
  if (cached) {
    cache.delete(key);
  }
  return null;
}

function setCachedData<T>(cache: Map<string, { data: T; timestamp: number }>, key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// Use backend proxy to avoid CORS issues and CORS/rate-limiting from client IP,
// and to enable caching.
export async function searchWikipedia(query: string, lang: string = 'en'): Promise<WikiArticle[]> {
  const cacheKey = `${lang}:${query.toLowerCase()}`;

  // Check cache first
  const cached = getCachedData(searchCache, cacheKey, CACHE_DURATION);
  if (cached) return cached;

  try {
      const res = await fetch(`/api/wiki/search?mode=search&query=${encodeURIComponent(query)}&lang=${lang}`);
      if (!res.ok) return [];
      const data = await res.json();
      setCachedData(searchCache, cacheKey, data);
      return data;
  } catch (error) {
    console.error('Wikipedia search error:', error);
    return [];
  }
}

const htmlCache = new Map<string, string>();

export async function getWikiPageHtml(title: string, lang: string = 'en'): Promise<string | null> {
  const cacheKey = `${lang}:${title}`;
  if (htmlCache.has(cacheKey)) {
      return htmlCache.get(cacheKey)!;
  }

  try {
      // Call backend proxy for HTML
      const res = await fetch(`/api/wiki/page?title=${encodeURIComponent(title)}&lang=${lang}`);
      if (!res.ok) return null;
      const html = await res.text();
      htmlCache.set(cacheKey, html);
      return html;
  } catch (error) {
      console.error('Wikipedia HTML fetch error:', error);
      return null;
  }
}

export function prefetchWikiPageHtml(title: string, lang: string = 'en') {
    const cacheKey = `${lang}:${title}`;
    // Improved prefetching:
    // 1. Check memory cache first
    // 2. The Browser's fetch cache will handle the network deduping if we just call fetch again
    //    because our API returns strong Cache-Control headers.

    if (!htmlCache.has(cacheKey)) {
         getWikiPageHtml(title, lang).catch(() => {});
    }
}

export interface TrendingTopic {
    title: string;
    views: string;
}

export async function getTrendingTopics(lang: string = 'en'): Promise<TrendingTopic[]> {
  const cacheKey = `trending:${lang}`;

  // Check cache first
  const cached = getCachedData(trendingCache, cacheKey, TRENDING_CACHE_DURATION);
  if (cached) return cached;

  try {
      const res = await fetch(`/api/wiki/search?mode=trending&lang=${lang}`);
      if (!res.ok) return [];
      const data = await res.json();
      setCachedData(trendingCache, cacheKey, data);
      return data;
  } catch (error) {
      console.error('Trending topics fetch error:', error);
      return [];
  }
}
