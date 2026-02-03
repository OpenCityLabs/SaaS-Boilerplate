'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function WaitlistPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    role: '',
    useCase: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/waitlist/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to join waitlist');
        return;
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/20 px-4">
        <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 shadow-lg">
          <div className="text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100">
              <svg
                className="size-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-green-600">
              You're on the Waitlist!
            </h2>
            <p className="mt-4 text-muted-foreground">
              Thank you for joining the AlignHealthcare.ai waitlist!
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              We'll send you an email with next steps. The first 100 signups get a free account!
            </p>
          </div>

          <div className="space-y-4">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Back to Home
            </button>

            <div className="rounded-md bg-muted p-4">
              <h3 className="mb-2 font-medium">What's Next?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1">📧</span>
                  <span>Check your email for a welcome message</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">🎉</span>
                  <span>If you're in the first 100, you'll get early access</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">🚀</span>
                  <span>We'll notify you when your account is ready</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/20 px-4 py-12">
      <div className="w-full max-w-2xl space-y-8 rounded-lg border bg-card p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Join the Waitlist</h1>
          <p className="mt-2 text-muted-foreground">
            Be among the first to experience AlignHealthcare.ai
          </p>
          <p className="mt-1 text-sm font-medium text-[#00A651]">
            ✨ First 100 signups get a FREE account!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium">
                First Name
                {' '}
                <span className="text-destructive">*</span>
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="John"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium">
                Last Name
                {' '}
                <span className="text-destructive">*</span>
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Smith"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Work Email
              {' '}
              <span className="text-destructive">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="you@company.com"
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium">
              Company / Organization
              {' '}
              <span className="text-destructive">*</span>
            </label>
            <input
              id="company"
              name="company"
              type="text"
              required
              value={formData.company}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Acme Healthcare"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium">
              Your Role
              {' '}
              <span className="text-destructive">*</span>
            </label>
            <select
              id="role"
              name="role"
              required
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Select your role</option>
              <option value="healthcare_provider">Healthcare Provider</option>
              <option value="data_scientist">Data Scientist / ML Engineer</option>
              <option value="software_engineer">Software Engineer</option>
              <option value="product_manager">Product Manager</option>
              <option value="executive">Executive / Leadership</option>
              <option value="researcher">Researcher / Academic</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="useCase" className="block text-sm font-medium">
              What do you want to build?
              {' '}
              <span className="text-muted-foreground">(Optional)</span>
            </label>
            <textarea
              id="useCase"
              name="useCase"
              rows={3}
              value={formData.useCase}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Tell us about your use case (e.g., clinical documentation, care plan generation, risk assessment...)"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[#00A651] px-4 py-3 text-base font-medium text-white shadow transition-colors hover:bg-[#008F45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Joining...' : 'Join the Waitlist'}
          </button>

          <p className="text-center text-xs text-muted-foreground">
            By joining, you agree to our
            {' '}
            <a href="/terms-of-service" className="underline hover:text-foreground">
              Terms of Service
            </a>
            {' '}
            and
            {' '}
            <a href="/privacy-policy" className="underline hover:text-foreground">
              Privacy Policy
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
