import { cookies } from 'next/headers';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { clearSession, getSession, isAuthenticated, setSession } from './auth';

// Mock next/headers
vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

describe('Auth Utilities', () => {
  const mockCookies = {
    set: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (cookies as any).mockResolvedValue(mockCookies);
  });

  describe('setSession', () => {
    it('should set session cookie with user data', async () => {
      const user = {
        user_id: 'test-user-id',
        email: 'test@example.com',
        full_name: 'Test User',
        verification_level: 'L1_EmailVerified',
        organization_name: 'Test Org',
        two_factor_enabled: false,
      };
      const token = 'test-jwt-token';

      const result = await setSession(user, token);

      expect(result).toBe(true);
      expect(mockCookies.set).toHaveBeenCalledWith(
        'alignhealthcare_session',
        token,
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
        }),
      );
    });

    it('should set secure flag in production', async () => {
      vi.stubEnv('NODE_ENV', 'production');

      const user = {
        user_id: 'test-user-id',
        email: 'test@example.com',
        verification_level: 'L0_Unverified',
        two_factor_enabled: false,
      };
      const token = 'test-jwt-token';

      await setSession(user, token);

      expect(mockCookies.set).toHaveBeenCalledWith(
        'alignhealthcare_session',
        token,
        expect.objectContaining({
          secure: true,
        }),
      );

      vi.unstubAllEnvs();
    });
  });

  describe('getSession', () => {
    it('should return session token if exists', async () => {
      mockCookies.get.mockReturnValue({ value: 'test-token' });

      const result = await getSession();

      expect(result).toBe('test-token');
      expect(mockCookies.get).toHaveBeenCalledWith('alignhealthcare_session');
    });

    it('should return null if no session exists', async () => {
      mockCookies.get.mockReturnValue(undefined);

      const result = await getSession();

      expect(result).toBeNull();
    });
  });

  describe('clearSession', () => {
    it('should delete session cookie', async () => {
      await clearSession();

      expect(mockCookies.delete).toHaveBeenCalledWith(
        'alignhealthcare_session',
      );
    });
  });

  describe('isAuthenticated', () => {
    it('should return true if session exists', async () => {
      mockCookies.get.mockReturnValue({ value: 'test-token' });

      const result = await isAuthenticated();

      expect(result).toBe(true);
    });

    it('should return false if no session exists', async () => {
      mockCookies.get.mockReturnValue(undefined);

      const result = await isAuthenticated();

      expect(result).toBe(false);
    });
  });
});
