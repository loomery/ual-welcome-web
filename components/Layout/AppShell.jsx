'use client';

import { usePathname } from 'next/navigation';
import { SkipLinks } from './SkipLinks';
import { Header } from './Header';
import { SideNav } from './SideNav';
import { BottomNav } from './BottomNav';
import { Footer } from './Footer';
import { FeedbackButton } from '../Feedback/FeedbackButton';
import { RouteAnnouncer } from './RouteAnnouncer';
import { SearchProvider } from '../Search/SearchProvider';

/**
 * Routes that render full-bleed without the standard app chrome
 * (header, side nav, bottom nav, footer, feedback FAB). The password
 * gate is the only one for now; add others here if they need to
 * escape the shell.
 */
const FULL_BLEED_PATHS = new Set(['/login']);

/**
 * App shell. Mobile-first:
 *  - Skip links (WCAG 2.4.1 Bypass Blocks)
 *  - Header with UAL logo (mobile / tablet; hidden on desktop)
 *  - SideNav (desktop only — fixed left sidebar; hidden on mobile)
 *  - Bottom tab bar (mobile primary nav)
 *  - Main landmark for content
 *  - Footer with privacy note + on-device reset (shared kiosks)
 *  - Live region announcing route changes
 *
 * Becomes a `'use client'` component so it can read `usePathname()` and
 * skip the chrome on auth screens (e.g. /login). All children passed in
 * still render with their own server/client boundaries intact.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children
 */
export function AppShell({ children }) {
  const pathname = usePathname();
  if (FULL_BLEED_PATHS.has(pathname)) {
    return <>{children}</>;
  }

  return (
    <SearchProvider>
      <div className="app-shell">
        <SkipLinks />
        <Header />
        <SideNav />
        <main id="main-content" className="app-shell__main wrapper" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <FeedbackButton />
        <BottomNav />
        <RouteAnnouncer />
      </div>
    </SearchProvider>
  );
}
