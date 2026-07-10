'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { COLLEGE_OPTIONS } from '../../data/onboardingOptions';
import { useOnboardingProfile } from '../../hooks/useOnboardingProfile';
import { isFocusedRoute } from '../../utils/isFocusedRoute';

/**
 * Welcome-week banner + greeting/college hero. Lives in the app shell so it
 * can appear on every page, in one of two layouts:
 *
 *  - `full`    — a full-width band beneath the header (home page). The college
 *                name is the page `<h1>`.
 *  - `compact` — a narrow black box at the top of the left sidebar column
 *                (every other page). Here the page keeps its own `<h1>`, so the
 *                college name renders as a `<p>` to avoid a second top heading.
 *
 * @param {Object} props
 * @param {'full' | 'compact'} [props.variant]
 */
export function AppHero({ variant = 'full' }) {
  const pathname = usePathname();
  const isOnboarding = isFocusedRoute(pathname);
  const { profile, hydrated } = useOnboardingProfile();

  const college = useMemo(
    () => COLLEGE_OPTIONS.find((c) => c.id === profile?.collegeId),
    [profile?.collegeId],
  );

  const firstName = (profile?.name ?? '').split(' ')[0];
  const greeting = firstName ? `Hi, ${firstName}` : 'Hi';
  const isFull = variant === 'full';
  const Title = isFull ? 'h1' : 'p';

  // Compact variant is hidden on mobile (no sidebar column there) and shown
  // from 49.5rem up. Onboarding hides the hero entirely in both variants.
  const wrapperClass = isOnboarding ? 'hidden' : isFull ? '' : 'hidden md:block';

  const innerClass = isFull ? 'px-[var(--grid-gutter)] pt-8 pb-16 space-y-2' : 'md:p-6 space-y-2';

  const greetingClass = isFull
    ? 'm-0 text-step-0 text-ual-dark-90'
    : 'm-0 text-ual-dark-90 md:text-step-d1';

  const titleClass = isFull
    ? 'text-step-4 tracking-ual-tight leading-ual-single text-ual-light max-w-[20ch]'
    : 'tracking-ual-tight leading-ual-single text-ual-light md:text-step-2 md:max-w-[12ch]';

  return (
    <div className={wrapperClass}>
      <section className="bg-ual-dark text-ual-light" aria-labelledby="app-hero-title">
        <div className={innerClass}>
          <p className={greetingClass}>{hydrated ? greeting : ' '}</p>
          <Title id="app-hero-title" className={titleClass}>
            {hydrated ? (college?.name ?? 'Welcome to UAL') : ' '}
          </Title>
        </div>
      </section>
    </div>
  );
}
