import { WikiArticle } from '@/types';

const MAX_RESULTS = 10;

export async function searchWikipedia(query: string, lang: string = 'en'): Promise<WikiArticle[]> {
  try {
    // 1. Search for titles
    const searchUrl = `https://${lang}.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=${MAX_RESULTS}&namespace=0&format=json&origin=*`;

    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    // opensearch returns: [query, [titles], [descriptions], [links]]
    const titles = searchData[1] as string[];

    if (titles.length === 0) return [];

    // 2. Fetch details for each title
    const promises = titles.map(async (title) => {
        try {
            const summaryUrl = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
            const res = await fetch(summaryUrl);
            if (!res.ok) return null;
            const data = await res.json();

            // Transform to WikiArticle
            if (data.type === 'standard' || data.type === 'disambiguation') { // Filter out unwanted types if necessary
                return {
                    title: data.title,
                    extract: data.extract,
                    originalimage: data.originalimage,
                    content_urls: data.content_urls,
                    lang: lang
                } as WikiArticle;
            }
            return null;
        } catch (e) {
            console.error(`Failed to fetch details for ${title}`, e);
            return null;
        }
    });

    const results = await Promise.all(promises);
    return results.filter((item): item is WikiArticle => item !== null);

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
      const url = `https://${lang}.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(title)}`;
      const res = await fetch(url);
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
    if (!htmlCache.has(cacheKey)) {
        getWikiPageHtml(title, lang).catch(() => {});
    }
}

export interface TrendingTopic {
    title: string;
    views: string;
}

export async function getTrendingTopics(lang: string = 'en'): Promise<TrendingTopic[]> {
    // Use the "most read" endpoint from Wikipedia's REST API
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const year = yesterday.getFullYear();
    const month = String(yesterday.getMonth() + 1).padStart(2, '0');
    const day = String(yesterday.getDate()).padStart(2, '0');

    try {
        const url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/${lang}.wikipedia/all-access/${year}/${month}/${day}`;
        const res = await fetch(url);
        if (!res.ok) return [];
        const data = await res.json();

        // Filter out special pages and return top 5
        const articles = data.items?.[0]?.articles || [];
        return articles
            .filter((a: { article: string }) => !a.article.startsWith('Special:') && !a.article.startsWith('Main_Page') && !a.article.includes(':'))
            .slice(0, 5)
            .map((a: { article: string; views: number }) => ({
                title: a.article.replace(/_/g, ' '),
                views: a.views > 1000 ? `${(a.views / 1000).toFixed(1)}k` : String(a.views)
            }));
    } catch (error) {
        console.error('Trending topics fetch error:', error);
        return [];
    }
}
