import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthProvider } from '@/contexts/AuthContext';

import { OrganizationSwitcher } from './OrganizationSwitcher';

// Mock fetch
globalThis.fetch = vi.fn();

describe('OrganizationSwitcher', () => {
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

    renderWithAuth(<OrganizationSwitcher />);

    await waitFor(() => {
      expect(screen.getByText('Organization')).toBeInTheDocument();
    });
  });

  it('should display organization name when available', async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        user: {
          user_id: '123',
          email: 'test@example.com',
          organization_name: 'Mayo Clinic',
          verification_level: 'L2_OrgVerified',
          two_factor_enabled: false,
        },
      }),
    });

    renderWithAuth(<OrganizationSwitcher />);

    await waitFor(() => {
      expect(screen.getByText('Mayo Clinic')).toBeInTheDocument();
    });
  });

  it('should show verified status for verified organizations', async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        user: {
          user_id: '123',
          email: 'test@example.com',
          organization_name: 'Test Organization',
          verification_level: 'L2_OrgVerified',
          two_factor_enabled: false,
        },
      }),
    });

    renderWithAuth(<OrganizationSwitcher />);

    await waitFor(() => {
      expect(screen.getByText('Test Organization')).toBeInTheDocument();
      expect(screen.getByText('Verified')).toBeInTheDocument();
    });
  });

  it('should show unverified status for unverified organizations', async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        user: {
          user_id: '123',
          email: 'test@example.com',
          organization_name: 'Unverified Company',
          verification_level: 'L1_EmailVerified',
          two_factor_enabled: false,
        },
      }),
    });

    renderWithAuth(<OrganizationSwitcher />);

    await waitFor(() => {
      expect(screen.getByText('Unverified Company')).toBeInTheDocument();
      expect(screen.getByText('Unverified')).toBeInTheDocument();
    });
  });

  it('should show no organization when not set', async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        user: {
          user_id: '123',
          email: 'test@example.com',
          verification_level: 'L0_Unverified',
          two_factor_enabled: false,
        },
      }),
    });

    renderWithAuth(<OrganizationSwitcher />);

    await waitFor(() => {
      expect(screen.getByText('No Organization')).toBeInTheDocument();
    });
  });
});
