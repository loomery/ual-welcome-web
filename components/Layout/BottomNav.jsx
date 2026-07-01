'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isOnboardingRoute } from '../../utils/isOnboardingRoute';
import { NAV_ITEMS } from './navConfig';

export function BottomNav() {
  const pathname = usePathname();
  const isOnboarding = isOnboardingRoute(pathname);

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
          : 'fixed inset-x-0 bottom-0 z-10 border-t border-ual-dark bg-ual-light py-2 pb-[max(var(--space-2xs),env(safe-area-inset-bottom))] md:hidden'
      }
      aria-label="Primary mobile"
    >
      <ul className="m-0 flex list-none justify-around p-0" role="list">
        {NAV_ITEMS.map((item) => {
          const isExternal = Boolean(item.href);
          const active = isActive(item.to);
          const key = item.href ?? item.to;

          const linkClass =
            'flex min-h-11 min-w-11 flex-col items-center justify-center gap-1 p-2 text-step-d1 text-ual-medium no-underline aria-[current=page]:font-ual-bold aria-[current=page]:text-ual-dark focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ual-orange';

          return (
            <li key={key}>
              {isExternal ? (
                <a
                  href={item.href}
                  className={linkClass}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${item.label} (opens in a new tab)`}
                >
                  <item.Icon className="size-6" aria-hidden="true" />
                  <span>{item.label}</span>
                </a>
              ) : (
                <Link
                  href={item.to}
                  className={linkClass}
                  aria-current={active ? 'page' : undefined}
                >
                  <item.Icon className="size-6" aria-hidden="true" />
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
