'use client';

import { useEffect, useState } from 'react';
import { daysUntil } from '../../utils/dates';
import { WELCOME_WEEK } from '../../data/welcomeWeek';

/**
 * Welcome Week countdown — the golden full-bleed strip that sits directly
 * under the navbar in the new home design.
 * - If it starts in the future: "Welcome Week is in X days"
 * - If currently running:       "Welcome Week is on now"
 * - If finished:                returns null (component renders nothing)
 *
 * Client component so SSR/CSR don't mismatch on `new Date()`.
 */
export function Countdown() {
  // Avoid SSR hydration mismatch — render nothing until mounted, then compute.
  // The setState-in-effect is intentional: `new Date()` would diverge between
  // server and client without a post-mount hand-off, so we hydrate to a
  // stable null and only compute on the client. React 19's
  // `react-hooks/set-state-in-effect` flags the pattern; suppressed here.
  const [now, setNow] = useState(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
  }, []);

  if (!now) return null;

  const toStart = daysUntil(WELCOME_WEEK.startsAt, now);
  const toEnd = daysUntil(WELCOME_WEEK.endsAt, now);

  let label;
  if (toStart > 0) {
    label = toStart === 1 ? 'Welcome Week starts tomorrow' : `Welcome Week is in ${toStart} days`;
  } else if (toEnd > 0) {
    label = 'Welcome Week is on now';
  } else {
    return null;
  }

  return (
    <div className="welcome-strip" role="status">
      <p className="welcome-strip__inner">{label}</p>
    </div>
  );
}
