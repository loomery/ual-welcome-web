'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { COLLEGE_OPTIONS } from '../../data/onboardingOptions';
import { useOnboardingProfile } from '../../hooks/useOnboardingProfile';
import { isFocusedRoute } from '../../utils/isFocusedRoute';

/**
 * Greeting + college hero.
 *
 *  - Mobile: a static full-width black band that scrolls away.
 *  - Desktop: the SAME band, sticky beneath the top bar, keeping a constant
 *    height while collapsing HORIZONTALLY — its width animates from full-width
 *    to the sidebar width (anchored left) and the college name shrinks to
 *    match, folding into the compact sidebar box and revealing the main
 *    content to its right. The animation is triggered by a scroll threshold
 *    (`scrolled` flips once, like a toggle) and then plays start-to-finish on
 *    its own — it is NOT continuously tied to scroll position/distance.
 *
 * The college name is the page `<h1>` on the home route; a `<p>` elsewhere.
 * Hidden on focused routes (onboarding).
 *
 * @param {Object} props
 * @param {boolean} [props.scrolled]  Desktop only: snap to the collapsed size.
 */
export function AppHero({ scrolled = false }) {
  const pathname = usePathname();
  const isFocused = isFocusedRoute(pathname);
  const isHome = pathname === '/';
  const { profile, hydrated } = useOnboardingProfile();

  const college = useMemo(
    () => COLLEGE_OPTIONS.find((c) => c.id === profile?.collegeId),
    [profile?.collegeId],
  );
  const greeting = hydrated ? (profile?.name ? `Hi, ${profile.name.split(' ')[0]}` : 'Hi') : ' ';
  const collegeName = hydrated ? (college?.name ?? 'Welcome to UAL') : ' ';

  if (isFocused) return null;

  const Title = isHome ? 'h1' : 'p';
  return (
    <section
      className={[
        'bg-ual-dark text-ual-light md:sticky md:top-12 md:z-20 md:h-44 md:overflow-hidden md:transition-[width] md:duration-300 md:ease-ual motion-reduce:md:transition-none',
        scrolled ? 'md:w-72' : 'md:w-[100cqw]',
      ].join(' ')}
      aria-labelledby="app-hero-title"
    >
      <div className="flex h-full flex-col justify-center gap-1 px-(--grid-gutter) py-8 md:py-6">
        <p className="m-0 text-step-0 text-ual-dark-90">{greeting}</p>
        <Title
          id="app-hero-title"
          className={[
            'm-0 max-w-[20ch] font-ual-bold tracking-ual-tight text-ual-light md:max-w-none md:transition-[font-size] md:duration-300 md:ease-ual motion-reduce:md:transition-none',
            scrolled ? 'text-step-2/ual-single' : 'text-step-4/ual-single',
          ].join(' ')}
        >
          {collegeName}
        </Title>
      </div>
    </section>
  );
}
