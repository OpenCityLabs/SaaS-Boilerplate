import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as apiClient from '@/libs/api-client';
import * as auth from '@/libs/auth';

import { POST } from './route';

vi.mock('@/libs/api-client');
vi.mock('@/libs/auth');

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return error if email or password is missing', async () => {
    const request = new NextRequest('http://localhost:3005/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Email and password are required');
  });

  it('should return 2FA required when enabled', async () => {
    const request = new NextRequest('http://localhost:3005/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
    });

    vi.mocked(apiClient.loginUser).mockResolvedValue({
      ok: true,
      status: 200,
      data: {
        success: true,
        two_factor_required: true,
        two_factor_method: 'totp',
        user_id: '123',
        email: 'test@example.com',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.two_factor_required).toBe(true);
    expect(data.two_factor_method).toBe('totp');
  });

  it('should set session and return success without 2FA', async () => {
    const request = new NextRequest('http://localhost:3005/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
    });

    vi.mocked(apiClient.loginUser).mockResolvedValue({
      ok: true,
      status: 200,
      data: {
        success: true,
        user_id: '123',
        email: 'test@example.com',
        session_token: 'jwt-token',
        verification_level: 'L1_EmailVerified',
      },
    });

    vi.mocked(auth.setSession).mockResolvedValue(true);

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(auth.setSession).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: '123',
        email: 'test@example.com',
      }),
      'jwt-token',
    );
  });

  it('should return error on login failure', async () => {
    const request = new NextRequest('http://localhost:3005/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongpassword',
      }),
    });

    vi.mocked(apiClient.loginUser).mockResolvedValue({
      ok: false,
      status: 401,
      error: 'Invalid credentials',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Invalid credentials');
  });
});
