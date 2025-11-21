import { APP_PATH } from '@/_shared/helpers/constants/appPath';
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
    !request.nextUrl.pathname.startsWith(APP_PATH.LOGIN) &&
    !request.nextUrl.pathname.startsWith(APP_PATH.AUTH)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = APP_PATH.LOGIN;
    return NextResponse.redirect(url);
  }

  const isRootOrAuth =
    request.nextUrl.pathname === APP_PATH.ROOT ||
    request.nextUrl.pathname.startsWith(APP_PATH.AUTH);

  if (user && isRootOrAuth) {
    const url = request.nextUrl.clone();
    url.pathname = APP_PATH.DASHBOARD;
    return NextResponse.redirect(url);
  }

  return NextResponse.next({ request });
};
