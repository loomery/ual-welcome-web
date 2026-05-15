'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from './navConfig';

/**
 * Mobile primary navigation — fixed bottom tab bar.
 * Hidden on >=49.5rem (same breakpoint as the desktop SideNav appears).
 * Each link meets WCAG 2.5.8 Target Size (44x44 min).
 *
 * Handles both internal routes (item.to) and external links (item.href).
 * External items are never marked active.
 */
export function BottomNav() {
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
    <nav className="bottom-nav" aria-label="Primary mobile">
      <ul className="bottom-nav__list" role="list">
        {NAV_ITEMS.map((item) => {
          const isExternal = Boolean(item.href);
          const active = isActive(item.to);
          const key = item.href ?? item.to;

          return (
            <li key={key}>
              {isExternal ? (
                <a
                  href={item.href}
                  className="bottom-nav__link"
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${item.label} (opens in a new tab)`}
                >
                  <item.Icon className="bottom-nav__icon" aria-hidden="true" />
                  <span>{item.label}</span>
                </a>
              ) : (
                <Link
                  href={item.to}
                  className="bottom-nav__link"
                  aria-current={active ? 'page' : undefined}
                  data-active={active ? '' : undefined}
                >
                  <item.Icon className="bottom-nav__icon" aria-hidden="true" />
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
