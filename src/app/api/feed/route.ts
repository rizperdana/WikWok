import { NextResponse } from 'next/server';
import { getFeedArticles } from '@/lib/api/feed';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || request.headers.get('x-wiki-lang') || 'en';
  const limitParam = searchParams.get('limit');
  const count = limitParam ? parseInt(limitParam) : 5;

  const validArticles = await getFeedArticles(lang, count);

  return NextResponse.json(validArticles);
}
