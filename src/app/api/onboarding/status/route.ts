import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get session cookie
    const sessionCookie = request.cookies.get('alignhealthcare_session');
    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 },
      );
    }

    // Check onboarding status from FastAPI backend
    const pythonApiUrl = process.env.PYTHON_API_URL || 'http://localhost:8082';
    const response = await fetch(`${pythonApiUrl}/onboarding/status`, {
      method: 'GET',
      headers: {
        Cookie: `alignhealthcare_session=${sessionCookie.value}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to check onboarding status' },
        { status: response.status },
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('Onboarding status check error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 },
    );
  }
}
