'use client';

import { Button } from '@/_shared/components/ui/button';
import { APP_PATH } from '@/_shared/helpers/constants/appPath';
import { signInWithGoogle } from '@/app/[locale]/login/_helpers/utils/signInWithGoogle';
import { signOut } from '@/app/[locale]/login/_helpers/utils/signOut';
import { Link } from '@/i18n/navigation';
import { User } from '@supabase/supabase-js';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { LocaleSwitcher } from './LocaleSwitcher';

type Props = {
  user: User | null;
};

export const Header = ({ user }: Props) => {
  const t = useTranslations('Header');
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.refresh();
  };

  return (
    <header className="flex items-center justify-between border-b p-4">
      <Link href={APP_PATH.ROOT}>
        <h1 className="text-2xl font-bold">{t('IdeaPlan')}</h1>
      </Link>
      <div className="flex items-center space-x-4">
        <LocaleSwitcher />
        {user ? (
          <>
            <span>
              {t('Hello')}, {user.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              {t('SignOut')}
            </Button>
          </>
        ) : (
          <Button variant="outline" size="sm" onClick={signInWithGoogle}>
            {t('SignIn')}
          </Button>
        )}
      </div>
    </header>
  );
};
