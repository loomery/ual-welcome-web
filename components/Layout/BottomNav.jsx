'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from './navConfig';

/**
 * Mobile primary navigation — fixed bottom tab bar.
 * Hidden on >=792px (matches DS sidebar breakpoint 49.5rem).
 * Each link meets WCAG 2.5.8 Target Size (44x44 min).
 */
export function BottomNav() {
  const pathname = usePathname();

  /**
   * @param {string} to
   * @returns {boolean}
   */
  const isActive = (to) => {
    if (to === '/') return pathname === '/';
    return pathname === to || pathname.startsWith(`${to}/`);
  };

  return (
    <nav className="bottom-nav" aria-label="Primary mobile">
      <ul className="bottom-nav__list" role="list">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.to);
          return (
            <li key={item.to}>
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
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
