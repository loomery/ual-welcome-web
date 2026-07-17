'use client';

import { visibleExploreLanding } from '../../data/explore';
import { useOnboardingProfile } from '../../hooks/useOnboardingProfile';
import { TopicLandingScreen } from '../../components/Topic/TopicLandingScreen';

/**
 * "Explore" (/explore) — the hub for everything beyond your course: grids of
 * service cards grouped by theme (Moving to the UK, Finance, Health and
 * wellbeing, Student life, Safety), cohort-gated by student type.
 */
export function ExploreScreen() {
  const { profile } = useOnboardingProfile();

  return (
    <TopicLandingScreen
      title="Explore"
      intro="Everything beyond your course — settling into the UK, your finances, health and wellbeing, student life and staying safe."
      groups={visibleExploreLanding(profile?.studentType)}
    />
  );
}
