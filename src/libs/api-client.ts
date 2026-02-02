/**
 * API Client for FastAPI Backend
 * Handles all HTTP requests to the Python API
 */

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8082';

type ApiResponse<T = any> = {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
};

/**
 * Make a request to the FastAPI backend
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const url = `${PYTHON_API_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => null);

    return {
      ok: response.ok,
      status: response.status,
      data: response.ok ? data : undefined,
      error: !response.ok ? (data?.message || data?.detail || 'Request failed') : undefined,
    };
  } catch (error: any) {
    return {
      ok: false,
      status: 500,
      error: error.message || 'Network error',
    };
  }
}

/**
 * Login to FastAPI backend
 */
export async function loginUser(email: string, password: string) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

/**
 * Register new user
 */
export async function registerUser(data: {
  email: string;
  password: string;
  full_name: string;
  phone_number?: string;
}) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Get current user info
 */
export async function getCurrentUser(token: string) {
  return apiRequest('/auth/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * Verify 2FA code during login
 */
export async function verify2FALogin(userId: string, code: string) {
  return apiRequest('/auth/2fa/verify-login', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, code }),
  });
}

/**
 * Logout user (client-side token deletion is primary method)
 */
export async function logoutUser() {
  return apiRequest('/auth/logout', {
    method: 'POST',
  });
}
