import routing from '@/i18n/routing';
import { NextRequest } from 'next/server';

export const getPathWithLocale = async (
  request: NextRequest,
  pathname: string,
) => {
  const segments = request.nextUrl.pathname.split('/');
  const localeInPath = segments[1] as 'en' | 'ko';
  const locale = routing.locales.includes(localeInPath)
    ? localeInPath
    : routing.defaultLocale;

  return `/${locale}${pathname}`;
};
