'use client';

import { Button } from '@/_shared/components/ui/button';
import { signInWithGoogle } from '@/app/[locale]/login/_helpers/utils/signInWithGoogle';

export const GoogleLoginButtonClient = () => {
  return (
    <Button
      variant="outline"
      onClick={signInWithGoogle}
      className="gap-2 text-lg">
      <img
        src="https://www.svgrepo.com/show/355037/google.svg"
        alt="Google logo"
        className="h-6 w-6"
      />
      <span>Sign in with Google</span>
    </Button>
  );
};
