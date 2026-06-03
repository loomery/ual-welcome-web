'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PRIMARY_NAV_ITEMS, SECONDARY_NAV_ITEMS } from './navConfig';
import { MenuIcon } from '../Icon/NavIcons';
import { NavSheet } from './NavSheet';

/**
 * Mobile primary navigation — fixed bottom tab bar.
 * Hidden on >=49.5rem (same breakpoint as the desktop SideNav appears).
 *
 * Only the handful of `primary` destinations live in the bar (thumb zone,
 * always visible); everything else is reached through the "More" sheet, which
 * is the scalable bucket. This keeps the bar at the recommended 3–5 cells no
 * matter how many destinations the app grows to.
 *
 * Each target meets WCAG 2.5.8 Target Size (44x44 min). Handles both internal
 * routes (item.to) and external links (item.href); external items are never
 * marked active.
 */
export function BottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  /**
   * @param {string | undefined} to
   * @returns {boolean}
   */
  const isActive = (to) => {
    if (!to) return false;
    if (to === '/') return pathname === '/';
    return pathname === to || pathname.startsWith(`${to}/`);
  };

  // Highlight "More" when the current route lives in the overflow sheet, so
  // the bar still reflects where you are.
  const moreActive = SECONDARY_NAV_ITEMS.some((item) => isActive(item.to));
  const hasOverflow = SECONDARY_NAV_ITEMS.length > 0;

  return (
    <>
      <nav className="bottom-nav" aria-label="Primary mobile">
        <ul className="bottom-nav__list" role="list">
          {PRIMARY_NAV_ITEMS.map((item) => {
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

          {hasOverflow && (
            <li>
              <button
                type="button"
                className="bottom-nav__link"
                onClick={() => setMoreOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={moreOpen}
                data-active={moreActive ? '' : undefined}
              >
                <MenuIcon className="bottom-nav__icon" aria-hidden="true" />
                <span>More</span>
              </button>
            </li>
          )}
        </ul>
      </nav>

      {hasOverflow && (
        <NavSheet open={moreOpen} onClose={() => setMoreOpen(false)} items={SECONDARY_NAV_ITEMS} />
      )}
    </>
  );
}
