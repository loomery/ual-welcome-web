/**
 * Help & support categories.
 *
 * @typedef {Object} ContactMethod
 * @property {'email'|'phone'|'online'|'in-person'} type
 * @property {string} label
 * @property {string} value
 * @property {string} [note]     Optional sub-label (e.g. "24 hours, 7 days a week")
 * @property {string} [href]     Optional link for email/online types
 *
 * @typedef {Object} HelpCategory
 * @property {string} id
 * @property {string} title
 * @property {string} shortDescription   Shown in the categories list
 * @property {string} description        Shown at top of the detail page
 * @property {ContactMethod[]} contacts
 * @property {string} ctaLabel
 * @property {string} ctaHref
 */

/** @type {HelpCategory[]} */
export const HELP_CATEGORIES = [
  {
    id: 'it-accounts',
    title: 'IT & accounts',
    shortDescription: 'Login issues, passwords, software, hardware',
    description:
      'IT Services help with login issues, passwords, UAL account setup, software access, hardware faults, and network access.',
    contacts: [
      {
        type: 'email',
        label: 'Email',
        value: 'servicedesk@arts.ac.uk',
        href: 'mailto:servicedesk@arts.ac.uk',
      },
      {
        type: 'phone',
        label: 'Phone',
        value: '+44 (0)20 7514 9898',
        note: '24 hours, 7 days a week',
        href: 'tel:+442075149898',
      },
      {
        type: 'online',
        label: 'Online',
        value: 'Send a message via UAL portal',
        href: 'https://www.arts.ac.uk/students/it',
      },
    ],
    ctaLabel: 'Visit IT help page',
    ctaHref: 'https://www.arts.ac.uk/students/it',
  },
  {
    id: 'finance',
    title: 'Finance queries',
    shortDescription: 'Fees, student loans, bursaries, payments',
    description:
      'The Finance team can help with tuition fee queries, student loan issues, bursary applications, and payment plans.',
    contacts: [
      {
        type: 'email',
        label: 'Email',
        value: 'studentfinance@arts.ac.uk',
        href: 'mailto:studentfinance@arts.ac.uk',
      },
      {
        type: 'online',
        label: 'Online',
        value: 'Student Finance pages',
        href: 'https://www.arts.ac.uk/students/student-services/fees-and-funding',
      },
    ],
    ctaLabel: 'Visit Finance help page',
    ctaHref: 'https://www.arts.ac.uk/students/student-services/fees-and-funding',
  },
  {
    id: 'accommodation',
    title: 'Accommodation help',
    shortDescription: 'Halls of residence, private housing, contracts',
    description:
      'Get support with UAL halls of residence, private housing advice, tenancy contracts, and housing rights.',
    contacts: [
      {
        type: 'email',
        label: 'Email',
        value: 'accommodation@arts.ac.uk',
        href: 'mailto:accommodation@arts.ac.uk',
      },
      {
        type: 'online',
        label: 'Online',
        value: 'Accommodation support',
        href: 'https://www.arts.ac.uk/students/student-services/accommodation',
      },
    ],
    ctaLabel: 'Visit Accommodation page',
    ctaHref: 'https://www.arts.ac.uk/students/student-services/accommodation',
  },
  {
    id: 'health-wellbeing',
    title: 'Health & wellbeing',
    shortDescription: 'Counselling, mental health, GP registration',
    description:
      'UAL offers a range of wellbeing services including counselling, mental health support, and help with GP registration.',
    contacts: [
      {
        type: 'email',
        label: 'Email',
        value: 'wellbeing@arts.ac.uk',
        href: 'mailto:wellbeing@arts.ac.uk',
      },
      {
        type: 'online',
        label: 'Online',
        value: 'Wellbeing Hub',
        href: 'https://www.arts.ac.uk/students/student-services/health-wellbeing-and-support-for-students',
      },
    ],
    ctaLabel: 'Visit Wellbeing Hub',
    ctaHref:
      'https://www.arts.ac.uk/students/student-services/health-wellbeing-and-support-for-students',
  },
  {
    id: 'disability',
    title: 'Disability & additional needs',
    shortDescription: 'DSA, reasonable adjustments, learning support',
    description:
      'Disability Advisory Service (DAS) helps with Disabled Students Allowance, reasonable adjustments, and specialist learning support.',
    contacts: [
      {
        type: 'email',
        label: 'Email',
        value: 'disability@arts.ac.uk',
        href: 'mailto:disability@arts.ac.uk',
      },
      {
        type: 'online',
        label: 'Online',
        value: 'Disability Advisory Service',
        href: 'https://www.arts.ac.uk/students/student-services/disability-and-dyslexia',
      },
    ],
    ctaLabel: 'Visit Disability support page',
    ctaHref: 'https://www.arts.ac.uk/students/student-services/disability-and-dyslexia',
  },
  {
    id: 'health-safety',
    title: 'Health and safety',
    shortDescription: 'Health and safety inductions, fire safety and evacuations, security',
    description:
      'Information about health and safety inductions, fire evacuation procedures, and campus security contacts.',
    contacts: [
      {
        type: 'online',
        label: 'Online',
        value: 'Health and safety information',
        href: 'https://www.arts.ac.uk/students/student-services',
      },
    ],
    ctaLabel: 'Visit Health and safety page',
    ctaHref: 'https://www.arts.ac.uk/students/student-services',
  },
  {
    id: 'college-contacts',
    title: 'College-specific contacts',
    shortDescription: 'Your college admin team and course office',
    description:
      'Each UAL college has its own admin team and course office. Find the right contact for your college below.',
    contacts: [
      {
        type: 'online',
        label: 'Online',
        value: 'Find your college contact',
        href: 'https://www.arts.ac.uk/colleges',
      },
    ],
    ctaLabel: 'Find your college',
    ctaHref: 'https://www.arts.ac.uk/colleges',
  },
  {
    id: 'general-support',
    title: 'General student support',
    shortDescription:
      'Everything else. UAL has a wide range of support services that are always here for you',
    description:
      'Student Services at UAL covers a wide range of support — from academic advice to personal support. If you are not sure where to go, start here.',
    contacts: [
      {
        type: 'online',
        label: 'Online',
        value: 'Student Services',
        href: 'https://www.arts.ac.uk/students/student-services',
      },
    ],
    ctaLabel: 'Visit Student Services',
    ctaHref: 'https://www.arts.ac.uk/students/student-services',
  },
];

export const HELP_BY_ID = Object.fromEntries(HELP_CATEGORIES.map((h) => [h.id, h]));
