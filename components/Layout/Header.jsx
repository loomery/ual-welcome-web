'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UalLogo } from '../Icon/UalLogo';
import { ThemeToggle } from '../Theme/ThemeToggle';
import { NAV_ITEMS } from './navConfig';

/**
 * Top-of-page header. Logo links home; on desktop the primary nav is shown
 * inline. On mobile the same nav lives in the bottom tab bar instead.
 */
export function Header() {
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
    <header className="header">
      <div className="wrapper">
        <div className="cluster" data-justify="space-between">
          <Link href="/" className="header__link" aria-label="UAL Welcome Week — home">
            <UalLogo className="header__logo" />
            <p>Welcome Week</p>
          </Link>

          <div className="header__actions">
            <nav id="primary-nav" className="top-nav" aria-label="Primary">
              <ul className="top-nav__list" role="list">
                {NAV_ITEMS.map((item) => {
                  const active = isActive(item.to);
                  return (
                    <li key={item.to}>
                      <Link
                        href={item.to}
                        className="top-nav__link"
                        aria-current={active ? 'page' : undefined}
                        data-active={active ? '' : undefined}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
