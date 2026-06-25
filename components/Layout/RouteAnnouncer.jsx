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
    const title = document.title.split('|')[0].trim() || 'Page';
    // The announcement is driven by navigation (an external system), so a
    // synchronous setState here is intentional — the lint rule's cascading-
    // render concern doesn't apply to a one-shot per-route message.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMessage(`Navigated to ${title}`);
  }, [pathname]);

  return (
    <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </div>
  );
}
