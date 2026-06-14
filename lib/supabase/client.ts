import { createBrowserClient } from '@supabase/ssr'
import { createMockSupabaseClient } from './mockClient'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('dummy') || supabaseAnonKey.includes('dummy')) {
    console.warn('Supabase environment variables are missing or dummy. Falling back to local mock client.');
    return createMockSupabaseClient() as any;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
