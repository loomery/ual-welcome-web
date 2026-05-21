'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UalLogo } from '../Icon/UalLogo';
import { ThemeToggle } from '../Theme/ThemeToggle';
import { NAV_ITEMS } from './navConfig';
import { COLLEGE_OPTIONS } from '../../data/onboardingOptions';
import { useOnboardingProfile } from '../../hooks/useOnboardingProfile';

/**
 * Desktop sidebar navigation. Visible only at ≥49.5rem (same breakpoint
 * at which the mobile bottom nav hides). Fixed to the left edge of the
 * viewport, full height, with the UAL logo at the top, nav items in
 * the middle, and the student's college at the bottom once they've
 * completed onboarding.
 *
 * Active state: filled dark background + light text — mirrors the Figma
 * design and the existing bottom-nav active style.
 */
export function SideNav() {
  const pathname = usePathname();
  const { profile } = useOnboardingProfile();

  const college = COLLEGE_OPTIONS.find((c) => c.id === profile?.collegeId);

  /**
   * @param {string | undefined} to
   * @returns {boolean}
   */
  const isActive = (to) => {
    if (!to) return false;
    if (to === '/') return pathname === '/';
    return pathname === to || pathname.startsWith(`${to}/`);
  };

  return (
    <nav className="side-nav" aria-label="Primary desktop">
      {/* Branding — UAL logo only, no lock-up wordmark below
          (the brand brief explicitly excluded "UAL <product name>"
          locked-up logos). */}
      <div className="side-nav__brand">
        <Link href="/" aria-label="UAL — home" className="side-nav__logo-link">
          <UalLogo className="side-nav__logo" aria-hidden="true" />
        </Link>
      </div>

      {/* Nav items */}
      <ul className="side-nav__list" role="list">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.to);
          const isExternal = Boolean(item.href);

          return (
            <li key={item.href ?? item.to}>
              {isExternal ? (
                <a href={item.href} className="side-nav__link" target="_blank" rel="noreferrer">
                  <span>{item.label}</span>
                  <span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              ) : (
                <Link
                  href={item.to}
                  className="side-nav__link"
                  aria-current={active ? 'page' : undefined}
                  data-active={active || undefined}
                >
                  <span>{item.label}</span>
                  {active && <span className="visually-hidden">(current page)</span>}
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      {/* Footer: college chip + theme toggle, stacked */}
      <div className="side-nav__footer">
        {college && (
          <div className="side-nav__college-chip">
            <span className="side-nav__college-short">{college.short}</span>
            <span className="side-nav__college-area">{college.area}</span>
          </div>
        )}
        <div className="side-nav__footer-actions">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
