'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UalLogo } from '../Icon/UalLogo';
import { NAV_ITEMS } from './navConfig';
import { COLLEGE_OPTIONS } from '../../data/onboardingOptions';
import { useOnboardingProfile } from '../../hooks/useOnboardingProfile';

/**
 * Desktop sidebar navigation. Visible only at ≥49.5rem (same breakpoint
 * at which the mobile bottom nav hides). Fixed to the left edge of the
 * viewport, full height, with the UAL logo + "Student Centre" branding
 * at the top, nav items in the middle, and the student's college at the
 * bottom once they've completed onboarding.
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
      {/* Branding */}
      <div className="side-nav__brand">
        <Link href="/" aria-label="UAL Student Centre — home" className="side-nav__logo-link">
          <UalLogo className="side-nav__logo" aria-hidden="true" />
          <span className="side-nav__brand-label">Student Centre</span>
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
                <a
                  href={item.href}
                  className="side-nav__link"
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${item.label} (opens in a new tab)`}
                >
                  <item.Icon className="side-nav__icon" aria-hidden="true" />
                  <span>{item.label}</span>
                </a>
              ) : (
                <Link
                  href={item.to}
                  className="side-nav__link"
                  aria-current={active ? 'page' : undefined}
                  data-active={active || undefined}
                >
                  <item.Icon className="side-nav__icon" aria-hidden="true" />
                  <span>{item.label}</span>
                  {active && <span className="visually-hidden">(current page)</span>}
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      {/* College name — shown once onboarding is complete */}
      {college && (
        <div className="side-nav__footer">
          <span className="side-nav__college">{college.name}</span>
        </div>
      )}
    </nav>
  );
}
