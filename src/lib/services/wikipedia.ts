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

export async function getWikiPageHtml(title: string, lang: string = 'en'): Promise<string | null> {
  try {
      const url = `https://${lang}.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(title)}`;
      const res = await fetch(url);
      if (!res.ok) return null;
      return await res.text();
  } catch (error) {
      console.error('Wikipedia HTML fetch error:', error);
      return null;
  }
}
