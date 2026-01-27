
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // Using Anon key is fine for server client as long as we pass user token OR use Service Role for admin tasks.
// For user interactions, we should usually forward the user's JWT so RLS policies apply.

export const createServerClient = () => {
    return createClient(supabaseUrl, supabaseKey);
};
