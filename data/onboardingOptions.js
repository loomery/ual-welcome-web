/**
 * Static reference data for the onboarding flow. Mirrors the buildings
 * dataset for college choice, but keeps the option-set decoupled from
 * the 3D scene config (different concerns).
 *
 * @typedef {'undergraduate' | 'postgraduate-taught' | 'postgraduate-research' | 'short-course'} StudyLevel
 * @typedef {'new' | 'returning'} StudentType
 *
 * @typedef {Object} CollegeOption
 * @property {string} id        Matches data/buildings.js → Building.id
 * @property {string} name      Full college name (e.g. "Central Saint Martins")
 * @property {string} short     Short label for compact contexts ("CSM")
 * @property {string} area      Where the campus is in London — used in the dashboard hero
 *
 * @typedef {Object} StudyLevelOption
 * @property {StudyLevel} id
 * @property {string} label
 * @property {string} hint      Single-line clarifier shown under the label
 *
 * @typedef {Object} InterestOption
 * @property {string} id
 * @property {string} label
 * @property {string} body      One-liner that explains what they'll see if they pick this
 * @property {string} emoji     Inline glyph for visual scan; also serves as a non-text marker
 */

/** @type {CollegeOption[]} */
export const COLLEGE_OPTIONS = [
  { id: 'csm', name: 'Central Saint Martins', short: 'CSM', area: "King's Cross" },
  { id: 'lcf', name: 'London College of Fashion', short: 'LCF', area: 'East Bank, Stratford' },
  {
    id: 'lcc',
    name: 'London College of Communication',
    short: 'LCC',
    area: 'Elephant & Castle',
  },
  { id: 'camberwell', name: 'Camberwell College of Arts', short: 'Camberwell', area: 'Peckham' },
  { id: 'chelsea', name: 'Chelsea College of Arts', short: 'Chelsea', area: 'Pimlico' },
  { id: 'wimbledon', name: 'Wimbledon College of Arts', short: 'Wimbledon', area: 'Wimbledon' },
];

/** @type {{ id: StudentType, label: string, hint: string }[]} */
export const STUDENT_TYPE_OPTIONS = [
  {
    id: 'new',
    label: 'New to UAL',
    hint: 'First time joining — full induction tailored for you.',
  },
  {
    id: 'returning',
    label: 'Returning student',
    hint: 'Year 2+ — quick refresh of what changed this year.',
  },
];

/** @type {StudyLevelOption[]} */
export const STUDY_LEVEL_OPTIONS = [
  { id: 'undergraduate', label: 'Undergraduate', hint: 'BA, BSc, foundation' },
  { id: 'postgraduate-taught', label: 'Postgraduate taught', hint: 'MA, MSc, MArch' },
  { id: 'postgraduate-research', label: 'Postgraduate research', hint: 'MPhil, PhD' },
  { id: 'short-course', label: 'Short course', hint: 'A few weeks to a term' },
];

/** @type {InterestOption[]} */
export const INTEREST_OPTIONS = [
  {
    id: 'social',
    label: 'Meeting people',
    body: 'Socials, clubs, the SU.',
    emoji: '🎉',
  },
  {
    id: 'creative',
    label: 'Workshops & studios',
    body: 'Hands-on sessions and studio access.',
    emoji: '🎨',
  },
  {
    id: 'study',
    label: 'Study skills',
    body: 'Library, Moodle, academic support.',
    emoji: '📚',
  },
  {
    id: 'wellbeing',
    label: 'Wellbeing',
    body: 'Mental health, counselling, healthcare.',
    emoji: '🌱',
  },
  {
    id: 'career',
    label: 'Career & opportunities',
    body: 'Talks, mentoring, industry links.',
    emoji: '💼',
  },
  {
    id: 'tech',
    label: 'Tech setup',
    body: 'IT, email, software, devices.',
    emoji: '💻',
  },
];

/**
 * Maps interest IDs to event categories from data/events.js.
 * Used by the dashboard to surface relevant events.
 *
 * @type {Record<string, ('Talk' | 'Tour' | 'Social' | 'Workshop')[]>}
 */
export const INTEREST_TO_EVENT_CATEGORIES = {
  social: ['Social'],
  creative: ['Workshop', 'Tour'],
  study: ['Talk', 'Tour'],
  wellbeing: ['Talk'],
  career: ['Talk'],
  tech: ['Talk', 'Workshop'],
};

/**
 * Maps interest IDs to checklist item IDs from data/checklist.js.
 * Used by the dashboard to highlight tasks the student opted into.
 *
 * @type {Record<string, string[]>}
 */
export const INTEREST_TO_CHECKLIST = {
  study: ['libraries', 'moodle', 'timetable'],
  tech: ['it-account'],
  creative: ['libraries'],
  social: [],
  wellbeing: [],
  career: [],
};
