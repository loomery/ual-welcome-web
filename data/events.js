/**
 * @typedef {'Talk' | 'Tour' | 'Social' | 'Workshop'} EventCategory
 *
 * @typedef {Object} UalEvent
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} startsAt   ISO-8601 start datetime.
 * @property {string} endsAt     ISO-8601 end datetime.
 * @property {string} location
 * @property {string} college
 * @property {EventCategory} category
 */

/**
 * Placeholder event dataset. In production these would come from a
 * headless CMS / events API.
 *
 * @type {UalEvent[]}
 */
export const EVENTS = [
  {
    id: 'welcome-talk-csm',
    title: 'Welcome talk: Central Saint Martins',
    description: 'Meet your college leadership and get orientated.',
    startsAt: '2026-09-21T10:00:00+01:00',
    endsAt: '2026-09-21T11:30:00+01:00',
    location: 'The Street, Granary Building',
    college: 'Central Saint Martins',
    category: 'Talk',
  },
  {
    id: 'library-tour-lcc',
    title: 'Library tour',
    description: 'Walk through LCC library and get your reader card.',
    startsAt: '2026-09-22T13:00:00+01:00',
    endsAt: '2026-09-22T14:00:00+01:00',
    location: 'LCC Library, Ground floor',
    college: 'London College of Communication',
    category: 'Tour',
  },
  {
    id: 'sus-social',
    title: 'Students’ Union meet & mingle',
    description: 'Clubs, societies, free drinks — and get your SU card.',
    startsAt: '2026-09-23T18:00:00+01:00',
    endsAt: '2026-09-23T21:00:00+01:00',
    location: 'Arts SU, High Holborn',
    college: 'All colleges',
    category: 'Social',
  },
  {
    id: 'printmaking-taster',
    title: 'Printmaking taster workshop',
    description: 'Hands-on intro to screen printing at Camberwell.',
    startsAt: '2026-09-24T14:00:00+01:00',
    endsAt: '2026-09-24T16:00:00+01:00',
    location: 'Camberwell Print Rooms',
    college: 'Camberwell College of Arts',
    category: 'Workshop',
  },
  {
    id: 'east-bank-walk',
    title: 'East Bank campus walk',
    description: 'Guided walk around the new LCF campus at Stratford.',
    startsAt: '2026-09-25T11:00:00+01:00',
    endsAt: '2026-09-25T12:30:00+01:00',
    location: 'LCF East Bank',
    college: 'London College of Fashion',
    category: 'Tour',
  },
];
