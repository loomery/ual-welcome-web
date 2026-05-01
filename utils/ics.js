/**
 * Minimal RFC 5545 iCalendar generator — enough for 'Add to calendar' UX.
 * Folding / escaping follow the spec: commas, semicolons, backslashes and
 * newlines must be escaped in TEXT properties.
 *
 * @param {string} iso
 * @returns {string}
 */
function toIcsDate(iso) {
  return new Date(iso)
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
}

/**
 * @param {string} v
 * @returns {string}
 */
function escapeIcsText(v) {
  return v.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

/**
 * @param {import('../data/events').UalEvent} event
 * @returns {string}
 */
export function buildIcs(event) {
  const now = toIcsDate(new Date().toISOString());
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//UAL//Welcome Week Beta//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.id}@welcome-week.arts.ac.uk`,
    `DTSTAMP:${now}`,
    `DTSTART:${toIcsDate(event.startsAt)}`,
    `DTEND:${toIcsDate(event.endsAt)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `DESCRIPTION:${escapeIcsText(event.description)}`,
    `LOCATION:${escapeIcsText(`${event.location}, ${event.college}`)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/**
 * @param {import('../data/events').UalEvent} event
 */
export function downloadIcs(event) {
  const ics = buildIcs(event);
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${event.id}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Release the object URL after the browser has had time to trigger the download
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
