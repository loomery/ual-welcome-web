'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardScreen } from '../../components/Dashboard/DashboardScreen';
import { useOnboardingProfile } from '../../hooks/useOnboardingProfile';

/**
 * Personalised hub. Gates on whether the student has completed
 * onboarding. If not, sends them to /onboarding to set up.
 *
 * Hydration-safe: localStorage is empty server-side, so we wait for
 * the client to read it before deciding whether to redirect — otherwise
 * we'd flash the dashboard for one frame on first paint.
 */
export default function DashboardPage() {
  const router = useRouter();
  const { isComplete } = useOnboardingProfile();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !isComplete) {
      router.replace('/onboarding');
    }
  }, [hydrated, isComplete, router]);

  if (!hydrated || !isComplete) {
    return (
      <div className="mx-auto flex min-h-[40vh] w-full max-w-2xl items-center justify-center px-4 py-8">
        <p className="text-step-d1 text-ual-dark-50">Loading your hub…</p>
      </div>
    );
  }

  return <DashboardScreen />;
}
