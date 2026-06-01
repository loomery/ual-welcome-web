/**
 * Help & support categories, grouped into sections.
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
 * @property {string} section            Section id — see SECTIONS
 * @property {string} title
 * @property {string} shortDescription   Shown in the categories list
 * @property {string} description        Shown at top of the detail page
 * @property {ContactMethod[]} contacts
 * @property {string} ctaLabel
 * @property {string} ctaHref
 *
 * @typedef {Object} HelpSection
 * @property {string} id
 * @property {string} label
 */

/**
 * Ordered sections for the support list. Categories render grouped under
 * these headings, in this order.
 *
 * @type {HelpSection[]}
 */
export const SECTIONS = [
  { id: 'moving-uk', label: 'Moving to the UK' },
  { id: 'safety', label: 'Safety' },
  { id: 'wellbeing', label: 'Wellbeing and support' },
  { id: 'technology', label: 'Technology support & guides' },
  { id: 'academic', label: 'Academic orientation' },
  { id: 'money-housing', label: 'Money & housing' },
  { id: 'more-support', label: 'More support' },
];

/** @type {HelpCategory[]} */
export const HELP_CATEGORIES = [
  // ─── Moving to the UK ──────────────────────────────────────────────
  {
    id: 'immigration-visas',
    section: 'moving-uk',
    title: 'Immigration & visas',
    shortDescription: 'Student visas, immigration advice, what you need to study in the UK',
    description:
      'Guidance on student visas and immigration for international students — including what you need to study in the UK and where to get advice.',
    contacts: [
      {
        type: 'online',
        label: 'Online',
        value: 'Immigration and visas',
        href: 'https://www.arts.ac.uk/study-at-ual/international/immigration-and-visas',
      },
      {
        type: 'online',
        label: 'Student visa',
        value: 'Student visa guidance',
        href: 'https://www.arts.ac.uk/study-at-ual/international/immigration-and-visas/student-visa',
      },
    ],
    ctaLabel: 'Visit Immigration & visas',
    ctaHref: 'https://www.arts.ac.uk/study-at-ual/international/immigration-and-visas',
  },
  {
    id: 'bank-account',
    section: 'moving-uk',
    title: 'Setting up a bank account',
    shortDescription: 'Opening a UK bank account as a student',
    description:
      'How to open a UK bank account when you arrive, including the documents you will need.',
    contacts: [
      {
        type: 'online',
        label: 'Life in London',
        value: 'Life in London guide',
        href: 'https://www.arts.ac.uk/students/welcome/your-journey-to-UAL/life-in-london',
      },
      {
        type: 'online',
        label: 'Moving to the UK',
        value: 'Bank accounts',
        note: 'Bank account section',
        href: 'https://www.arts.ac.uk/study-at-ual/international/moving-to-the-uk#bank',
      },
    ],
    ctaLabel: 'Read the Life in London guide',
    ctaHref: 'https://www.arts.ac.uk/students/welcome/your-journey-to-UAL/life-in-london',
  },
  {
    id: 'register-doctor',
    section: 'moving-uk',
    title: 'Register with a doctor (NHS)',
    shortDescription: 'GP registration and accessing NHS healthcare',
    description:
      'How to register with a doctor (GP) and access NHS healthcare as a student in the UK.',
    contacts: [
      {
        type: 'online',
        label: 'Life in London',
        value: 'Register with a doctor',
        note: 'Register with a doctor section',
        href: 'https://www.arts.ac.uk/students/welcome/your-journey-to-UAL/life-in-london',
      },
      {
        type: 'online',
        label: 'Moving to the UK',
        value: 'Healthcare',
        note: 'Healthcare section',
        href: 'https://www.arts.ac.uk/study-at-ual/international/moving-to-the-uk',
      },
    ],
    ctaLabel: 'Read the Life in London guide',
    ctaHref: 'https://www.arts.ac.uk/students/welcome/your-journey-to-UAL/life-in-london',
  },
  {
    id: 'travel-to-uk',
    section: 'moving-uk',
    title: 'Travel to the UK',
    shortDescription: 'Planning your journey and arrival',
    description: 'A guide to travelling to the UK and arriving for the start of your studies.',
    contacts: [
      {
        type: 'online',
        label: 'Online',
        value: 'Coming to the UK',
        note: 'Travel section',
        href: 'https://www.arts.ac.uk/students/welcome/your-journey-to-UAL/coming-to-the-uk',
      },
    ],
    ctaLabel: 'Read the travel guide',
    ctaHref: 'https://www.arts.ac.uk/students/welcome/your-journey-to-UAL/coming-to-the-uk',
  },

  // ─── Safety ────────────────────────────────────────────────────────
  {
    id: 'emergency',
    section: 'safety',
    title: 'What to do in an emergency',
    shortDescription: 'Emergencies, witnessing a crime, and urgent support',
    description:
      'What to do in an emergency — who to contact if you witness a crime, and where to find urgent wellbeing support.',
    contacts: [
      {
        type: 'online',
        label: 'Student security',
        value: 'If you witness a crime',
        href: 'https://www.arts.ac.uk/students/health-and-safety-for-students/student-security/what-to-do-if-you-witness-a-crime',
      },
      {
        type: 'online',
        label: 'Wellbeing',
        value: 'Wellbeing hub',
        note: 'General wellbeing and urgent support',
        href: 'https://www.arts.ac.uk/students/wellbeing',
      },
    ],
    ctaLabel: 'What to do if you witness a crime',
    ctaHref:
      'https://www.arts.ac.uk/students/health-and-safety-for-students/student-security/what-to-do-if-you-witness-a-crime',
  },
  {
    id: 'health-safety',
    section: 'safety',
    title: 'Health & safety info',
    shortDescription: 'Health and safety inductions, fire safety and evacuations, security',
    description:
      'Information about health and safety on campus — inductions, fire evacuation procedures, and staying safe.',
    contacts: [
      {
        type: 'online',
        label: 'Online',
        value: 'Health and safety for students',
        href: 'https://www.arts.ac.uk/students/health-and-safety-for-students',
      },
    ],
    ctaLabel: 'Visit Health & safety',
    ctaHref: 'https://www.arts.ac.uk/students/health-and-safety-for-students',
  },
  {
    id: 'staying-safe-london',
    section: 'safety',
    title: 'Staying safe in London',
    shortDescription: 'Personal safety and student security',
    description:
      'Advice on staying safe in London, personal security, and how UAL student security can help.',
    contacts: [
      {
        type: 'online',
        label: 'Online',
        value: 'Student security',
        href: 'https://www.arts.ac.uk/students/health-and-safety-for-students/student-security',
      },
    ],
    ctaLabel: 'Visit Student security',
    ctaHref: 'https://www.arts.ac.uk/students/health-and-safety-for-students/student-security',
  },

  // ─── Wellbeing and support ─────────────────────────────────────────
  {
    id: 'health-wellbeing',
    section: 'wellbeing',
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
    section: 'wellbeing',
    title: 'Disability & Dyslexia support',
    shortDescription: 'DSA, reasonable adjustments, learning support',
    description:
      'The Disability and Dyslexia Service helps with Disabled Students Allowance, reasonable adjustments, and specialist learning support.',
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
        value: 'Disability and Dyslexia',
        href: 'https://www.arts.ac.uk/students/student-services/disability-and-dyslexia',
      },
    ],
    ctaLabel: 'Visit Disability & Dyslexia support',
    ctaHref: 'https://www.arts.ac.uk/students/student-services/disability-and-dyslexia',
  },
  {
    id: 'language-support',
    section: 'wellbeing',
    title: 'Language Development support',
    shortDescription: 'English language and academic communication support',
    description:
      'The Language Centre offers English language and academic communication support for students.',
    contacts: [
      {
        type: 'online',
        label: 'Online',
        value: 'Language Centre',
        href: 'https://www.arts.ac.uk/study-at-ual/language-centre',
      },
    ],
    ctaLabel: 'Visit the Language Centre',
    ctaHref: 'https://www.arts.ac.uk/study-at-ual/language-centre',
  },

  // ─── Technology support & guides ───────────────────────────────────
  {
    id: 'it-accounts',
    section: 'technology',
    title: 'IT & accounts',
    shortDescription:
      'Account set-up — email, multi-factor authentication, Moodle — and IT support',
    description:
      'IT Services help you set up your UAL account — email, multi-factor authentication and Moodle — and with login issues, passwords, software access, hardware faults, and network access.',
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
        value: 'IT Services',
        href: 'https://www.arts.ac.uk/students/it-services',
      },
    ],
    ctaLabel: 'Visit IT Services',
    ctaHref: 'https://www.arts.ac.uk/students/it-services',
  },
  {
    id: 'borrow-laptop',
    section: 'technology',
    title: 'Borrow a laptop',
    shortDescription: 'Laptop loans, equipment and library services',
    description:
      'Borrow a laptop and access equipment through Library Services and your arrival essentials.',
    contacts: [
      {
        type: 'online',
        label: 'Library services',
        value: 'Get support: skills',
        note: 'Library services section',
        href: 'https://www.arts.ac.uk/students/welcome/your-journey-to-UAL/get-support/skills',
      },
      {
        type: 'online',
        label: 'Arrival essentials',
        value: 'Books and materials',
        note: 'Books and materials section',
        href: 'https://www.arts.ac.uk/students/welcome/your-journey-to-UAL/arrival-essentials',
      },
    ],
    ctaLabel: 'Visit Library services',
    ctaHref: 'https://www.arts.ac.uk/students/welcome/your-journey-to-UAL/get-support/skills',
  },
  {
    id: 'workshops-studios',
    section: 'technology',
    title: 'Workshops & studio bookings',
    shortDescription: 'Find and book technical workshops and studio spaces',
    description:
      'Find and book technical workshops and studio spaces. Browse the workshop events happening during Welcome Week.',
    contacts: [
      {
        type: 'online',
        label: 'In the app',
        value: 'Browse workshop events',
        href: '/events',
      },
    ],
    ctaLabel: 'Browse workshop events',
    ctaHref: '/events',
  },

  // ─── Academic orientation ──────────────────────────────────────────
  {
    id: 'online-study-tools',
    section: 'academic',
    title: 'Find online study tools',
    shortDescription: 'Digital learning tools and studying online',
    description:
      'Discover the digital learning tools available at UAL and how to make the most of studying online.',
    contacts: [
      {
        type: 'online',
        label: 'Online',
        value: 'Studying online',
        href: 'https://www.arts.ac.uk/about-ual/learning-and-teaching/digital-learning/studying-online',
      },
    ],
    ctaLabel: 'Explore digital learning',
    ctaHref:
      'https://www.arts.ac.uk/about-ual/learning-and-teaching/digital-learning/studying-online',
  },
  {
    id: 'libraries',
    section: 'academic',
    title: 'Use of libraries',
    shortDescription: 'Library services, collections and study spaces',
    description:
      'Explore UAL Library Services — collections, online resources, study spaces, and how to borrow books and equipment.',
    contacts: [
      {
        type: 'online',
        label: 'Online',
        value: 'Library Services',
        href: 'https://www.arts.ac.uk/students/library-services',
      },
    ],
    ctaLabel: 'Visit Library Services',
    ctaHref: 'https://www.arts.ac.uk/students/library-services',
  },

  // ─── Money & housing ───────────────────────────────────────────────
  {
    id: 'finance',
    section: 'money-housing',
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
    section: 'money-housing',
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

  // ─── More support ──────────────────────────────────────────────────
  {
    id: 'college-contacts',
    section: 'more-support',
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
    section: 'more-support',
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
