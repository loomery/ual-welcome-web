'use client';

import { useMemo } from 'react';
import { Countdown } from '../Countdown/Countdown';
import { COLLEGE_OPTIONS } from '../../data/onboardingOptions';
import { useOnboardingProfile } from '../../hooks/useOnboardingProfile';

/**
 * Welcome-week banner + greeting/college hero. Lives in the app shell so it
 * can appear on every page, in one of two layouts (per the Figma frames):
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
  const { profile } = useOnboardingProfile();

  const college = useMemo(
    () => COLLEGE_OPTIONS.find((c) => c.id === profile?.collegeId),
    [profile?.collegeId],
  );

  const firstName = (profile?.name ?? '').split(' ')[0] || 'there';
  const Title = variant === 'full' ? 'h1' : 'p';

  return (
    <div className="app-hero" data-variant={variant}>
      <Countdown />
      <section className="app-hero__band" aria-labelledby="app-hero-title">
        <div className="app-hero__inner flow" data-flow="2xs">
          <p className="app-hero__greeting">Hi, {firstName}</p>
          <Title id="app-hero-title" className="app-hero__title">
            {college?.name ?? 'Welcome to UAL'}
          </Title>
        </div>
      </section>
    </div>
  );
}
