'use client';

import { useEffect, useState } from 'react';
import { daysUntil } from '../../utils/dates';
import { WELCOME_WEEK } from '../../data/welcomeWeek';

/**
 * Welcome Week countdown.
 * - If starts in the future: "Starts in X days"
 * - If currently running:    "It's on — X days left"
 * - If finished:              returns null (component renders nothing)
 *
 * Client component so SSR/CSR don't mismatch on `new Date()`.
 */
export function Countdown() {
  // Avoid SSR hydration mismatch — render nothing until mounted, then compute.
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(new Date());
  }, []);

  if (!now) return null;

  const toStart = daysUntil(WELCOME_WEEK.startsAt, now);
  const toEnd = daysUntil(WELCOME_WEEK.endsAt, now);

  let label;
  let eyebrow;
  if (toStart > 0) {
    eyebrow = 'Welcome Week';
    label = toStart === 1 ? 'Starts tomorrow' : `Starts in ${toStart} days`;
  } else if (toEnd > 0) {
    eyebrow = 'Welcome Week';
    label = toEnd === 1 ? 'Ends tomorrow' : `${toEnd} days to go`;
  } else {
    return null;
  }

  return (
    <div className="countdown" role="status">
      <span className="countdown__eyebrow">{eyebrow}</span>
      <span className="countdown__label">{label}</span>
    </div>
  );
}
