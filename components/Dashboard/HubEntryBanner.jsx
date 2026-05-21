import Link from 'next/link';
import { ArrowRightIcon } from '../Icon/NavIcons';

/**
 * Entry point shown on the generic HomeScreen (non-personalised state).
 * Invites the student to set up their personalised hub via onboarding.
 *
 * Once onboarding is complete, SmartHome renders DashboardScreen instead
 * of HomeScreen, so this banner is never shown in the personalised state.
 */
export function HubEntryBanner() {
  return (
    <Link href="/onboarding" className="flow card hub-entry-banner" data-flow="s">
      <span className="tag" data-tag-type="notice">
        New
      </span>
      <h3>Set up your personalised hub</h3>
      <p>Four quick questions and we&apos;ll tailor your Welcome Week to you.</p>
      <ArrowRightIcon aria-hidden="true" />

      <style>{`
        .hub-entry-banner {
          background: var(--color-shade);
          border-inline-start: 4px solid var(--color-dark);
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
