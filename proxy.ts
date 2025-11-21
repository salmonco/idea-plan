import { updateSession } from '@/_shared/lib/supabase/proxy';
import routing from '@/i18n/routing';
import createMiddleware from 'next-intl/middleware';
import { type NextRequest } from 'next/server';

const handleI18nRouting = createMiddleware(routing);

/**
 * Proxies the request to the updateSession function.
 * @param request - NextRequest object
 * @returns - NextResponse object
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/proxy
 */
export const proxy = async (request: NextRequest) => {
  const intlResponse = handleI18nRouting(request);
  return await updateSession(request, intlResponse);
};

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!api|_next|_vercel|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
