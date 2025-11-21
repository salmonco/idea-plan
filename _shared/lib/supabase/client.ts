import { createBrowserClient } from '@supabase/ssr';

/**
 * Creates a Supabase client for client-side use.
 * @see https://supabase.com/docs/guides/auth/server-side/creating-a-client
 */
export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
};
