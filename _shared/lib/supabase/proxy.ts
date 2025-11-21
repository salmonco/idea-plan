import { APP_PATH } from '@/_shared/helpers/constants/appPath';
import { createClient } from '@/_shared/lib/supabase/server';
import { getPathWithLocale } from '@/_shared/lib/supabase/utils/getLocalePath';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Updates the user session.
 * - Redirects pages based on authentication status.
 * @param request - NextRequest object
 */
export const updateSession = async (
  request: NextRequest,
  intlResponse: NextResponse,
) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const loginPath = await getPathWithLocale(request, APP_PATH.LOGIN);
  const authPath = await getPathWithLocale(request, APP_PATH.AUTH_CALLBACK);
  const rootPath = await getPathWithLocale(request, APP_PATH.ROOT);
  const dashboardPath = await getPathWithLocale(request, APP_PATH.DASHBOARD);

  if (
    !user &&
    !request.nextUrl.pathname.startsWith(loginPath) &&
    !request.nextUrl.pathname.startsWith(authPath)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = loginPath;
    return NextResponse.redirect(url);
  }

  const isRootOrAuth =
    request.nextUrl.pathname === rootPath ||
    request.nextUrl.pathname.startsWith(authPath);

  if (user && isRootOrAuth) {
    const url = request.nextUrl.clone();
    url.pathname = dashboardPath;
    return NextResponse.redirect(url);
  }

  return intlResponse;
};
