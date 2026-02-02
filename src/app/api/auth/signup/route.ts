import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { registerUser } from '@/libs/api-client';

export const dynamic = 'force-dynamic';

/**
 * Signup endpoint - Proxies to FastAPI backend
 * POST /api/auth/signup
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, full_name, phone_number } = body;

    if (!email || !password || !full_name) {
      return NextResponse.json(
        { error: 'Email, password, and full name are required' },
        { status: 400 },
      );
    }

    // Call FastAPI register endpoint
    const response = await registerUser({
      email,
      password,
      full_name,
      phone_number,
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: response.error || 'Registration failed' },
        { status: response.status },
      );
    }

    const data = response.data;

    return NextResponse.json(
      {
        success: true,
        user_id: data.user_id,
        email: data.email,
        verification_level: data.verification_level,
        email_verification_sent: data.email_verification_sent,
        message: data.message || 'Registration successful. Please check your email to verify your account.',
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 },
    );
  }
}
