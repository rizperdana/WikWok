import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const articleUrl = searchParams.get('url');

    if (!articleUrl) {
        return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
    }

    const supabase = createServerClient();

    // We can't easily check auth for GET requests without headers, but comments are public anyway.
    // If we need "user_has_liked", we need the Authorization header.
    const authHeader = request.headers.get('Authorization');
    let userId: string | null = null;

    if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        const { data: { user } } = await supabase.auth.getUser(token);
        if (user) userId = user.id;
    }

    // 1. Fetch Comments
    const { data: commentsData, error } = await supabase
        .from('comments')
        .select('*, profiles(username, avatar_url)')
        .eq('article_url', articleUrl)
        .order('created_at', { ascending: true }); // Parent -> Child ordering usually easier by time

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 2. Fetch User Likes if logged in
    let myLikes: Set<string> = new Set();
    if (userId) {
        const { data: likesData } = await supabase
            .from('comment_likes')
            .select('comment_id')
            .eq('user_id', userId)
            .in('comment_id', commentsData.map(c => c.id));

        if (likesData) {
            likesData.forEach(l => myLikes.add(l.comment_id));
        }
    }

    // 3. Format Data
    const formatted = commentsData.map((c: any) => ({
        ...c,
        user_has_liked: myLikes.has(c.id),
        likes_count: 0 // Waiting for real count implementation
    }));

    // 4. Threading (Simple Nesting)
    const roots = formatted.filter(c => !c.parent_id);
    const children = formatted.filter(c => c.parent_id);
    const thread: any[] = [];

    roots.forEach(root => {
        thread.push(root);
        const myChildren = children.filter(c => c.parent_id === root.id);
        thread.push(...myChildren);
    });

    return NextResponse.json(thread);
}

export async function POST(request: Request) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerClient();
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { article_url, content, parent_id, depth } = body;

    // Validate
    if (!article_url || !content) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const { error } = await supabase
        .from('comments')
        .insert({
            user_id: user.id,
            article_url,
            content,
            parent_id,
            depth
        });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
