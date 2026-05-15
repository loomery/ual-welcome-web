/**
 * @typedef {'Talk' | 'Tour' | 'Social' | 'Workshop'} EventCategory
 *
 * @typedef {Object} UalEvent
 * @property {string} id
 * @property {string} title
 * @property {string} description        Used as "About event" on the detail page.
 * @property {string} startsAt           ISO-8601 start datetime.
 * @property {string} endsAt             ISO-8601 end datetime.
 * @property {string} location           Venue / room name.
 * @property {string} college            College name or "All colleges".
 * @property {EventCategory} category
 * @property {string} [whatToBring]      Optional — shown in "What do I need to bring?" section.
 * @property {string} [externalUrl]      Optional — "View more about this event" CTA link.
 */

/** @type {UalEvent[]} */
export const EVENTS = [
  {
    id: 'welcome-talk-csm',
    title: 'CSM Welcome Talk',
    description:
      'A welcome introduction from the Dean of CSM. Includes a campus overview, key contacts, important dates for your first term, and Q&A.',
    startsAt: '2026-09-21T10:00:00+01:00',
    endsAt: '2026-09-21T11:30:00+01:00',
    location: 'Granary Building, Central Saint Martins, 1 Granary Square, London N1C 4AA',
    college: 'Central Saint Martins',
    category: 'Talk',
    whatToBring: 'All materials will be provided.',
    externalUrl: 'https://www.arts.ac.uk/colleges/central-saint-martins',
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
    whatToBring: 'Bring your student ID card.',
    externalUrl: 'https://www.arts.ac.uk/colleges/london-college-of-communication',
  },
  {
    id: 'sus-social',
    title: "Students' Union meet & mingle",
    description: 'Clubs, societies, free drinks — and get your SU card.',
    startsAt: '2026-09-23T18:00:00+01:00',
    endsAt: '2026-09-23T21:00:00+01:00',
    location: 'Arts SU, High Holborn',
    college: 'All colleges',
    category: 'Social',
    whatToBring: 'Nothing required — just show up.',
    externalUrl: 'https://www.arts.ac.uk/students/student-union',
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
    whatToBring: "Wear clothes you don't mind getting inky.",
    externalUrl: 'https://www.arts.ac.uk/colleges/camberwell-college-of-arts',
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
    whatToBring: 'Comfortable walking shoes recommended.',
    externalUrl: 'https://www.arts.ac.uk/colleges/london-college-of-fashion',
  },
];
