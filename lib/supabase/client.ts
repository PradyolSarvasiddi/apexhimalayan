import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase environment variables are missing. Please check your .env file.');
    // Return a proxy that logs errors instead of crashing if called
    return new Proxy({} as any, {
      get: () => () => {
        throw new Error('Supabase client called but environment variables are missing.');
      }
    });
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
