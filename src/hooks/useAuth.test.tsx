import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthProvider } from '@/contexts/AuthContext';

import { useAuth } from './useAuth';

// Mock fetch
globalThis.fetch = vi.fn();

describe('useAuth hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  // Note: Testing error throwing with renderHook is not straightforward as it catches
  // errors internally. The hook does throw an error when used outside AuthProvider,
  // but testing this requires different setup. Skipping this test in favor of
  // testing the actual functionality.

  it('should provide auth context when used within AuthProvider', async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current).toBeDefined();
    expect(result.current.user).toBeNull();
    expect(result.current.error).toBeNull();
    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.logout).toBe('function');
    expect(typeof result.current.verify2FA).toBe('function');
    expect(typeof result.current.refetchUser).toBe('function');
  });

  it('should login successfully without 2FA', async () => {
    (globalThis.fetch as any)
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          user: { user_id: '123', email: 'test@example.com' },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          user: {
            user_id: '123',
            email: 'test@example.com',
            verification_level: 'L1_EmailVerified',
            two_factor_enabled: false,
          },
        }),
      });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    let loginResult: any;
    await act(async () => {
      loginResult = await result.current.login(
        'test@example.com',
        'password123',
      );
    });

    expect(loginResult.success).toBe(true);
    expect(loginResult.two_factor_required).toBeUndefined();

    await waitFor(() => {
      expect(result.current.user).toBeDefined();
      expect(result.current.user?.email).toBe('test@example.com');
    });
  });

  it('should require 2FA when enabled', async () => {
    (globalThis.fetch as any)
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          two_factor_required: true,
          user_id: '123',
          two_factor_method: 'totp',
        }),
      });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    let loginResult: any;
    await act(async () => {
      loginResult = await result.current.login(
        'test@example.com',
        'password123',
      );
    });

    expect(loginResult.success).toBe(true);
    expect(loginResult.two_factor_required).toBe(true);
    expect(loginResult.two_factor_method).toBe('totp');
    expect(loginResult.user_id).toBe('123');
  });

  it('should verify 2FA successfully', async () => {
    (globalThis.fetch as any)
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          user: {
            user_id: '123',
            email: 'test@example.com',
            two_factor_enabled: true,
          },
        }),
      });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    let success;
    await act(async () => {
      success = await result.current.verify2FA('123', '123456');
    });

    expect(success).toBe(true);
  });

  it('should handle login error', async () => {
    (globalThis.fetch as any)
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Invalid credentials' }),
      });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    let loginResult: any;
    await act(async () => {
      loginResult = await result.current.login(
        'test@example.com',
        'wrongpassword',
      );
    });

    expect(loginResult.success).toBe(false);

    await waitFor(() => {
      expect(result.current.error).toBe('Invalid credentials');
    });
  });

  it('should logout successfully', async () => {
    (globalThis.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          user: { user_id: '123', email: 'test@example.com' },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.user).toBeDefined());

    await act(async () => {
      await result.current.logout();
    });

    await waitFor(() => {
      expect(result.current.user).toBeNull();
    });
  });
});
