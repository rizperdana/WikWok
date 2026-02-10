import { WikiArticle } from '@/types';

interface FetchOptions {
  retries?: number;
  retryDelay?: number;
  timeout?: number;
}

async function fetchWithRetry(
  url: string, 
  options: RequestInit & FetchOptions = {}
): Promise<Response> {
  const {
    retries = 3,
    retryDelay = 1000,
    timeout = 5000,
    ...fetchOptions
  } = options;

  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      }).finally(() => clearTimeout(timeoutId));

      return response;
    } catch (error: unknown) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Don't retry on abort errors or 4xx client errors
      if (lastError.name === 'AbortError' || 
          (lastError.name === 'TypeError' && attempt > 0)) {
        throw lastError;
      }

      // Log retry attempt
      if (attempt < retries) {
        console.warn(`Fetch attempt ${attempt + 1} failed, retrying in ${retryDelay}ms:`, lastError.message);
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
      }
    }
  }

  throw lastError || new Error('Unknown fetch error');
}

export async function fetchRandomArticle(lang: string): Promise<WikiArticle | null> {
  // Validate language parameter
  if (!lang || typeof lang !== 'string' || !/^[a-z]{2}(-[A-Z]{2})?$/.test(lang)) {
    console.error('Invalid language parameter:', lang);
    return null;
  }

  try {
    const res = await fetchWithRetry(
      `https://${lang}.wikipedia.org/api/rest_v1/page/random/summary`,
      {
        retries: 2,
        retryDelay: 500,
        timeout: 3000,
        cache: 'no-store',
        headers: {
          'User-Agent': 'Wikwok/1.0 (mailto:admin@wik-wok.vercel.app)',
          'Accept': 'application/json',
          'Origin': 'https://wik-wok.vercel.app'
        }
      }
    );

    if (!res.ok) {
      console.warn(`Wikipedia API returned ${res.status} for language: ${lang}`);
      return null;
    }

    // Check content type
    const contentType = res.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      console.warn('Wikipedia API returned non-JSON response:', contentType);
      return null;
    }

    const data = await res.json();

    // Validation Logic
    if (
      data.type === 'standard' &&
      data.originalimage &&
      data.extract &&
      data.extract.length >= (lang === 'en' ? 200 : 120)
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
  } catch (error: unknown) {
    // Handle different types of errors
    const errorObj = error instanceof Error ? error : new Error(String(error));
    
    if (errorObj.name === 'AbortError') {
      console.debug('Request timeout for language:', lang);
    } else if (errorObj.name === 'TypeError') {
      // Network errors (CORS, DNS, connection refused, etc.)
      console.error('Network error fetching wiki article:', errorObj.message);
    } else {
      console.error('Unexpected error fetching wiki article:', errorObj);
    }
    return null;
  }
}

export async function getFeedArticles(lang: string = 'en', count: number = 12): Promise<WikiArticle[]> {
  // Input validation
  if (!lang || typeof lang !== 'string') {
    console.error('Invalid language parameter in getFeedArticles:', lang);
    return [];
  }
  
  if (count <= 0 || count > 32) {
    console.error('Invalid count parameter in getFeedArticles:', count);
    return [];
  }

  const TARGET_COUNT = Math.min(count, 32);
  const validArticles: WikiArticle[] = [];
  const seenTitles = new Set<string>();
  
  // Aggressively fetch in larger concurrent batches to find quality articles faster
  // Since random articles often lack images/content, we over-fetch and filter.
  const BATCH_SIZE = 20; 
  const MAX_PARALLEL_BATCHES = 3;

  for (let i = 0; i < MAX_PARALLEL_BATCHES && validArticles.length < TARGET_COUNT; i++) {
    try {
      const promises = Array(BATCH_SIZE).fill(null).map(() => 
        fetchRandomArticle(lang).catch(error => {
          console.debug('Individual fetch failed in batch:', error);
          return null;
        })
      );
      
      const results = await Promise.allSettled(promises);

      for (const result of results) {
        if (result.status === 'fulfilled' && result.value) {
          const article = result.value;
          if (!seenTitles.has(article.title)) {
            seenTitles.add(article.title);
            validArticles.push(article);
          }
        }
        if (validArticles.length >= TARGET_COUNT) break;
      }
      
      // Early exit if we have enough to show something
      if (validArticles.length >= (count > 8 ? 8 : 4)) break;
      
    } catch (error) {
      console.error('Batch fetch failed:', error);
      // Continue to next batch even if current batch fails
      continue;
    }
  }

  console.debug(`Fetched ${validArticles.length} articles for language: ${lang}`);
  return validArticles.slice(0, TARGET_COUNT);
}
