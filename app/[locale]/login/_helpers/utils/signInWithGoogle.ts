import { APP_PATH } from '@/_shared/helpers/constants/appPath';
import { createClient } from '@/_shared/lib/supabase/client';

const supabase = createClient();

export const signInWithGoogle = async () => {
  const locale = window.location.pathname.split('/')[1] ?? 'ko';

  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${location.origin}/${locale}/${APP_PATH.AUTH_CALLBACK}`,
    },
  });
};
