import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/libs/api-client';
import { getSession } from '@/libs/auth';

export const dynamic = 'force-dynamic';

/**
 * Token refresh endpoint
 * Validates current session and returns user data
 * POST /api/auth/refresh
 */
export async function POST() {
  try {
    // Get session token from cookie
    const token = await getSession();

    if (!token) {
      return NextResponse.json(
        { error: 'No active session' },
        { status: 401 },
      );
    }

    // Validate token with FastAPI backend
    const response = await getCurrentUser(token);

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Session expired' },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      user: response.data,
    });
  } catch (error: any) {
    console.error('Refresh error:', error);
    return NextResponse.json(
      { error: 'Session validation failed' },
      { status: 401 },
    );
  }
}
