/**
 * Static reference data for the onboarding flow. Mirrors the buildings
 * dataset for college choice, but keeps the option-set decoupled from
 * the 3D scene config (different concerns).
 *
 * @typedef {'undergraduate' | 'postgraduate' | 'pre-degree' | 'short-course'} StudyLevel
 * @typedef {'1st' | '2nd' | 'placement' | '3rd'} Year
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
 * @typedef {Object} YearOption
 * @property {Year} id
 * @property {string} label
 * @property {string} hint
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
  {
    id: 'cci',
    name: 'Creative Computing Institute',
    short: 'CCI',
    area: 'Barbican',
  },
  {
    id: 'dai',
    name: 'Decolonising Arts Institute',
    short: 'DAI',
    area: 'London',
  },
  {
    id: 'ftti',
    name: 'Fashion Textiles and Technology Institute',
    short: 'FTTI',
    area: 'East Bank, Stratford',
  },
];

/** @type {StudyLevelOption[]} */
export const STUDY_LEVEL_OPTIONS = [
  { id: 'undergraduate', label: 'Undergraduate', hint: 'BA, BSc, foundation' },
  { id: 'postgraduate', label: 'Postgraduate', hint: 'MA, MSc, MArch, MPhil, PhD' },
  { id: 'pre-degree', label: 'Pre-degree', hint: 'Foundation, access or diploma' },
  { id: 'short-course', label: 'Short course', hint: 'A few weeks to a term' },
];

/** @type {YearOption[]} */
export const YEAR_OPTIONS = [
  { id: '1st', label: '1st year', hint: 'Just starting your course' },
  { id: '2nd', label: '2nd year', hint: 'Continuing your studies' },
  { id: 'placement', label: 'Placement year', hint: 'Industry placement' },
  { id: '3rd', label: '3rd year', hint: 'Final year or beyond' },
];

/** @type {InterestOption[]} */
export const INTEREST_OPTIONS = [
  {
    id: 'social',
    label: 'Social',
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
    label: 'Jobs & opportunities',
    body: 'Talks, mentoring, industry links.',
    emoji: '💼',
  },
  {
    id: 'area',
    label: 'Area guide',
    body: 'Travel information, campus map and discounts.',
    emoji: '🗺️',
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
  area: ['Tour'],
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
