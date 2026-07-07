/**
 * Static reference data for the onboarding flow. Mirrors the buildings
 * dataset for college choice, but keeps the option-set decoupled from
 * the 3D scene config (different concerns).
 *
 * @typedef {'new' | 'returning'} StudentStatus
 * @typedef {'domestic' | 'international'} StudentType
 *
 * @typedef {Object} CollegeOption
 * @property {string} id        Matches data/buildings.js → Building.id
 * @property {string} name      Full college name (e.g. "Central Saint Martins")
 * @property {string} short     Short label for compact contexts ("CSM")
 * @property {string} area      Where the campus is in London — used in the dashboard hero
 * @property {string} eventsUrl Deep-link to the college's What's On page on arts.ac.uk
 *
 * @typedef {Object} StudentStatusOption
 * @property {StudentStatus} id
 * @property {string} label
 *
 * @typedef {Object} StudentTypeOption
 * @property {StudentType} id
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
    id: 'ftti',
    name: 'Fashion Textiles and Technology Institute',
    short: 'FTTI',
    area: 'East Bank, Stratford',
    eventsUrl: 'https://www.arts.ac.uk/whats-on',
  },
  {
    id: 'dai',
    name: 'UAL School of Pre-degree Studies',
    short: 'Pre-degree',
    area: 'London',
    eventsUrl: 'https://www.arts.ac.uk/whats-on',
  },
];

/** @type {StudentStatusOption[]} */
export const STUDENT_STATUS_OPTIONS = [
  { id: 'new', label: 'New student' },
  { id: 'returning', label: 'Returning student' },
];

/** @type {StudentTypeOption[]} */
export const STUDENT_TYPE_OPTIONS = [
  { id: 'domestic', label: 'UK / Domestic', hint: 'Already living in the UK before studying at UAL' },
  { id: 'international', label: 'International', hint: 'Moving to the UK to study at UAL' },
];

/**
 * Topics a student can choose to show on their personalised home page.
 * Mirrors the dashboard's optional sections — the `id`s here must match
 * the section ids in DashboardScreen.
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
    label: 'Student life',
    body: 'Your Student Union, events and guides to help you settle into life at university',
  },
  {
    id: 'health',
    label: 'Health and wellbeing',
    body: 'Access disability support, joining a GP and wellbeing services',
  },
  {
    id: 'safety',
    label: 'Safety',
    body: 'Stay safe on and off campus and find support when you need it',
  },
  {
    id: 'finances',
    label: 'Finances',
    body: 'Tuition fees, bank accounts, financial support and student discounts',
  },
];
