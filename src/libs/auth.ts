import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'alignhealthcare_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type SessionUser = {
  user_id: string;
  email: string;
  full_name?: string;
  verification_level: string;
  organization_name?: string;
  two_factor_enabled: boolean;
};

/**
 * Set session cookie with user data
 */
export async function setSession(_user: SessionUser, token: string) {
  const cookieStore = await cookies();

  // Store the FastAPI JWT token
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });

  return true;
}

/**
 * Get session token from cookie
 */
export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  return sessionCookie?.value || null;
}

/**
 * Clear session cookie
 */
export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getSession();
  return !!token;
}

/**
 * Verify JWT token (basic validation)
 * For full validation, FastAPI backend validates on each request
 */
export async function verifyToken(token: string): Promise<boolean> {
  try {
    // Basic token structure validation
    // Full validation happens on FastAPI backend
    const parts = token.split('.');
    return parts.length === 3;
  } catch {
    return false;
  }
}
