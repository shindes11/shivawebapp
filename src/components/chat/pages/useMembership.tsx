import { useState, useEffect } from 'react';

interface Membership {
  firstName: string;
  lastName: string;
  createdAt: string;
  tenantId: string;
  userId: string;
}

export function useMembership() {
  const [oldestTenantId, setOldestTenantId] = useState<string | null>(null);
  const [oldestUserId, setOldestUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembershipData = async () => {
      try {
        const response = await fetch('/auth/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            accept: '*/*',
          },
        });

        if (response.ok) {
          const userData = await response.json();
          const memberships: Membership[] = userData.memberships;

          memberships.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          );

          const oldestMembership = memberships[0];

          if (oldestMembership) {
            setOldestTenantId(oldestMembership.tenantId);
            setOldestUserId(oldestMembership.userId);
          }
        } else {
          console.error('Failed to fetch user memberships');
        }
      } catch (error) {
        console.error('Error fetching membership data:', error);
      }
    };

    fetchMembershipData();
  }, []);

  return { oldestTenantId, oldestUserId };
}
