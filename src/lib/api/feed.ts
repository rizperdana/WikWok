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

export async function getFeedArticles(lang: string = 'en', count: number = 5): Promise<WikiArticle[]> {
  const TARGET_COUNT = Math.min(count, 20); // Cap at 20

  console.log(`[Lib] Fetching feed for lang: ${lang}, target: ${TARGET_COUNT}`);

  const validArticles: WikiArticle[] = [];
  const MAX_ATTEMPTS = TARGET_COUNT * 4;

  let attempts = 0;
  const seenTitles = new Set<string>();

  while (validArticles.length < TARGET_COUNT && attempts < MAX_ATTEMPTS) {
    const remaining = TARGET_COUNT - validArticles.length;
    const batchSize = Math.min(Math.max(remaining, 3), 5);

    const promises = Array(batchSize).fill(null).map(() => fetchRandomArticle(lang));
    const results = await Promise.all(promises);

    for (const article of results) {
        if (article) {
             if (!seenTitles.has(article.title)) {
                seenTitles.add(article.title);
                validArticles.push(article);
            }
        }
    }

    // Aggressive speed optimization: For initial load (limit <= 2),
    // if we have AT LEAST 1 article, return immediately to unblock user.
    if (count <= 2 && validArticles.length >= 1) {
        break;
    }

    attempts += batchSize;
  }

  return validArticles;
}
