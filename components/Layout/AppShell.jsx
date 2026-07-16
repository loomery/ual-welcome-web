'use client';

import { usePathname } from 'next/navigation';
import { isFocusedRoute } from '../../utils/isFocusedRoute';
import { SkipLinks } from './SkipLinks';
import { Header } from './Header';
import { BetaNotice } from './BetaNotice';
import { AppHero } from './AppHero';
import { SideNav } from './SideNav';
import { Footer } from './Footer';
import { RouteAnnouncer } from './RouteAnnouncer';
import { ScrollToTop } from './ScrollToTop';
import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs';

/**
 * App shell. On desktop the greeting/college hero is a static black block at
 * the top of the left sidebar column that scrolls away (the nav below it is
 * sticky); the main content sits beside it in the right column. On mobile the
 * hero is a full-width band above the content that scrolls away.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children
 */
export function AppShell({ children }) {
  const pathname = usePathname();
  const focused = isFocusedRoute(pathname);

  return (
    <div>
      <SkipLinks />
      <Header />
      <BetaNotice />
      <div
        className={
          focused ? '@container md:block' : '@container md:grid md:grid-cols-[18rem_minmax(0,1fr)]'
        }
      >
        <div className="md:min-w-0">
          <AppHero />
          <SideNav />
        </div>
        <main
          id="main-content"
          className={[
            'mx-auto max-w-grid min-w-0 px-(--grid-gutter) py-8 md:mx-0 md:w-full md:max-w-none min-[75rem]:px-12',
            // White content canvas at every width so the grey (shade) cards and
            // dividers read as distinct surfaces (matches Figma); onboarding
            // ("focused") keeps a transparent canvas.
            focused ? 'md:bg-transparent md:py-10' : 'bg-white md:py-12',
          ]
            .filter(Boolean)
            .join(' ')}
          tabIndex={-1}
        >
          {!focused && <Breadcrumbs className="mb-8" />}
          {children}
        </main>
      </div>
      <Footer />
      <RouteAnnouncer />
      <ScrollToTop />
    </div>
  );
}
