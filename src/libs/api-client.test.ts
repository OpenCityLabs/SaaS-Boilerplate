import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  apiRequest,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  verify2FALogin,
} from './api-client';

// Mock fetch
globalThis.fetch = vi.fn();

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('apiRequest', () => {
    it('should make successful API request', async () => {
      const mockData = { success: true, message: 'OK' };
      (globalThis.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const result = await apiRequest('/test');

      expect(result.ok).toBe(true);
      expect(result.status).toBe(200);
      expect(result.data).toEqual(mockData);
      expect(result.error).toBeUndefined();
    });

    it('should handle API errors', async () => {
      (globalThis.fetch as any).mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Bad Request' }),
      });

      const result = await apiRequest('/test');

      expect(result.ok).toBe(false);
      expect(result.status).toBe(400);
      expect(result.error).toBe('Bad Request');
      expect(result.data).toBeUndefined();
    });

    it('should handle network errors', async () => {
      (globalThis.fetch as any).mockRejectedValue(new Error('Network error'));

      const result = await apiRequest('/test');

      expect(result.ok).toBe(false);
      expect(result.status).toBe(500);
      expect(result.error).toBe('Network error');
    });

    it('should set Content-Type header', async () => {
      (globalThis.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      await apiRequest('/test');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        }),
      );
    });
  });

  describe('loginUser', () => {
    it('should call login endpoint with credentials', async () => {
      const mockResponse = { success: true, session_token: 'token' };
      (globalThis.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const result = await loginUser('test@example.com', 'password123');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123',
          }),
        }),
      );
      expect(result.data).toEqual(mockResponse);
    });
  });

  describe('registerUser', () => {
    it('should call register endpoint with user data', async () => {
      const userData = {
        email: 'new@example.com',
        password: 'password123',
        full_name: 'New User',
        phone_number: '+1-555-0123',
      };

      (globalThis.fetch as any).mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => ({ success: true, user_id: '123' }),
      });

      const result = await registerUser(userData);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/register'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(userData),
        }),
      );
      expect(result.status).toBe(201);
    });
  });

  describe('getCurrentUser', () => {
    it('should call /auth/me with authorization header', async () => {
      const token = 'jwt-token';
      const mockUser = {
        user_id: '123',
        email: 'test@example.com',
        verification_level: 'L1_EmailVerified',
      };

      (globalThis.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockUser,
      });

      const result = await getCurrentUser(token);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/me'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            Authorization: `Bearer ${token}`,
          }),
        }),
      );
      expect(result.data).toEqual(mockUser);
    });
  });

  describe('verify2FALogin', () => {
    it('should call 2FA verification endpoint', async () => {
      (globalThis.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true, session_token: 'token' }),
      });

      const result = await verify2FALogin('user123', '123456');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/2fa/verify-login'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ user_id: 'user123', code: '123456' }),
        }),
      );
      expect(result.ok).toBe(true);
    });
  });

  describe('logoutUser', () => {
    it('should call logout endpoint', async () => {
      (globalThis.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      });

      const result = await logoutUser();

      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/logout'),
        expect.objectContaining({
          method: 'POST',
        }),
      );
      expect(result.ok).toBe(true);
    });
  });
});
