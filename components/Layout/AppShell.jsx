import { SkipLinks } from './SkipLinks';
import { Header } from './Header';
import { SideNav } from './SideNav';
import { BottomNav } from './BottomNav';
import { Footer } from './Footer';
import { FeedbackButton } from '../Feedback/FeedbackButton';
import { RouteAnnouncer } from './RouteAnnouncer';

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
 * @param {Object} props
 * @param {import('react').ReactNode} props.children
 */
export function AppShell({ children }) {
  return (
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
  );
}
