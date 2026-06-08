import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!url || !key) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/** Restituisce l'URL pubblico di un oggetto nel bucket user-photos */
export function getPhotoUrl(storagePath: string): string {
  const { data } = supabase.storage.from('user-photos').getPublicUrl(storagePath);
  return data.publicUrl;
}
