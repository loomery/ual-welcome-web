'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { COLLEGE_OPTIONS } from '../../data/onboardingOptions';
import { useOnboardingProfile } from '../../hooks/useOnboardingProfile';
import { isFocusedRoute } from '../../utils/isFocusedRoute';

/**
 * Greeting + college hero — a static black band.
 *
 *  - Mobile: a full-width band at the top of the page that scrolls away.
 *  - Desktop: a static fixed-width block at the top of the left sidebar
 *    column that scrolls away (the sticky nav below it pins under the top
 *    bar). No width/size animation.
 *
 * The college name is greeting text (a `<p>`); the page `<h1>` lives in the
 * screen body. Hidden on focused routes (onboarding).
 */
export function AppHero() {
  const pathname = usePathname();
  const isFocused = isFocusedRoute(pathname);
  const { profile, hydrated } = useOnboardingProfile();

  const college = useMemo(
    () => COLLEGE_OPTIONS.find((c) => c.id === profile?.collegeId),
    [profile?.collegeId],
  );
  const greeting = hydrated ? (profile?.name ? `Hi, ${profile.name.split(' ')[0]}` : 'Hi') : ' ';
  const collegeName = hydrated ? (college?.name ?? 'Welcome to UAL') : ' ';

  if (isFocused) return null;

  return (
    <section
      className="bg-ual-dark text-ual-light md:h-44 md:overflow-hidden"
      aria-labelledby="app-hero-title"
    >
      <div className="flex h-full flex-col justify-center gap-1 px-(--grid-gutter) py-8 md:py-6 md:pl-6">
        <p className="m-0 text-step-0 text-ual-dark-90">{greeting}</p>
        <p
          id="app-hero-title"
          className="m-0 max-w-[20ch] text-step-4/ual-single font-ual-bold tracking-ual-tight text-ual-light md:max-w-none md:text-step-2/ual-single"
        >
          {collegeName}
        </p>
      </div>
    </section>
  );
}
