'use client';

import { usePathname } from 'next/navigation';
import { SkipLinks } from './SkipLinks';
import { Header } from './Header';
import { AppHero } from './AppHero';
import { SideNav } from './SideNav';
import { BottomNav } from './BottomNav';
import { Footer } from './Footer';
import { RouteAnnouncer } from './RouteAnnouncer';
import { ScrollToTop } from './ScrollToTop';

/**
 * App shell — matches the new UAL home design:
 *  - Skip links (WCAG 2.4.1 Bypass Blocks)
 *  - Full-width black top bar (logo only) — every breakpoint
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

  return (
    <div className="app-shell">
      <SkipLinks />
      <Header />
      {isHome && <AppHero variant="full" />}
      <div className="app-shell__body" data-home={isHome || undefined}>
        <div className="app-shell__rail">
          {!isHome && <AppHero variant="compact" />}
          <SideNav />
        </div>
        <main id="main-content" className="app-shell__main wrapper" tabIndex={-1}>
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
