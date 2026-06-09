/**
 * Static reference data for the onboarding flow. Mirrors the buildings
 * dataset for college choice, but keeps the option-set decoupled from
 * the 3D scene config (different concerns).
 *
 * @typedef {'1st' | '2nd' | 'placement' | '3rd'} Year
 * @typedef {'domestic' | 'international'} StudentType
 * @typedef {'not_started' | 'having_issues' | 'waiting' | 'received'} VisaStatus
 *
 * @typedef {Object} CollegeOption
 * @property {string} id        Matches data/buildings.js → Building.id
 * @property {string} name      Full college name (e.g. "Central Saint Martins")
 * @property {string} short     Short label for compact contexts ("CSM")
 * @property {string} area      Where the campus is in London — used in the dashboard hero
 * @property {string} eventsUrl Deep-link to the college's What's On page on arts.ac.uk
 *
 * @typedef {Object} YearOption
 * @property {Year} id
 * @property {string} label
 * @property {string} hint
 *
 * @typedef {Object} StudentTypeOption
 * @property {StudentType} id
 * @property {string} label
 * @property {string} hint
 *
 * @typedef {Object} VisaStatusOption
 * @property {VisaStatus} id
 * @property {string} label
 * @property {string} hint
 *
 * @typedef {Object} InterestOption
 * @property {string} id
 * @property {string} label
 * @property {string} body           One-liner that explains what they'll see if they pick this
 */

/** @type {CollegeOption[]} */
export const COLLEGE_OPTIONS = [
  {
    id: 'csm',
    name: 'Central Saint Martins',
    short: 'CSM',
    area: "King's Cross",
    eventsUrl: 'https://www.arts.ac.uk/colleges/central-saint-martins/whats-on',
  },
  {
    id: 'lcf',
    name: 'London College of Fashion',
    short: 'LCF',
    area: 'East Bank, Stratford',
    eventsUrl: 'https://www.arts.ac.uk/colleges/london-college-of-fashion/whats-on',
  },
  {
    id: 'lcc',
    name: 'London College of Communication',
    short: 'LCC',
    area: 'Elephant & Castle',
    eventsUrl: 'https://www.arts.ac.uk/colleges/london-college-of-communication/whats-on',
  },
  {
    id: 'camberwell',
    name: 'Camberwell College of Arts',
    short: 'Camberwell',
    area: 'Peckham',
    eventsUrl: 'https://www.arts.ac.uk/colleges/camberwell-college-of-arts/whats-on',
  },
  {
    id: 'chelsea',
    name: 'Chelsea College of Arts',
    short: 'Chelsea',
    area: 'Pimlico',
    eventsUrl: 'https://www.arts.ac.uk/colleges/chelsea-college-of-arts/whats-on',
  },
  {
    id: 'wimbledon',
    name: 'Wimbledon College of Arts',
    short: 'Wimbledon',
    area: 'Wimbledon',
    eventsUrl: 'https://www.arts.ac.uk/colleges/wimbledon-college-of-arts/whats-on',
  },
  {
    id: 'cci',
    name: 'Creative Computing Institute',
    short: 'CCI',
    area: 'Barbican',
    eventsUrl: 'https://www.arts.ac.uk/whats-on',
  },
  {
    id: 'dai',
    name: 'Decolonising Arts Institute',
    short: 'DAI',
    area: 'London',
    eventsUrl: 'https://www.arts.ac.uk/whats-on',
  },
  {
    id: 'ftti',
    name: 'Fashion Textiles and Technology Institute',
    short: 'FTTI',
    area: 'East Bank, Stratford',
    eventsUrl: 'https://www.arts.ac.uk/whats-on',
  },
];

/** @type {YearOption[]} */
export const YEAR_OPTIONS = [
  { id: '1st', label: '1st year', hint: 'Just starting your course' },
  { id: '2nd', label: '2nd year', hint: 'Continuing your studies' },
  { id: 'placement', label: 'Placement year', hint: 'Industry placement' },
  { id: '3rd', label: '3rd year', hint: 'Final year or beyond' },
];

/** @type {StudentTypeOption[]} */
export const STUDENT_TYPE_OPTIONS = [
  { id: 'domestic', label: 'UK / Home', hint: "I'm a UK or EU-settled student" },
  { id: 'international', label: 'International', hint: "I'm studying from outside the UK" },
];

/** @type {VisaStatusOption[]} */
export const VISA_STATUS_OPTIONS = [
  { id: 'not_started', label: "No, I haven't started yet", hint: "We'll help you get started" },
  { id: 'having_issues', label: "No, I'm having issues", hint: "We'll connect you with support" },
  {
    id: 'waiting',
    label: 'Yes, waiting for confirmation',
    hint: "Hang tight — we'll keep you informed",
  },
  { id: 'received', label: "Yes, I've received it", hint: "You're all set on the visa front" },
];

/**
 * Topics a student can choose to show on their personalised home page.
 * Mirrors the dashboard's optional sections — the `id`s here must match
 * the section ids in DashboardScreen. Copy matches the Figma onboarding
 * "Build your UAL guide your way" frame.
 *
 * @type {InterestOption[]}
 */
export const INTEREST_OPTIONS = [
  {
    id: 'course',
    label: 'Course and studying',
    body: 'Explore study materials to support you throughout the year',
  },
  {
    id: 'access',
    label: 'IT & UAL access',
    body: 'Access UAL systems, get onto campus and find IT support',
  },
  {
    id: 'life',
    label: 'Life at UAL',
    body: 'Your Student Union, events and guides to help you settle into life at university',
  },
  {
    id: 'health',
    label: 'Health, wellbeing and safety',
    body: 'Access disability support, joining a GP and safety information',
  },
  {
    id: 'finances',
    label: 'Finances',
    body: 'Tuition fees, bank accounts, financial support and student discounts.',
  },
  {
    id: 'careers',
    label: 'Careers',
    body: 'Job opportunities and advice to help you build your future while you study',
  },
];
