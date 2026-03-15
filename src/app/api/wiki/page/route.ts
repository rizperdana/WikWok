import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title');
    const url = searchParams.get('url'); // Can pass full URL directly
    let lang = searchParams.get('lang') || 'en';

    if (!title && !url) {
        return NextResponse.json({ error: 'Missing title or url' }, { status: 400 });
    }

    try {
        let targetUrl: string;
        
        if (url) {
            // Use URL directly - extract lang from it
            targetUrl = url;
            // Try to extract language from URL (e.g., https://id.wikipedia.org/...)
            const langMatch = url.match(/https?:\/\/([a-z]{2})\.wikipedia\.org/);
            if (langMatch) {
                lang = langMatch[1];
            }
            // Convert to HTML API URL
            const articleTitle = url.split('/wiki/').pop();
            targetUrl = `https://${lang}.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(articleTitle || '')}`;
        } else {
            targetUrl = `https://${lang}.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(title!)}`;
        }
        
        const res = await fetch(targetUrl);

        if (!res.ok) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404 });
        }

        const html = await res.text();

        return new NextResponse(html, {
            headers: {
                'Content-Type': 'text/html',
                'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
            }
        });

    } catch (e) {
        return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
    }
}
