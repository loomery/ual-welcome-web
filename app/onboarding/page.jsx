'use client';

import { OnboardingFlow } from '../../components/Onboarding/OnboardingFlow';

/**
 * Onboarding entry point. Client-rendered because the flow reads/writes
 * localStorage and uses next/navigation's router. The dashboard route
 * gates on the profile state written here.
 */
export default function OnboardingPage() {
  return <OnboardingFlow />;
}
