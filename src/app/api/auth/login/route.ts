import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { loginUser } from '@/libs/api-client';
import { setSession } from '@/libs/auth';

export const dynamic = 'force-dynamic';

/**
 * Login endpoint - Proxies to FastAPI backend
 * POST /api/auth/login
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 },
      );
    }

    // Call FastAPI login endpoint
    const response = await loginUser(email, password);

    if (!response.ok) {
      return NextResponse.json(
        { error: response.error || 'Login failed' },
        { status: response.status },
      );
    }

    const data = response.data;

    // Check if 2FA is required
    if (data.two_factor_required) {
      // Don't set session yet, return 2FA required status
      return NextResponse.json({
        success: true,
        two_factor_required: true,
        two_factor_method: data.two_factor_method,
        user_id: data.user_id,
        email: data.email,
        message: 'Two-factor authentication required',
      });
    }

    // 2FA not required, set session immediately
    if (data.session_token) {
      await setSession(
        {
          user_id: data.user_id,
          email: data.email,
          full_name: data.full_name,
          verification_level: data.verification_level,
          organization_name: data.organization_name,
          two_factor_enabled: false,
        },
        data.session_token,
      );

      return NextResponse.json({
        success: true,
        user: {
          user_id: data.user_id,
          email: data.email,
          verification_level: data.verification_level,
        },
        message: 'Login successful',
      });
    }

    return NextResponse.json(
      { error: 'Invalid response from authentication server' },
      { status: 500 },
    );
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 },
    );
  }
}
