import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode'); // 'search' | 'trending'
    const query = searchParams.get('query');
    const lang = searchParams.get('lang') || 'en';

    if (mode === 'search') {
         if (!query) return NextResponse.json({ error: 'Missing query' }, { status: 400 });

         try {
             const searchUrl = `https://${lang}.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=10&namespace=0&format=json&origin=*`;
             const searchRes = await fetch(searchUrl);
             const searchData = await searchRes.json();
             const titles = searchData[1] as string[];

             if (titles.length === 0) return NextResponse.json([]);

             // Fetch details
             const promises = titles.map(async (title) => {
                 try {
                     const summaryUrl = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
                     const res = await fetch(summaryUrl);
                     if (!res.ok) return null;
                     const data = await res.json();

                     if (data.type === 'standard' || data.type === 'disambiguation') {
                        return {
                            title: data.title,
                            extract: data.extract,
                            originalimage: data.originalimage,
                            content_urls: data.content_urls,
                            lang: lang
                        };
                     }
                     return null;
                 } catch (e) {
                     return null;
                 }
             });

             const results = await Promise.all(promises);
             const cleanResults = results.filter(item => item !== null);

             // Cache search results for a short time
             return NextResponse.json(cleanResults, {
                 headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' }
             });

         } catch (e) {
             return NextResponse.json({ error: 'Search failed' }, { status: 500 });
         }

    } else if (mode === 'trending') {
         try {
             const today = new Date();
             const yesterday = new Date(today);
             yesterday.setDate(yesterday.getDate() - 1);
             let year = yesterday.getFullYear();
             let month = String(yesterday.getMonth() + 1).padStart(2, '0');
             let day = String(yesterday.getDate()).padStart(2, '0');

             let url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/${lang}.wikipedia/all-access/${year}/${month}/${day}`;
             let res = await fetch(url);

             // Fallback to 'en' if specific lang fails or if data not found (404)
             if (!res.ok || lang === 'en') {
                 year = today.getFullYear();
                 month = String(today.getMonth() + 1).padStart(2, '0');
                 day = String(today.getDate()).padStart(2, '0');
                 url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access/${year}/${month}/${day}`;
                 res = await fetch(url);
             }

             if (!res.ok) return NextResponse.json([]);

             const data = await res.json();
             const articles = data.items?.[0]?.articles || [];
             const results = articles
                 .filter((a: any) => !a.article.startsWith('Special:') && !a.article.startsWith('Main_Page') && !a.article.includes(':'))
                 .slice(0, 5)
                 .map((a: any) => ({
                     title: a.article.replace(/_/g, ' '),
                     views: a.views > 1000 ? `${(a.views / 1000).toFixed(1)}k` : String(a.views)
                 }));

              return NextResponse.json(results, {
                  headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7202' }
              });
          } catch (e) {
              return NextResponse.json([], { status: 500 });
          }
    }

    return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
}
