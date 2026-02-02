'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useAuth } from '@/hooks/useAuth';

export default function SignInPage() {
  const router = useRouter();
  const { login, error } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [userId, setUserId] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorMethod, setTwoFactorMethod] = useState('');
  const { verify2FA } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(email, password);

      if (result.success && result.two_factor_required) {
        // Show 2FA form
        setTwoFactorRequired(true);
        setUserId(result.user_id || '');
        setTwoFactorMethod(result.two_factor_method || '');
      } else if (result.success) {
        // Login successful, redirect to dashboard
        router.push('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const handle2FAVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await verify2FA(userId, twoFactorCode);

      if (success) {
        router.push('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  if (twoFactorRequired) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 shadow-lg">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Two-Factor Authentication</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your
              {' '}
              {twoFactorMethod === 'totp' ? 'authenticator app' : 'SMS'}
              {' '}
              code
            </p>
          </div>

          <form onSubmit={handle2FAVerification} className="mt-8 space-y-6">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="code" className="block text-sm font-medium">
                Verification Code
              </label>
              <input
                id="code"
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="000000"
                value={twoFactorCode}
                onChange={e => setTwoFactorCode(e.target.value)}
                maxLength={6}
                pattern="[0-9]{6}"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Sign in to AlignHealthcare.ai</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?
            {' '}
            <a href="/sign-up" className="font-medium text-primary hover:underline">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
