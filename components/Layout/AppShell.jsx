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
 * App shell:
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
    <div>
      <SkipLinks />
      <Header />
      {isHome && <AppHero variant="full" />}
      <div className="min-[49.5rem]:grid min-[49.5rem]:grid-cols-[18rem_minmax(0,1fr)] min-[49.5rem]:items-start [body[data-onboarding]_&]:block">
        <div className="min-[49.5rem]:flex min-[49.5rem]:flex-col min-[49.5rem]:self-stretch">
          {!isHome && <AppHero variant="compact" />}
          <SideNav />
        </div>
        <main
          id="main-content"
          className="mx-auto max-w-grid min-w-0 px-(--grid-gutter) py-l min-[49.5rem]:mx-0 min-[49.5rem]:w-full min-[49.5rem]:max-w-none min-[49.5rem]:bg-white min-[49.5rem]:py-xl min-[75rem]:px-xl [body[data-onboarding]_&]:flex [body[data-onboarding]_&]:min-h-dvh [body[data-onboarding]_&]:items-start [body[data-onboarding]_&]:justify-center [body[data-onboarding]_&]:py-m [body[data-onboarding]_&]:min-[49.5rem]:mx-0 [body[data-onboarding]_&]:min-[49.5rem]:w-auto [body[data-onboarding]_&]:min-[49.5rem]:max-w-[100vw] [body[data-onboarding]_&]:min-[49.5rem]:items-center"
          tabIndex={-1}
        >
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
