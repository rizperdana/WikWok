import { WikiArticle } from '@/types';

export async function fetchRandomArticle(lang: string): Promise<WikiArticle | null> {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 2000); // 2s soft timeout

    // Add error handling for fetch
    const res = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/random/summary`, {
      signal: controller.signal,
      cache: 'no-store', // Always fresh for random
      headers: {
        'User-Agent': 'Wikwok/1.0 (mailto:admin@wik-wok.vercel.app)',
        'Origin': 'https://wik-wok.vercel.app'
      }
    }).finally(() => clearTimeout(id));

    if (!res.ok) return null;

    const data = await res.json();

    // Validation Logic
    if (
      data.type === 'standard' &&
      data.originalimage &&
      data.extract &&
      data.extract.length >= (lang === 'en' ? 200 : 120) // More lenient for other languages
    ) {
      return {
        title: data.title,
        extract: data.extract,
        originalimage: data.originalimage,
        content_urls: data.content_urls,
        lang: lang
      };
    }
    return null;
  } catch (error: any) {
    if (error.name === 'AbortError') {
        // Expected timeout for speed optimization
        return null;
    }
    console.error('Error fetching wiki article:', error);
    return null;
  }
}

export async function getFeedArticles(lang: string = 'en', count: number = 12): Promise<WikiArticle[]> {
  const TARGET_COUNT = Math.min(count, 32);
  const validArticles: WikiArticle[] = [];
  const seenTitles = new Set<string>();
  
  // Aggressively fetch in larger concurrent batches to find quality articles faster
  // Since random articles often lack images/content, we over-fetch and filter.
  const BATCH_SIZE = 20; 
  const MAX_PARALLEL_BATCHES = 3;

  for (let i = 0; i < MAX_PARALLEL_BATCHES && validArticles.length < TARGET_COUNT; i++) {
    const promises = Array(BATCH_SIZE).fill(null).map(() => fetchRandomArticle(lang));
    const results = await Promise.all(promises);

    for (const article of results) {
      if (article && !seenTitles.has(article.title)) {
        seenTitles.add(article.title);
        validArticles.push(article);
      }
      if (validArticles.length >= TARGET_COUNT) break;
    }
    
    // Early exit if we have enough to show something
    if (validArticles.length >= (count > 8 ? 8 : 4)) break;
  }

  return validArticles.slice(0, TARGET_COUNT);
}
