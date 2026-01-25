import { NextResponse } from 'next/server';
import { WikiArticle } from '@/types';

export const dynamic = 'force-dynamic';

async function fetchRandomArticle(lang: string): Promise<WikiArticle | null> {
  try {
    const res = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/random/summary`, {
      cache: 'no-store', // Always fresh for random
      headers: {
        'User-Agent': 'Wikwok/1.0 (mailto:admin@wikwok.app)',
        'Origin': 'https://wikwok.app'
      }
    });

    if (!res.ok) return null;

    const data = await res.json();

    // Validation Logic
    if (
      data.type === 'standard' &&
      data.originalimage &&
      data.extract &&
      data.extract.length >= 200
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
  } catch (error) {
    console.error('Error fetching wiki article:', error);
    return null;
  }
}

export async function GET(request: Request) {
  const lang = request.headers.get('x-wiki-lang') || 'en';
  const validArticles: WikiArticle[] = [];
  const TARGET_COUNT = 10;
  const MAX_ATTEMPTS = 30; // Safety brake

  let attempts = 0;

  // Parallel fetching optimization could be used here, but for simplicity and rate limiting respect,
  // we might want batches. However, checking "validity" requires the response.
  // Let's do batches of 5 parallel requests.

  while (validArticles.length < TARGET_COUNT && attempts < MAX_ATTEMPTS) {
    const batchSize = 5;
    const promises = Array(batchSize).fill(null).map(() => fetchRandomArticle(lang));
    const results = await Promise.all(promises);

    results.forEach(article => {
      if (article && validArticles.length < TARGET_COUNT) {
        // Dedup check logic could go here if needed
        validArticles.push(article);
      }
    });

    attempts += batchSize;
  }

  return NextResponse.json(validArticles);
}
