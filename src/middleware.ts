import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { AllLocales, AppConfig } from './utils/AppConfig';

const intlMiddleware = createMiddleware({
  locales: AllLocales,
  localePrefix: AppConfig.localePrefix,
  defaultLocale: AppConfig.defaultLocale,
});

export default function middleware(request: NextRequest) {
  // TODO: Add custom auth protection in Phase 4
  // For now, just handle i18n
  return intlMiddleware(request);
}

export const config = {
  // Exclude /api routes, static files, _next, and monitoring from i18n middleware
  matcher: ['/((?!api|_next|monitoring|.*\\..*).*)', '/'],
};
