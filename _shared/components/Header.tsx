'use client';

import { Button } from '@/_shared/components/ui/button';
import { signInWithGoogle } from '@/app/login/_helpers/utils/signInWithGoogle';
import { signOut } from '@/app/login/_helpers/utils/signOut';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Props = {
  user: User | null;
};

export const Header = ({ user }: Props) => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.refresh();
  };

  return (
    <header className="flex items-center justify-between border-b p-4">
      <Link href="/">
        <h1 className="text-2xl font-bold">IdeaPlan</h1>
      </Link>
      {user ? (
        <div className="flex items-center space-x-4">
          <span>Hello, {user.email}</span>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      ) : (
        <Button variant="outline" size="sm" onClick={signInWithGoogle}>
          Sign In
        </Button>
      )}
    </header>
  );
};
