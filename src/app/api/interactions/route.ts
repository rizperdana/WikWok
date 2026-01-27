import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'like' or 'bookmark'
    const articleUrl = searchParams.get('url');

    if (!type || !articleUrl) {
        return NextResponse.json({ error: 'Missing params' }, { status: 400 });
    }

    const authHeader = request.headers.get('Authorization');
    // For "stats", we don't strictly need auth, but it helps for "isLiked" etc.
    const supabase = createServerClient();
    let user = null;

    if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        const { data } = await supabase.auth.getUser(token);
        user = data.user;
    }

    if (type === 'stats') {
        // Fetch all counts in parallel
        const [likes, bookmarks, comments, shares] = await Promise.all([
            supabase.from('likes').select('*', { count: 'exact', head: true }).eq('article_url', articleUrl),
            supabase.from('bookmarks').select('*', { count: 'exact', head: true }).eq('article_url', articleUrl),
            supabase.from('comments').select('*', { count: 'exact', head: true }).eq('article_url', articleUrl),
            supabase.from('shares').select('*', { count: 'exact', head: true }).eq('article_url', articleUrl)
        ]);

        // If user is logged in, check if THEY interacted
        let userStatus = { liked: false, bookmarked: false };
        if (user) {
             const [likeStatus, bookmarkStatus] = await Promise.all([
                supabase.from('likes').select('id').eq('user_id', user.id).eq('article_url', articleUrl).single(),
                supabase.from('bookmarks').select('id').eq('user_id', user.id).eq('article_url', articleUrl).single()
            ]);
            userStatus.liked = !!likeStatus.data;
            userStatus.bookmarked = !!bookmarkStatus.data;
        }

        return NextResponse.json({
            counts: {
                likes: likes.count || 0,
                bookmarks: bookmarks.count || 0,
                comments: comments.count || 0,
                shares: shares.count || 0
            },
            userStatus
        });
    }


    if (!user && (type === 'like' || type === 'bookmark')) {
        return NextResponse.json({ isInteraction: false, count: 0 });
    }

    const table = type === 'like' ? 'likes' : (type === 'bookmark' ? 'bookmarks' : 'shares');

    // Check interaction
    if (type === 'share') {
         // Shares are append-only usually, just return count
         const { count } = await supabase.from('shares').select('*', { count: 'exact', head: true }).eq('article_url', articleUrl);
         return NextResponse.json({ isInteraction: false, count: count || 0 });
    }

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data } = await supabase
        .from(table)
        .select('id')
        .eq('user_id', user.id)
        .eq('article_url', articleUrl)
        .single();

    // Get Count
    const { count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
        .eq('article_url', articleUrl);

    return NextResponse.json({ isInteraction: !!data, count: count || 0 });
}

export async function POST(request: Request) {
    const body = await request.json();
    const { type, article_url, payload } = body;

    // Auth check for most actions, but allow anonymous 'share' logging if desired?
    // User requested "persist", so we probably want valid tracking.
    // Let's allow anonymous shares but require auth for rest.

    const authHeader = request.headers.get('Authorization');
    const supabase = createServerClient();
    let user = null;

    if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        const { data } = await supabase.auth.getUser(token);
        user = data.user;
    }

    if (!user && type !== 'share') {
         // Allow share without user
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!article_url && !payload?.comment_id) {
         return NextResponse.json({ error: 'Missing target' }, { status: 400 });
    }

    if (type === 'share') {
        await supabase.from('shares').insert({
            user_id: user?.id || null, // Allow null for anon shares
            article_url,
            platform: payload?.platform || 'generic'
        });
        return NextResponse.json({ success: true });
    }

    let table = '';
    let matchQuery: any = { user_id: user!.id };

    if (type === 'like') {
        table = 'likes';
        matchQuery.article_url = article_url;
    } else if (type === 'bookmark') {
        table = 'bookmarks';
        matchQuery.article_url = article_url;
    } else if (type === 'comment_like') {
        table = 'comment_likes';
        matchQuery.comment_id = payload.comment_id;
    }

    // Check existing
    const { data: existing } = await supabase.from(table).select('id').match(matchQuery).single();

    if (existing) {
        // Remove
        await supabase.from(table).delete().match(matchQuery);
        return NextResponse.json({ active: false });
    } else {
        // Add
        let insertData = { ...matchQuery };
        if (type === 'bookmark' && payload) {
            insertData = { ...insertData, ...payload };
        }
        await supabase.from(table).insert(insertData);
        return NextResponse.json({ active: true });
    }
}
