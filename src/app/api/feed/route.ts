import { NextResponse } from 'next/server';
import { getFeedArticles } from '@/lib/api/feed';
import { DEFAULT_LANG } from '@/lib/constants/languages';

// In-memory cache for feed responses
const feedCache = new Map<string, { data: any[]; timestamp: number }>();
const FEED_CACHE_DURATION = 1000 * 60 * 10; // 10 minutes

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || request.headers.get('x-wiki-lang') || DEFAULT_LANG;
  const limitParam = searchParams.get('limit');
  const pageParam = searchParams.get('page') || '0';
  const count = limitParam ? parseInt(limitParam) : 8;
  // Include page in cache key so each page gets different results
  const cacheKey = `${lang}:${pageParam}:${count}`;

  // Check cache first
  const cached = feedCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < FEED_CACHE_DURATION) {
    return NextResponse.json(cached.data);
  }

  const validArticles = await getFeedArticles(lang, count);

  // Cache the result
  feedCache.set(cacheKey, { data: validArticles, timestamp: Date.now() });

  return NextResponse.json(validArticles);
}
