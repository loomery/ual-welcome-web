/**
 * @typedef {'Before you arrive' | 'First week' | 'Get settled'} ChecklistCategory
 *
 * @typedef {Object} ChecklistItem
 * @property {string} id
 * @property {string} title
 * @property {string} [hint]
 * @property {ChecklistCategory} category
 */

/**
 * Placeholder checklist content. In production this would be fetched from a CMS.
 *
 * @type {ChecklistItem[]}
 */
export const CHECKLIST_ITEMS = [
  {
    id: 'activate-account',
    title: 'Activate your UAL IT account',
    hint: 'Use the activation email sent to your personal address.',
    category: 'Before you arrive',
  },
  {
    id: 'enrol',
    title: 'Complete online enrolment',
    hint: 'Opens on the Portal from August onwards.',
    category: 'Before you arrive',
  },
  {
    id: 'id-card',
    title: 'Collect your UAL ID card',
    hint: 'From your home college reception during Welcome Week.',
    category: 'First week',
  },
  {
    id: 'induction',
    title: 'Attend your course induction',
    hint: 'Check your timetable on the Portal.',
    category: 'First week',
  },
  {
    id: 'library-tour',
    title: 'Book a library tour',
    category: 'First week',
  },
  {
    id: 'register-gp',
    title: 'Register with a local GP',
    hint: 'Recommended within your first month in London.',
    category: 'Get settled',
  },
  {
    id: 'students-union',
    title: 'Sign up to Arts Students’ Union',
    hint: 'Free; unlocks clubs, societies and support.',
    category: 'Get settled',
  },
];
