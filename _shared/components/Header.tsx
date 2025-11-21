'use client';

import { createClient } from '@/_shared/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Props = {
  user: User | null;
};

export const Header = ({ user }: Props) => {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
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
          <button
            onClick={handleSignOut}
            className="rounded-lg border px-4 py-2 text-sm shadow-md transition-shadow duration-300 hover:shadow-lg">
            Sign Out
          </button>
        </div>
      ) : (
        <Link href="/login">
          <button className="rounded-lg border px-4 py-2 text-sm shadow-md transition-shadow duration-300 hover:shadow-lg">
            Sign In
          </button>
        </Link>
      )}
    </header>
  );
};
