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
 * Whether two dates fall on the same calendar day (local time).
 *
 * @param {Date} a
 * @param {Date} b
 * @returns {boolean}
 */
export function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
