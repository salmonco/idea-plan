import { updateSession } from '@/_shared/lib/supabase/proxy';
import { type NextRequest } from 'next/server';

/**
 * Proxies the request to the updateSession function.
 * @param request - NextRequest object
 * @returns - NextResponse object
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/proxy
 */
export const proxy = async (request: NextRequest) => {
  return await updateSession(request);
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
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
