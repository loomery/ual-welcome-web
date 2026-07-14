'use client';

import { usePathname } from 'next/navigation';
import { isFocusedRoute } from '../../utils/isFocusedRoute';
import { useScrolled } from '../../hooks/useScrolled';
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
 * App shell. The greeting/college hero is a black band that, on desktop, keeps
 * a constant height and collapses horizontally (full-width → sidebar width,
 * anchored left) once the page is scrolled past a threshold, folding into the
 * compact sidebar box while the main content rises to sit beside it. This is a
 * snap between two fixed states (`scrolled`), not an effect tied continuously
 * to scroll position. It stays sticky beneath the top bar for the whole page.
 * On mobile it's a static full-width band that scrolls away.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children
 */
export function AppShell({ children }) {
  const pathname = usePathname();
  const focused = isFocusedRoute(pathname);
  const scrolled = useScrolled();

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
          <AppHero scrolled={scrolled} />
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
            // Sit below the full-width hero at the top; once scrolled, the hero
            // animates to its narrow sidebar width, so content rises to sit
            // beside it (hero keeps a constant 11rem height throughout). Same
            // trigger + duration as the hero's own animation, so they move together.
            !focused &&
              (scrolled
                ? 'md:mt-0 md:transition-[margin-top] md:duration-300 md:ease-ual motion-reduce:md:transition-none'
                : 'md:mt-44 md:transition-[margin-top] md:duration-300 md:ease-ual motion-reduce:md:transition-none'),
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
