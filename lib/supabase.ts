import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;
let currentUrl = '';

export const getSupabase = () => {
  // Priorizar variables de entorno (especialmente en el servidor/Vercel)
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  let key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  // Fallback a localStorage solo en el cliente
  if (typeof window !== 'undefined' && (!url || !key)) {
    const localUrl = localStorage.getItem('SB_URL');
    const localKey = localStorage.getItem('SB_KEY');
    if (localUrl && localKey) {
      url = localUrl;
      key = localKey;
      console.log('🔄 Usando llaves de Supabase desde localStorage');
    }
  }

  if (!url || !key) {
    console.warn('⚠️ Error de Configuración: Faltan llaves de Supabase (URL o KEY).');
    // Placeholder para evitar que la app crashee, pero el error será visible
    url = url || 'https://missing-url.supabase.co';
    key = key || 'missing-key';
  }

  if (!supabaseInstance || currentUrl !== url) {
    console.log(`🔌 Inicializando cliente Supabase: ${url.substring(0, 20)}...`);
    supabaseInstance = createClient(url, key);
    currentUrl = url;
  }

  return supabaseInstance;
};
