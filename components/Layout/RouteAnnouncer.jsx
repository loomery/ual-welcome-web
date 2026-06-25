'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Announces route changes to assistive tech via aria-live (WCAG 4.1.3).
 * The title is owned by Next's metadata — we only read it for the spoken
 * announcement, never set `document.title` (that would desync client nav
 * vs. refresh).
 */
export function RouteAnnouncer() {
  const pathname = usePathname();
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Next applies the new route's metadata title asynchronously after the
    // pathname changes; defer a tick so we read the updated value.
    const id = setTimeout(() => {
      const title = document.title.split('|')[0].trim() || 'Page';
      setMessage(`Navigated to ${title}`);
    }, 0);
    return () => clearTimeout(id);
  }, [pathname]);

  return (
    <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </div>
  );
}
