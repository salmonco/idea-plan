import { createClient } from '@/_shared/lib/supabase/client';

const supabase = createClient();

export const signInWithGoogle = async () => {
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${location.origin}/auth/callback`,
    },
  });
};
