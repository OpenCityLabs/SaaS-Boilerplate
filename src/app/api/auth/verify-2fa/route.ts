import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { verify2FALogin } from '@/libs/api-client';
import { setSession } from '@/libs/auth';

export const dynamic = 'force-dynamic';

/**
 * Verify 2FA endpoint - Completes login after 2FA verification
 * POST /api/auth/verify-2fa
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, code } = body;

    if (!user_id || !code) {
      return NextResponse.json(
        { error: 'User ID and verification code are required' },
        { status: 400 },
      );
    }

    // Call FastAPI 2FA verification endpoint
    const response = await verify2FALogin(user_id, code);

    if (!response.ok) {
      return NextResponse.json(
        { error: response.error || '2FA verification failed' },
        { status: response.status },
      );
    }

    const data = response.data;

    // Set session after successful 2FA
    if (data.session_token) {
      await setSession(
        {
          user_id: data.user_id || user_id,
          email: data.email || '',
          full_name: data.full_name,
          verification_level: data.verification_level,
          organization_name: data.organization_name,
          two_factor_enabled: true,
        },
        data.session_token,
      );

      return NextResponse.json({
        success: true,
        message: data.message || 'Login successful',
      });
    }

    return NextResponse.json(
      { error: 'Invalid response from authentication server' },
      { status: 500 },
    );
  } catch (error: any) {
    console.error('2FA verification error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 },
    );
  }
}
