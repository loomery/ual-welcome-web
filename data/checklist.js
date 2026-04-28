/**
 * Priority checklist content. Six actionable items derived from the UAL
 * content brief — each maps 1:1 to a sticky note from the priority board.
 *
 * Content notes:
 *  - Copy is paraphrased from arts.ac.uk for brevity. The CTA is the
 *    canonical, link-rotted-proof entry point on arts.ac.uk so when UAL
 *    moves their CMS, only `cta.href` needs touching.
 *  - `dependsOn` answers Dan Sweeting's question on the brief: the arrows
 *    are sequential dependencies, NOT nesting. Both items remain
 *    standalone and individually checkable, but the dependent one shows
 *    a "Complete X first" hint when its parent is unchecked. Power users
 *    can still tick out of order if they know what they're doing.
 *  - Categories mirror the natural flow: get yourself set up, then get
 *    learning. Two buckets keep the UI scannable on a phone.
 *
 * @typedef {'Set up' | 'Get learning'} ChecklistCategory
 *
 * @typedef {Object} ChecklistCta
 * @property {string} label   Visible link text.
 * @property {string} href    Absolute external URL (https only).
 *
 * @typedef {Object} ChecklistItem
 * @property {string} id
 * @property {string} title
 * @property {string} body            One-or-two-sentence explanation.
 * @property {ChecklistCta} cta       External link to the canonical UAL page.
 * @property {ChecklistCategory} category
 * @property {string} [dependsOn]     Optional id of an item that should be done first.
 */

/** @type {ChecklistItem[]} */
export const CHECKLIST_ITEMS = [
  {
    id: 'enrol',
    title: 'Are you enrolled?',
    body:
      'You must enrol each year to join or continue your course. Complete your online registration to get started.',
    cta: {
      label: 'Complete your online registration',
      href: 'https://www.arts.ac.uk/study-at-ual/how-to-enrol',
    },
    category: 'Set up',
  },
  {
    id: 'id-card',
    title: 'Get your ID card',
    body:
      "Once you're enrolled, collect your student ID. Use it to access all UAL buildings and facilities.",
    cta: {
      label: 'Collect your student ID',
      href: 'https://www.arts.ac.uk/study-at-ual/how-to-enrol/student-id-card-collection',
    },
    category: 'Set up',
    dependsOn: 'enrol',
  },
  {
    id: 'it-account',
    title: 'Set up your IT account and email',
    body:
      'Activate your UAL email and university IT account. Need help? IT support is on the same page.',
    cta: {
      label: 'IT set up and support',
      href: 'https://www.arts.ac.uk/students/welcome/your-journey-to-UAL/get-connected',
    },
    category: 'Set up',
  },
  {
    id: 'timetable',
    title: 'Get your timetable',
    body:
      'Find out when and where your classes happen so you can plan your first week.',
    cta: {
      label: 'Get ready for your timetable',
      href: 'https://www.arts.ac.uk/students/student-timetables',
    },
    category: 'Get learning',
  },
  {
    id: 'libraries',
    title: 'Explore the Libraries',
    body:
      'Six specialist libraries across UAL. Borrow books, book study spaces, and access digital collections.',
    cta: {
      label: 'Library Services',
      href: 'https://www.arts.ac.uk/students/welcome/your-journey-to-UAL/get-support/skills',
    },
    category: 'Get learning',
  },
  {
    id: 'moodle',
    title: 'How do I access Moodle?',
    body:
      'Moodle is where your course materials, lecture recordings and assignments live.',
    cta: {
      label: 'Get started on Moodle',
      href: 'https://www.arts.ac.uk/students/get-started-on-moodle',
    },
    category: 'Get learning',
  },
];
