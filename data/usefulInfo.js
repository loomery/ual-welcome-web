/**
 * "Useful info" links — non-checklist, always-on resources surfaced from
 * the priority-content brief. Distinct from CHECKLIST_ITEMS because
 * these aren't tasks to complete, they're references to revisit.
 *
 * Items can optionally carry an `eyebrow` (small label rendered above the
 * title — e.g. "Autumn term" for the dated term card) and a `dates` block.
 * When `dates` is present the dashboard renders the formatted date range
 * as the card body instead of (or alongside) `body`.
 *
 * @typedef {Object} UsefulInfoDates
 * @property {string} startsAt  ISO 8601 timestamp
 * @property {string} endsAt    ISO 8601 timestamp
 *
 * @typedef {Object} UsefulInfoItem
 * @property {string} id
 * @property {string} title
 * @property {string} [eyebrow]
 * @property {string} [body]
 * @property {UsefulInfoDates} [dates]
 * @property {string} ctaLabel
 * @property {string} href
 */

/** @type {UsefulInfoItem[]} */
export const USEFUL_INFO = [
  {
    id: 'term-dates',
    eyebrow: 'Autumn term',
    title: 'UAL term dates',
    dates: {
      startsAt: '2025-09-29',
      endsAt: '2025-12-12',
    },
    ctaLabel: 'View all term dates',
    href: 'https://www.arts.ac.uk/students/term-dates',
  },
  {
    id: 'student-services',
    title: 'Student Services',
    body: 'Confidential, free support — funding and immigration, health and mental health, disability and dyslexia, counsellors and chaplains. Appointments by video, phone, email or in person.',
    ctaLabel: 'Visit Student Services',
    href: 'https://www.arts.ac.uk/students/student-services',
  },
];
