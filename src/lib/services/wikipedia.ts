import { WikiArticle } from '@/types';

// Use backend proxy to avoid CORS issues and CORS/rate-limiting from client IP,
// and to enable caching.
export async function searchWikipedia(query: string, lang: string = 'en'): Promise<WikiArticle[]> {
  try {
      const res = await fetch(`/api/wiki/search?mode=search&query=${encodeURIComponent(query)}&lang=${lang}`);
      if (!res.ok) return [];
      return await res.json();
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
    try {
        const res = await fetch(`/api/wiki/search?mode=trending&lang=${lang}`);
        if (!res.ok) return [];
        return await res.json();
    } catch (error) {
        console.error('Trending topics fetch error:', error);
        return [];
    }
}
