/**
 * "Useful info" links — non-checklist, always-on resources surfaced from
 * the priority-content brief. Distinct from CHECKLIST_ITEMS because
 * these aren't tasks to complete, they're references to revisit.
 *
 * @typedef {Object} UsefulInfoItem
 * @property {string} id
 * @property {string} title
 * @property {string} body
 * @property {string} ctaLabel
 * @property {string} href
 */

/** @type {UsefulInfoItem[]} */
export const USEFUL_INFO = [
  {
    id: 'term-dates',
    title: 'UAL term dates',
    body:
      "Standard term dates for the academic year. Always check with your course team — some courses run on different dates.",
    ctaLabel: 'View term dates',
    href: 'https://www.arts.ac.uk/students/term-dates',
  },
  {
    id: 'student-services',
    title: 'Student Services',
    body:
      'Confidential, free support — funding and immigration, health and mental health, disability and dyslexia, counsellors and chaplains. Appointments by video, phone, email or in person.',
    ctaLabel: 'Visit Student Services',
    href: 'https://www.arts.ac.uk/students/student-services',
  },
];
