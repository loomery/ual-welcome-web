export const DATE_FMT = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
});

export const LONG_DATE_FMT = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export const TIME_FMT = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
});

/** "21" — day of month, no leading zero. Used for the event-card date stamp. */
export const DAY_FMT = new Intl.DateTimeFormat('en-GB', { day: 'numeric' });

/** "Sep" — abbreviated month, used for the event-card date stamp. */
export const MONTH_FMT = new Intl.DateTimeFormat('en-GB', { month: 'short' });

/** "Mon" — abbreviated weekday, used for the event-card meta line. */
export const WEEKDAY_FMT = new Intl.DateTimeFormat('en-GB', { weekday: 'short' });

/**
 * @param {string} startsAt
 * @param {string} endsAt
 * @param {boolean} [long]
 * @returns {string}
 */
export function formatRange(startsAt, endsAt, long = false) {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  const fmt = long ? LONG_DATE_FMT : DATE_FMT;
  return `${fmt.format(start)} · ${TIME_FMT.format(start)}–${TIME_FMT.format(end)}`;
}

/**
 * Days between now and target date. Rounded. Negative if target is in the past.
 *
 * @param {string} targetIso
 * @param {Date} [now]
 * @returns {number}
 */
export function daysUntil(targetIso, now = new Date()) {
  const target = new Date(targetIso);
  const ms = target.getTime() - now.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}
