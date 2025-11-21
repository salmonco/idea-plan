import { Button } from '@/_shared/components/ui/button';
import { APP_PATH } from '@/_shared/helpers/constants/appPath';
import { Link } from '@/i18n/navigation';
import { Lightbulb } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

const Page = async ({ params }: Props) => {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  // Once the request locale is set, you
  // can call hooks from `next-intl`
  const t = await getTranslations('LandingPage');

  return (
    <div className="flex h-screen flex-col items-center justify-center p-4 text-center">
      <div className="mb-4 flex items-center gap-2">
        <Lightbulb className="h-10 w-10 text-yellow-400" />
        <h1 className="text-5xl font-bold">IdeaPlan</h1>
      </div>
      <p className="text-muted-foreground mb-8 max-w-md text-lg">
        {t('Description')}
      </p>
      <Link href={APP_PATH.DASHBOARD}>
        <Button size="lg">{t('GetStarted')}</Button>
      </Link>
    </div>
  );
};

export default Page;
