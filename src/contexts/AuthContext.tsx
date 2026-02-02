'use client';

import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

export type User = {
  user_id: string;
  email: string;
  full_name?: string;
  verification_level: string;
  organization_name?: string;
  two_factor_enabled: boolean;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; two_factor_required?: boolean; user_id?: string; two_factor_method?: string }>;
  verify2FA: (userId: string, code: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  login: async () => ({ success: false }),
  verify2FA: async () => false,
  logout: async () => {},
  refetchUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/auth/me');

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err: any) {
      console.error('Failed to fetch user:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch current user on mount
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setError(null);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        return { success: false };
      }

      // Check if 2FA is required
      if (data.two_factor_required) {
        return {
          success: true,
          two_factor_required: true,
          user_id: data.user_id,
          two_factor_method: data.two_factor_method,
        };
      }

      // Login successful, fetch user data
      await fetchUser();
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred during login';
      setError(errorMessage);
      return { success: false };
    }
  }, [fetchUser]);

  const verify2FA = useCallback(async (userId: string, code: string) => {
    try {
      setError(null);

      const response = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || '2FA verification failed');
        return false;
      }

      // 2FA successful, fetch user data
      await fetchUser();
      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred during 2FA verification';
      setError(errorMessage);
      return false;
    }
  }, [fetchUser]);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      // Clear user even if API call fails
      setUser(null);
    }
  }, []);

  const refetchUser = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      login,
      verify2FA,
      logout,
      refetchUser,
    }),
    [user, loading, error, login, verify2FA, logout, refetchUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
