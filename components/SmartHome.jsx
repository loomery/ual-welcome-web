'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardScreen } from './Dashboard/DashboardScreen';
import { useOnboardingProfile } from '../hooks/useOnboardingProfile';

/**
 * Smart home — renders the personalised dashboard when the student has
 * completed onboarding, otherwise redirects to /onboarding so first-run
 * users land straight in the setup flow with no chrome around them.
 *
 * Waits for localStorage hydration before deciding so there's no flash
 * of the wrong screen and no premature redirect on a returning user.
 */
export function SmartHome() {
  const router = useRouter();
  const { isComplete, hydrated } = useOnboardingProfile();

  useEffect(() => {
    if (hydrated && !isComplete) {
      router.replace('/onboarding');
    }
  }, [hydrated, isComplete, router]);

  // Render nothing until we know the state — and while the redirect is
  // taking effect for users without a saved profile.
  if (!hydrated || !isComplete) return null;

  return <DashboardScreen />;
}
