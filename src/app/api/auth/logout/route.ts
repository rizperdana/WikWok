import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = createServerClient();

    // Check if user is logged in first (optional, but good practice)
    const authHeader = request.headers.get('Authorization');
    if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        // We might want to pass this token to signOut if Supabase supported it directly via admin,
        // but client signOut usually handles local state.
        // Server-side signOut invalidates the session in the DB.
        await supabase.auth.signOut();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
