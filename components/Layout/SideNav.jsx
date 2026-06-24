'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SIDE_NAV_ITEMS } from './navConfig';

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
    <nav
      className="hidden bg-ual-shade md:sticky md:top-[calc(var(--space-xs)*2+var(--space-m))] md:flex md:min-h-[calc(100dvh-(var(--space-xs)*2+var(--space-m)))] md:flex-col md:pt-l [body[data-onboarding]_&]:hidden"
      aria-label="Primary desktop"
    >
      <ul className="m-0 flex grow list-none flex-col gap-3xs px-0 py-m" role="list">
        {SIDE_NAV_ITEMS.map((item) => {
          const active = isActive(item.to);
          const isExternal = Boolean(item.href);

          const linkClass =
            'flex flex-1 items-center gap-xs min-h-15 px-m py-xs text-step-1 leading-ual-condensed font-ual-normal text-ual-dark no-underline transition-[color] duration-100 not-aria-[current=page]:hover:text-ual-orange aria-[current=page]:font-ual-bold aria-[current=page]:text-ual-dark aria-[current=page]:hover:text-ual-dark aria-[current=page]:focus:text-ual-dark focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ual-orange';

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
    </nav>
  );
}
