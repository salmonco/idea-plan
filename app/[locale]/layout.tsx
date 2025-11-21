import { Header } from '@/_shared/components/Header';
import { createClient } from '@/_shared/lib/supabase/server';
import routing from '@/i18n/routing';
import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { Geist, Geist_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import '../globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'IdeaPlan',
  description: 'Generate 1-Pager, Spec, Action Plan from your idea',
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

const LocaleLayout = async ({ children, params }: Props) => {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  // Load messages for the current locale
  const messages = await getMessages();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header user={user} />
          <main className="grow">{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default LocaleLayout;
