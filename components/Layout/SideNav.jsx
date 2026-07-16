'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isFocusedRoute } from '../../utils/isFocusedRoute';
import { NAV_ITEMS, MENU_SECONDARY } from './navConfig';
import { ExternalLinkIcon } from '../Icon/NavIcons';

export function SideNav() {
  const pathname = usePathname();
  const isOnboarding = isFocusedRoute(pathname);

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
    <nav
      className={
        isOnboarding
          ? 'hidden'
          : // Sticks just below the fixed header (3rem). The hero above it is
            // static and scrolls away, so the nav pins under the top bar.
            'hidden bg-ual-shade md:sticky md:top-12 md:flex md:min-h-[calc(100dvh-3rem)] md:flex-col'
      }
      aria-label="Primary desktop"
    >
      <ul className="m-0 flex list-none flex-col gap-1 px-0 py-6" role="list">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.to);
          const isExternal = Boolean(item.href);

          const linkClass =
            'flex flex-1 items-center gap-3 min-h-15 px-6 py-3 text-step-1 leading-ual-condensed font-ual-normal text-ual-dark no-underline transition-[color] duration-100 not-aria-[current=page]:hover:text-ual-orange aria-[current=page]:font-ual-bold aria-[current=page]:text-ual-dark aria-[current=page]:hover:text-ual-dark aria-[current=page]:focus:text-ual-dark focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ual-orange';

          return (
            <li className="flex" key={item.href ?? item.to}>
              {isExternal ? (
                <a href={item.href} className={linkClass} target="_blank" rel="noreferrer">
                  <span>{item.label}</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                <Link
                  href={item.to}
                  className={linkClass}
                  aria-current={active ? 'page' : undefined}
                >
                  <span>{item.label}</span>
                  {active && <span className="sr-only">(current page)</span>}
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      <hr className="mx-6 my-2 border-t border-ual-dark/10" />

      <ul className="m-0 flex list-none flex-col gap-1 px-0 py-6" role="list">
        {MENU_SECONDARY.map((item) => {
          const isExternal = Boolean(item.href);
          const linkClass =
            'flex min-h-11 flex-1 items-center gap-2 px-6 py-2 text-step-d1 text-ual-dark no-underline transition-[color] duration-100 hover:text-ual-orange focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ual-orange';
          return (
            <li className="flex" key={item.label}>
              {isExternal ? (
                <a href={item.href} target="_blank" rel="noreferrer" className={linkClass}>
                  <span>{item.label}</span>
                  <ExternalLinkIcon aria-hidden="true" width={16} height={16} />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                <Link href={item.to} className={linkClass}>
                  <span>{item.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
