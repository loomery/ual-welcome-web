'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SIDE_NAV_ITEMS } from './navConfig';

/**
 * Desktop side navigation. Visible only at ≥49.5rem (the same breakpoint at
 * which the mobile bottom nav hides). It sits in the left column of the app
 * body on a grey panel, beneath the black top bar, and lists the product nav
 * (Home / Tasks / Events / Map / Settings / Help).
 *
 * Branding lives in the top bar now, so the sidebar carries no logo; the
 * theme toggle was retired with the single-theme redesign.
 *
 * Active state: bold text with a golden left rule that runs the full height
 * of the item — mirrors the Figma design.
 */
export function SideNav() {
  const pathname = usePathname();

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
      <ul className="side-nav__list" role="list">
        {SIDE_NAV_ITEMS.map((item) => {
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
    </nav>
  );
}
