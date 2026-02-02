import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/libs/api-client';
import { getSession } from '@/libs/auth';

export const dynamic = 'force-dynamic';

/**
 * Get current user endpoint
 * GET /api/auth/me
 */
export async function GET() {
  try {
    // Get session token from cookie
    const token = await getSession();

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 },
      );
    }

    // Call FastAPI /auth/me endpoint
    const response = await getCurrentUser(token);

    if (!response.ok) {
      return NextResponse.json(
        { error: response.error || 'Failed to fetch user' },
        { status: response.status },
      );
    }

    return NextResponse.json({
      success: true,
      user: response.data,
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 },
    );
  }
}
