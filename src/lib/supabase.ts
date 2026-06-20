import { createClient } from '@supabase/supabase-js';

// We provide a fallback dummy URL so that Next.js build doesn't crash on Vercel
// when environment variables are not yet set in the Vercel Dashboard.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

if (supabaseUrl === 'https://placeholder.supabase.co') {
  console.warn('⚠️ Supabase URL or Anon Key is missing. Please configure them in your .env.local file or Vercel Environment Variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
