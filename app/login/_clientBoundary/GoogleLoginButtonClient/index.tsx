'use client';

import { Button } from '@/_shared/components/ui/button';
import { signInWithGoogle } from '@/app/login/_helpers/utils/signInWithGoogle';

export const GoogleLoginButtonClient = () => {
  return (
    <Button
      onClick={signInWithGoogle}
      className="flex gap-2 rounded-lg border px-4 py-2 text-lg shadow-md transition-shadow duration-300 hover:shadow-lg">
      <img
        src="https://www.svgrepo.com/show/355037/google.svg"
        alt="Google logo"
        className="h-6 w-6"
      />
      <span>Sign in with Google</span>
    </Button>
  );
};
