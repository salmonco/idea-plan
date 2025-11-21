import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/_shared/components/ui/card';
import { GoogleLoginButtonClient } from '@/app/[locale]/login/_clientBoundary/GoogleLoginButtonClient';
import { getTranslations } from 'next-intl/server';

const LoginPage = async () => {
  const t = await getTranslations('LoginPage');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-2">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t('WelcomeTitle')}</CardTitle>
          <CardDescription>{t('WelcomeDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <GoogleLoginButtonClient />
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
