import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title');
    const lang = searchParams.get('lang') || 'en';

    if (!title) {
        return NextResponse.json({ error: 'Missing title' }, { status: 400 });
    }

    try {
        const url = `https://${lang}.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(title)}`;
        const res = await fetch(url);

        if (!res.ok) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404 });
        }

        const html = await res.text();

        // Cache page HTML heavily - Wiki content is relatively static
        return new NextResponse(html, {
            headers: {
                'Content-Type': 'text/html',
                'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800', // Cache for 1 day, stale for 1 week
            }
        });

    } catch (e) {
        return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
    }
}
