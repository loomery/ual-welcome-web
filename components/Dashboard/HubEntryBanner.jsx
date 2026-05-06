'use client';

import Link from 'next/link';
import { useSyncExternalStore } from 'react';
import { ArrowRightIcon } from '../Icon/NavIcons';
import { useOnboardingProfile } from '../../hooks/useOnboardingProfile';
import { COLLEGE_OPTIONS } from '../../data/onboardingOptions';

/**
 * Entry point on the home page that links to the personalised hub.
 *
 * Uses DS-native ingredients only (`flow` + `card` foundation, `.tag`
 * pill for the eyebrow, the same orange `border-inline-start` accent
 * used elsewhere on highlighted states like `.checklist-item__blocked-hint`).
 * Sits on a subtle `--color-shade` fill so it reads as a single
 * "highlighted" surface among the home's content sections, without
 * inventing new shadows, borders, or scales.
 *
 * Hydration-safe: localStorage is empty server-side, so we render the
 * "New" invitation on the server and on the client's first paint, then
 * swap to the personalised version once hydrated. Same pattern as the
 * /dashboard route's hydration gate.
 */
export function HubEntryBanner() {
  const { profile, isComplete } = useOnboardingProfile();
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const college = COLLEGE_OPTIONS.find((c) => c.id === profile?.collegeId);
  const showPersonal = hydrated && isComplete;
  const firstName = (profile?.name ?? '').split(' ')[0];

  const eyebrow = showPersonal ? 'Your hub' : 'New';
  const title = showPersonal
    ? firstName
      ? `Welcome back, ${firstName}`
      : 'Open your hub'
    : 'Set up your personalised hub';
  const body = showPersonal
    ? college
      ? `${college.short} · ${college.area}. See your next step, events, and checklist.`
      : 'See your next step, events, and checklist.'
    : "Four quick questions and we'll tailor your Welcome Week to you.";

  return (
    <Link
      href={showPersonal ? '/dashboard' : '/onboarding'}
      className="flow card hub-entry-banner"
      data-flow="s"
    >
      <span className="tag" data-tag-type="notice">
        {eyebrow}
      </span>
      <h3>{title}</h3>
      <p>{body}</p>
      <ArrowRightIcon aria-hidden="true" />

      <style>{`
        .hub-entry-banner {
          background: var(--color-shade);
          border-inline-start: 4px solid var(--color-orange);
          padding: var(--space-s) var(--space-m);
          transition: background-color 150ms ease;
          color: inherit;
          text-decoration: none;
        }
        .hub-entry-banner:hover,
        .hub-entry-banner:focus-visible {
          background: var(--color-dark--tint-90);
        }
        .hub-entry-banner:focus-visible {
          outline: 2px solid var(--color-orange);
          outline-offset: 2px;
        }
        .hub-entry-banner h3 {
          font-size: var(--step-1);
          letter-spacing: var(--letter-spacing-tight);
          line-height: var(--line-height-condensed);
        }
        .hub-entry-banner > svg {
          align-self: end;
        }
      `}</style>
    </Link>
  );
}
