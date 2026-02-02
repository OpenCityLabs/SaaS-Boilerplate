'use client';

import { useAuth } from '@/hooks/useAuth';

export function OrganizationSwitcher() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="px-3 py-1 text-sm text-muted-foreground">
        Organization
      </div>
    );
  }

  // For now, just display the organization name
  // TODO: Add dropdown for switching between organizations
  return (
    <div className="flex items-center gap-2 rounded-md px-3 py-1 hover:bg-accent">
      {user.organization_name
        ? (
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {user.organization_name}
              </span>
              <span className="text-xs text-muted-foreground">
                {user.verification_level?.includes('Org') ? 'Verified' : 'Unverified'}
              </span>
            </div>
          )
        : (
            <span className="text-sm text-muted-foreground">
              No Organization
            </span>
          )}
    </div>
  );
}
