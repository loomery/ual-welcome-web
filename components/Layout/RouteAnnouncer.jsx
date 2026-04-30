'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Announces route changes to assistive tech via aria-live.
 * WCAG 4.1.3 Status Messages. Also updates document.title.
 *
 * @type {Record<string, string>}
 */
const TITLES = {
  '/': 'Home',
  '/checklist': 'Induction checklist',
  '/map': 'Campus map',
  '/events': 'Events',
};

/**
 * @param {string} pathname
 * @returns {string}
 */
function titleForPath(pathname) {
  if (TITLES[pathname]) return TITLES[pathname];
  if (pathname.startsWith('/events/')) return 'Event detail';
  return 'Page';
}

export function RouteAnnouncer() {
  const pathname = usePathname();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const title = titleForPath(pathname);
    document.title = `${title} | UAL Welcome Week`;
    // setState-in-effect is intentional: the announcement is *driven by*
    // navigation (an external system) and must be queued for the next paint
    // so screen readers pick up the change. React 19's
    // `react-hooks/set-state-in-effect` flags the pattern; suppressed here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMessage(`Navigated to ${title}`);
  }, [pathname]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="visually-hidden"
    >
      {message}
    </div>
  );
}
