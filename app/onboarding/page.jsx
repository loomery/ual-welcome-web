'use client';

import { useEffect } from 'react';
import { OnboardingFlow } from '../../components/Onboarding/OnboardingFlow';

/**
 * Onboarding entry point. Client-rendered because the flow reads/writes
 * localStorage and uses next/navigation's router. The dashboard route
 * gates on the profile state written here.
 *
 * On mount we tag <body> with data-onboarding so globals.css can hide
 * the AppShell chrome (header / footer / feedback button) for the
 * duration of the flow — this gives the focused, full-viewport feel
 * that onboarding wants without restructuring the root layout.
 */
export default function OnboardingPage() {
  useEffect(() => {
    document.body.dataset.onboarding = '';
    return () => {
      delete document.body.dataset.onboarding;
    };
  }, []);

  return <OnboardingFlow />;
}
