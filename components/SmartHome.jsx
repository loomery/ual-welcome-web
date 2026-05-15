'use client';

import { DashboardScreen } from './Dashboard/DashboardScreen';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { useOnboardingProfile } from '../hooks/useOnboardingProfile';

/**
 * Smart home — renders the personalised dashboard when the student has
 * completed onboarding, or the generic HomeScreen otherwise.
 *
 * Waits for localStorage hydration before deciding which to show so
 * there's no flash of the wrong screen.
 */
export function SmartHome() {
  const { isComplete, hydrated } = useOnboardingProfile();

  // Show nothing until we know which state we're in.
  if (!hydrated) return null;

  if (isComplete) return <DashboardScreen />;
  return <HomeScreen />;
}
