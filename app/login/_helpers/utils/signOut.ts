import { createClient } from '@/_shared/lib/supabase/client';

const supabase = createClient();

export const signOut = async () => {
  await supabase.auth.signOut();
};
