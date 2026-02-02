import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthProvider } from '@/contexts/AuthContext';

import { UserButton } from './UserButton';

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock fetch
globalThis.fetch = vi.fn();

describe('UserButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithAuth = (component: React.ReactNode) => {
    return render(<AuthProvider>{component}</AuthProvider>);
  };

  it('should show placeholder when no user is logged in', async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });

    renderWithAuth(<UserButton />);

    await waitFor(() => {
      expect(screen.getByText('User')).toBeInTheDocument();
    });
  });

  it('should display user initials and name when logged in', async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        user: {
          user_id: '123',
          email: 'john.smith@example.com',
          full_name: 'John Smith',
          verification_level: 'L2_OrgVerified',
          two_factor_enabled: true,
        },
      }),
    });

    renderWithAuth(<UserButton />);

    await waitFor(() => {
      expect(screen.getByText('JS')).toBeInTheDocument();
      expect(screen.getByText('John Smith')).toBeInTheDocument();
    });
  });

  it('should show email initials when no full name', async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        user: {
          user_id: '123',
          email: 'test@example.com',
          verification_level: 'L1_EmailVerified',
          two_factor_enabled: false,
        },
      }),
    });

    renderWithAuth(<UserButton />);

    await waitFor(() => {
      expect(screen.getByText('TE')).toBeInTheDocument();
    });
  });

  it('should open dropdown menu on click', async () => {
    const user = userEvent.setup();

    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        user: {
          user_id: '123',
          email: 'john.smith@example.com',
          full_name: 'John Smith',
          verification_level: 'L2_OrgVerified',
          two_factor_enabled: true,
        },
      }),
    });

    renderWithAuth(<UserButton />);

    await waitFor(() => {
      expect(screen.getByText('John Smith')).toBeInTheDocument();
    });

    const button = screen.getByText('John Smith').closest('button');
    if (button) {
      await user.click(button);
    }

    await waitFor(() => {
      expect(screen.getByText('Profile')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Sign out')).toBeInTheDocument();
    });
  });

  it('should show 2FA indicator when enabled', async () => {
    const user = userEvent.setup();

    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        user: {
          user_id: '123',
          email: 'test@example.com',
          full_name: 'Test User',
          verification_level: 'L2_OrgVerified',
          two_factor_enabled: true,
        },
      }),
    });

    renderWithAuth(<UserButton />);

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    const button = screen.getByText('Test User').closest('button');
    if (button) {
      await user.click(button);
    }

    await waitFor(() => {
      expect(screen.getByText(/Security.*2FA Enabled/)).toBeInTheDocument();
    });
  });

  it('should call logout and redirect on sign out', async () => {
    const user = userEvent.setup();

    (globalThis.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          user: {
            user_id: '123',
            email: 'test@example.com',
            full_name: 'Test User',
            verification_level: 'L1_EmailVerified',
            two_factor_enabled: false,
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

    renderWithAuth(<UserButton />);

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    const button = screen.getByText('Test User').closest('button');
    if (button) {
      await user.click(button);
    }

    await waitFor(() => {
      expect(screen.getByText('Sign out')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Sign out'));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/sign-in');
    });
  });

  it('should display verification level', async () => {
    const user = userEvent.setup();

    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        user: {
          user_id: '123',
          email: 'test@example.com',
          full_name: 'Test User',
          verification_level: 'L2_OrgVerified',
          two_factor_enabled: false,
        },
      }),
    });

    renderWithAuth(<UserButton />);

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    const button = screen.getByText('Test User').closest('button');
    if (button) {
      await user.click(button);
    }

    await waitFor(() => {
      expect(screen.getByText('L2 OrgVerified')).toBeInTheDocument();
    });
  });
});
