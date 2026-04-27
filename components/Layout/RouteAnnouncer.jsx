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
