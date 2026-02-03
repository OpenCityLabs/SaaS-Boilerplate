import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { AllLocales, AppConfig } from './utils/AppConfig';

const intlMiddleware = createMiddleware({
  locales: AllLocales,
  localePrefix: AppConfig.localePrefix,
  defaultLocale: AppConfig.defaultLocale,
});

// Routes that require authentication
const protectedRoutes = ['/dashboard'];

// Routes that should always be public (no auth required)
const publicRoutes = ['/', '/terms-of-service', '/privacy-policy'];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is explicitly public
  const isPublicRoute = publicRoutes.some(route =>
    pathname === route || pathname.endsWith(route),
  );

  // Public routes should always be accessible
  if (isPublicRoute) {
    return intlMiddleware(request);
  }

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.includes(route),
  );

  // Get session cookie
  const sessionCookie = request.cookies.get('alignhealthcare_session');
  const hasSession = !!sessionCookie;

  // If accessing protected route without session, redirect to sign-in
  if (isProtectedRoute && !hasSession) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // If accessing sign-in/sign-up with active session, redirect to dashboard
  if ((pathname.includes('/sign-in') || pathname.includes('/sign-up')) && hasSession) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Continue with i18n middleware
  return intlMiddleware(request);
}

export const config = {
  // Exclude /api routes, static files, _next, and monitoring from i18n middleware
  matcher: ['/((?!api|_next|monitoring|.*\\..*).*)', '/'],
};
