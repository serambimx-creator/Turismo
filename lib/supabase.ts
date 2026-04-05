import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;
let currentUrl = '';

export const getSupabase = () => {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  let key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!url || !key) {
    if (typeof window !== 'undefined') {
      const localUrl = localStorage.getItem('SB_URL');
      const localKey = localStorage.getItem('SB_KEY');
      if (localUrl && localKey) {
        url = localUrl;
        key = localKey;
      }
    }
  }

  console.log('getSupabase called. URL from env/local:', url);

  if (!url || !key) {
    console.warn('Supabase keys missing, using placeholder');
    url = 'https://placeholder.supabase.co';
    key = 'placeholder';
  }

  if (!supabaseInstance || currentUrl !== url) {
    console.log('Creating new Supabase client for URL:', url);
    supabaseInstance = createClient(url, key);
    currentUrl = url;
  }

  return supabaseInstance;
};
