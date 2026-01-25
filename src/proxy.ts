import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COUNTRY_TO_LANG: Record<string, string> = {
  'ID': 'id',
  'US': 'en',
  'GB': 'en',
  'JP': 'ja',
  'CN': 'zh',
  'FR': 'fr',
  'DE': 'de',
  'ES': 'es',
  'RU': 'ru',
  'IT': 'it',
  'BR': 'pt',
  // Add more mappings as needed
};

export function proxy(request: NextRequest) {
  const country = (request as any).geo?.country || request.headers.get('x-vercel-ip-country') || 'US';
  const lang = COUNTRY_TO_LANG[country] || 'en';

  // Clone the request headers and set the wiki language
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-wiki-lang', lang);
  requestHeaders.set('x-user-country', country);

  // Return the response with the modified headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
