'use client';

import { usePathname } from 'next/navigation';
import { isOnboardingRoute } from '../../utils/isOnboardingRoute';
import { SkipLinks } from './SkipLinks';
import { Header } from './Header';
import { BetaNotice } from './BetaNotice';
import { AppHero } from './AppHero';
import { SideNav } from './SideNav';
import { BottomNav } from './BottomNav';
import { Footer } from './Footer';
import { RouteAnnouncer } from './RouteAnnouncer';
import { ScrollToTop } from './ScrollToTop';
import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs';

/**
 * App shell:
 *  - Skip links (WCAG 2.4.1 Bypass Blocks)
 *  - Full-width black top bar (logo only) — every breakpoint
 *  - Site-wide beta notice strip beneath the header
 *  - The greeting/college hero (`AppHero`) appears on every page in one of two
 *    layouts: a full-width band beneath the header on the home page, or a
 *    compact box at the top of the left sidebar column on every other page.
 *  - A body row: desktop side nav (left) + main content (right). On mobile
 *    the side nav is hidden and the bottom tab bar is the primary nav.
 *  - Full-width footer beneath the row (privacy note + on-device reset)
 *  - Live region announcing route changes
 *
 * `'use client'` so it can read `usePathname()` to switch the hero layout
 * on the home page. Children keep their own server/client boundaries.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children
 */
export function AppShell({ children }) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isOnboarding = isOnboardingRoute(pathname);

  return (
    <div>
      <SkipLinks />
      <Header />
      <BetaNotice />
      {isHome && <AppHero variant="full" />}
      <div
        className={
          isOnboarding ? 'md:block' : 'md:grid md:grid-cols-[18rem_minmax(0,1fr)] md:items-start'
        }
      >
        <div className="md:flex md:flex-col md:self-stretch">
          {!isHome && <AppHero variant="compact" />}
          <SideNav />
        </div>
        <main
          id="main-content"
          className={
            isOnboarding
              ? 'mx-auto max-w-grid min-w-0 px-(--grid-gutter) py-8 md:mx-0 md:w-full md:max-w-none md:bg-transparent md:py-10 min-[75rem]:px-12'
              : 'mx-auto max-w-grid min-w-0 px-(--grid-gutter) py-8 md:mx-0 md:w-full md:max-w-none md:bg-white md:py-12 min-[75rem]:px-12'
          }
          tabIndex={-1}
        >
          {!isOnboarding && <Breadcrumbs className="mb-8" />}
          {children}
        </main>
      </div>
      <Footer />
      <BottomNav />
      <RouteAnnouncer />
      <ScrollToTop />
    </div>
  );
}
