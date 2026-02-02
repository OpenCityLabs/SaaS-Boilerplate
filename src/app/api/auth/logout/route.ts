import { NextResponse } from 'next/server';

import { logoutUser } from '@/libs/api-client';
import { clearSession } from '@/libs/auth';

export const dynamic = 'force-dynamic';

/**
 * Logout endpoint
 * POST /api/auth/logout
 */
export async function POST() {
  try {
    // Clear session cookie
    await clearSession();

    // Optionally call FastAPI logout (for server-side session invalidation)
    await logoutUser();

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error: any) {
    console.error('Logout error:', error);

    // Even if backend logout fails, we cleared the cookie
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  }
}
