'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Resets the window to the top on every route change.
 *
 * Several screens render `null` until their persisted state hydrates
 * (SmartHome, TaskListScreen, MfaScreen). That empty first commit defeats
 * the App Router's built-in scroll-to-top heuristic — it finds no new
 * content to scroll into view and leaves the window at the previous page's
 * offset, so a navigation can land mid-page. Forcing the scroll on each
 * pathname change restores the expected "new page starts at the top".
 *
 * Keyed on pathname only, so in-page hash links (e.g. the skip link to
 * #main-content) are left alone.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
