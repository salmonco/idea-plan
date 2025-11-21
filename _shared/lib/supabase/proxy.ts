import { createClient } from '@/_shared/lib/supabase/server';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Updates the user session.
 * - Redirects pages based on authentication status.
 * @param request - NextRequest object
 */
export const updateSession = async (request: NextRequest) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  const isRootOrAuth =
    request.nextUrl.pathname === '/' ||
    request.nextUrl.pathname.startsWith('/auth');

  if (user && isRootOrAuth) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next({ request });
};
