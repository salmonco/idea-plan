'use client';

import { createClient } from '@/_shared/lib/supabase/client';

export const GoogleLoginButtonClient = () => {
  const supabase = createClient();

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="flex gap-2 rounded-lg border px-4 py-2 text-lg shadow-md transition-shadow duration-300 hover:shadow-lg">
      <img
        src="https://www.svgrepo.com/show/355037/google.svg"
        alt="Google logo"
        className="h-6 w-6"
      />
      <span>Sign in with Google</span>
    </button>
  );
};
