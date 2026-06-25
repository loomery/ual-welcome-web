'use client';

import { useEffect } from 'react';
import { OnboardingFlow } from '../../components/Onboarding/OnboardingFlow';

export default function OnboardingPage() {
  useEffect(() => {
    document.body.dataset.onboarding = '';
    return () => {
      delete document.body.dataset.onboarding;
    };
  }, []);

  return <OnboardingFlow />;
}
