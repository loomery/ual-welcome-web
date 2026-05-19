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
  triggerDownload(buildIcs(event), `${event.id}.ics`);
}

/**
 * Build a single VCALENDAR wrapping many VEVENTs. Calendar apps (Apple,
 * Google, Outlook) accept a multi-event ICS file in a single import and
 * de-duplicate by UID, so re-importing won't create duplicates.
 *
 * @param {import('../data/events').UalEvent[]} events
 * @returns {string}
 */
export function buildBulkIcs(events) {
  const now = toIcsDate(new Date().toISOString());
  const veventBlocks = events.flatMap((event) => [
    'BEGIN:VEVENT',
    `UID:${event.id}@welcome-week.arts.ac.uk`,
    `DTSTAMP:${now}`,
    `DTSTART:${toIcsDate(event.startsAt)}`,
    `DTEND:${toIcsDate(event.endsAt)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `DESCRIPTION:${escapeIcsText(event.description)}`,
    `LOCATION:${escapeIcsText(`${event.location}, ${event.college}`)}`,
    'END:VEVENT',
  ]);
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//UAL//Welcome Week Beta//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...veventBlocks,
    'END:VCALENDAR',
  ].join('\r\n');
}

/**
 * Bulk-download a single ICS file containing every passed event. Used
 * by the EventsScreen "Saved" view to let students hand the whole list
 * to their calendar app in one go.
 *
 * @param {import('../data/events').UalEvent[]} events
 * @param {string} [filename='ual-saved-events.ics']
 */
export function downloadIcsBulk(events, filename = 'ual-saved-events.ics') {
  if (events.length === 0) return;
  triggerDownload(buildBulkIcs(events), filename);
}

/**
 * Shared blob-and-trigger plumbing used by both the single-event and
 * bulk-event download flows.
 *
 * @param {string} ics
 * @param {string} filename
 */
function triggerDownload(ics, filename) {
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Release the object URL after the browser has had time to trigger the download
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
