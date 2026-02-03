import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { organization_name, organization_type, role, use_cases, data_types } = body;

    // Validate required fields
    if (!organization_name || !organization_type || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    if (!use_cases || use_cases.length === 0) {
      return NextResponse.json(
        { error: 'At least one use case is required' },
        { status: 400 },
      );
    }

    if (!data_types || data_types.length === 0) {
      return NextResponse.json(
        { error: 'At least one data type is required' },
        { status: 400 },
      );
    }

    // Get session cookie to extract user info
    const sessionCookie = request.cookies.get('alignhealthcare_session');
    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 },
      );
    }

    // Forward onboarding data to FastAPI backend
    const pythonApiUrl = process.env.PYTHON_API_URL || 'http://localhost:8082';
    const response = await fetch(`${pythonApiUrl}/onboarding/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `alignhealthcare_session=${sessionCookie.value}`,
      },
      body: JSON.stringify({
        organization_name,
        organization_type,
        role,
        use_cases,
        data_types,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to complete onboarding' },
        { status: response.status },
      );
    }

    return NextResponse.json(
      { message: 'Onboarding completed successfully', data },
      { status: 200 },
    );
  } catch (error: any) {
    console.error('Onboarding completion error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 },
    );
  }
}
