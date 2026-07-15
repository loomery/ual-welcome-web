/**
 * The Explore section: the /explore landing (grids of service cards grouped by
 * theme) and its topic detail pages (/explore/{id} — Moving to the UK, Finance,
 * Health and wellbeing, Student life, Safety).
 *
 * Explore is the "everything beyond your course" hub — settling into London,
 * money, wellbeing, student life and safety. It mirrors the Studying section's
 * shape (landing card groups + topic pages); most leaf cards link out to the
 * main UAL site, reusing the destinations curated in data/help.js.
 *
 * Topic-page copy supports inline links written as [label](url) (RichText).
 *
 * @typedef {import('./checklist').Cta} Cta
 * @typedef {import('./checklist').HelpChannel} HelpChannel
 * @typedef {import('./studying').ServiceCard} ServiceCard
 * @typedef {import('./studying').TopicSection} TopicSection
 * @typedef {import('./studying').Topic} Topic
 */

// TODO(UAL): confirm the canonical UAL destinations for these placeholders.
const MOVING_TO_UK_URL = 'https://www.arts.ac.uk/study-at-ual/international/moving-to-the-uk';
const IMMIGRATION_URL = 'https://www.arts.ac.uk/study-at-ual/international/immigration-and-visas';
const FEES_FUNDING_URL = 'https://www.arts.ac.uk/students/student-services/fees-and-funding';
const SCHOLARSHIPS_URL = 'https://www.arts.ac.uk/study-at-ual/fees-and-funding/scholarships-search';
const ARTS_TEMPS_URL = 'https://www.arts.ac.uk/students/careers-and-employability/arts-temps';
const WELLBEING_URL = 'https://www.arts.ac.uk/students/wellbeing';
const DISABILITY_URL = 'https://www.arts.ac.uk/students/student-services/disability-and-dyslexia';
const LANGUAGE_URL = 'https://www.arts.ac.uk/study-at-ual/language-centre';
const COUNSELLING_URL =
  'https://www.arts.ac.uk/students/student-services/counselling-health-advice-and-chaplaincy';
const ARTS_SU_URL = 'https://www.arts-su.com/';
const ARTS_SU_ACTIVITIES_URL = 'https://www.arts-su.com/activities';
const HEALTH_SAFETY_URL = 'https://www.arts.ac.uk/students/health-and-safety-for-students';
const STUDENT_SECURITY_URL =
  'https://www.arts.ac.uk/students/health-and-safety-for-students/student-security';
const WITNESS_CRIME_URL =
  'https://www.arts.ac.uk/students/health-and-safety-for-students/student-security/what-to-do-if-you-witness-a-crime';

/** The five card groups on the /explore landing. @type {TopicSection[]} */
export const EXPLORE_LANDING = [
  {
    heading: 'Moving to the UK',
    internationalOnly: true,
    cards: [
      {
        id: 'uk-guide',
        label: 'UK guide',
        body: 'British culture, money, healthcare and settling into life in the UK.',
        href: '/explore/moving-to-the-uk/uk-guide',
      },
      {
        id: 'immigration-visas',
        label: 'Immigration and visas',
        body: 'Find out about regulations to enter, study and work in the UK.',
        href: IMMIGRATION_URL,
      },
      {
        id: 'uk-banking',
        label: 'UK banking',
        body: 'Save on potential overseas bank charges on your bills and everyday things.',
        href: '/checklist/uk-bank',
      },
    ],
    link: { label: 'View more services', href: '/explore/moving-to-the-uk' },
  },
  {
    heading: 'Finance',
    cards: [
      {
        id: 'fees-funding',
        label: 'Fees and funding',
        body: 'Explore how to fund your studies and get advice on your fees and finances.',
        href: FEES_FUNDING_URL,
      },
      {
        id: 'scholarships',
        label: 'Scholarships',
        body: 'Help fund your course with scholarships, bursaries, loans and more.',
        href: SCHOLARSHIPS_URL,
      },
      {
        id: 'earn-while-you-study',
        label: 'Earn while you study',
        body: "Arts Temps connects UAL's creatives with paid roles, from temporary to permanent.",
        href: ARTS_TEMPS_URL,
      },
    ],
    link: { label: 'View more services', href: '/explore/finance' },
  },
  {
    heading: 'Health and wellbeing',
    cards: [
      {
        id: 'your-health-wellbeing',
        label: 'Your Health and wellbeing',
        body: 'Look after your health and wellbeing while studying.',
        href: WELLBEING_URL,
      },
      {
        id: 'disability-support',
        label: 'Disability support',
        body: 'Professional advice and support for students who are disabled and neurodivergent.',
        href: DISABILITY_URL,
      },
      {
        id: 'language-support',
        label: 'Language support',
        body: 'English language support for those who speak it as a second language.',
        href: LANGUAGE_URL,
        internationalOnly: true,
      },
    ],
    link: { label: 'View more services', href: '/explore/health-and-wellbeing' },
  },
  {
    heading: 'Student life',
    cards: [
      {
        id: 'arts-su',
        label: 'The Arts Student Union (Arts SU)',
        body: 'An independent, member-led organisation. Arts SU is run by students, for students.',
        href: ARTS_SU_URL,
      },
      {
        id: 'events',
        label: 'Events',
        body: "Check out What's On, from Welcome Fair to summer degree shows, there's something for everyone.",
        href: '/explore/student-life/events',
      },
      {
        id: 'sports-societies',
        label: 'Sports and societies',
        body: 'With over 40 societies and 17 sports clubs to join, you can find your community.',
        href: ARTS_SU_ACTIVITIES_URL,
      },
    ],
    link: { label: 'View more services', href: '/explore/student-life' },
  },
  {
    heading: 'Safety',
    cards: [
      {
        id: 'health-and-safety',
        label: 'Health and safety',
        body: 'See how to stay safe during your time at UAL.',
        href: HEALTH_SAFETY_URL,
      },
      {
        id: 'reporting-a-crime',
        label: 'Reporting a crime',
        body: 'Understand what to do if you witness a crime on or off college grounds.',
        href: WITNESS_CRIME_URL,
      },
      {
        id: 'staying-safe-london',
        label: 'Staying safe in London',
        body: 'Explore who to contact and how to stay safe during your studies.',
        href: STUDENT_SECURITY_URL,
      },
    ],
    link: { label: 'View more services', href: '/explore/safety' },
  },
];

/** @type {Topic[]} */
export const EXPLORE_TOPICS = [
  {
    id: 'moving-to-the-uk',
    title: 'Moving to the UK',
    intro:
      'Everything you need to settle into life in the UK — from visas and banking to healthcare and getting around.',
    sections: [
      {
        cards: [
          {
            id: 'uk-guide',
            label: 'UK guide',
            body: 'British culture, money, healthcare and settling into life in the UK.',
            href: '/explore/moving-to-the-uk/uk-guide',
          },
          {
            id: 'immigration-visas',
            label: 'Immigration and visas',
            body: 'Find out about regulations to enter, study and work in the UK.',
            href: IMMIGRATION_URL,
          },
          {
            id: 'uk-banking',
            label: 'UK banking',
            body: 'Save on potential overseas bank charges on your bills and everyday things.',
            href: '/checklist/uk-bank',
          },
          {
            id: 'register-doctor',
            label: 'Register with a doctor (NHS)',
            body: 'How to register with a GP and access NHS healthcare as a student.',
            href: 'https://www.arts.ac.uk/students/welcome/your-journey-to-UAL/life-in-london',
          },
          {
            id: 'travel-to-uk',
            label: 'Travel to the UK',
            body: 'Plan your journey and arrival for the start of your studies.',
            href: 'https://www.arts.ac.uk/students/welcome/your-journey-to-UAL/coming-to-the-uk',
          },
        ],
      },
    ],
    readMore: { label: 'Read more about moving to the UK', href: MOVING_TO_UK_URL },
  },
  {
    id: 'finance',
    title: 'Finance',
    intro: 'Fund your studies and manage your money, from fees and scholarships to paid work.',
    sections: [
      {
        cards: [
          {
            id: 'fees-funding',
            label: 'Fees and funding',
            body: 'Explore how to fund your studies and get advice on your fees and finances.',
            href: FEES_FUNDING_URL,
          },
          {
            id: 'scholarships',
            label: 'Scholarships',
            body: 'Help fund your course with scholarships, bursaries, loans and more.',
            href: SCHOLARSHIPS_URL,
          },
          {
            id: 'earn-while-you-study',
            label: 'Earn while you study',
            body: "Arts Temps connects UAL's creatives with paid roles, from temporary to permanent.",
            href: ARTS_TEMPS_URL,
          },
          {
            id: 'money-advice',
            label: 'Money advice',
            body: 'Budgeting help, hardship funds and one-to-one money guidance.',
            href: 'https://www.arts.ac.uk/students/student-advice/money-and-housing-advice',
          },
        ],
      },
    ],
    readMore: { label: 'Read more about fees and funding', href: FEES_FUNDING_URL },
  },
  {
    id: 'health-and-wellbeing',
    title: 'Health and wellbeing',
    intro:
      'Looking after your health and wellbeing is an important part of student life. Our support teams and community are here to help.',
    sections: [
      {
        cards: [
          {
            id: 'your-health-wellbeing',
            label: 'Your Health and wellbeing',
            body: 'Look after your health and wellbeing while studying.',
            href: WELLBEING_URL,
          },
          {
            id: 'disability-support',
            label: 'Disability support',
            body: 'Professional advice and support for students who are disabled and neurodivergent.',
            href: DISABILITY_URL,
          },
          {
            id: 'language-support',
            label: 'Language support',
            body: 'English language support for those who speak it as a second language.',
            href: LANGUAGE_URL,
            internationalOnly: true,
          },
          {
            id: 'counselling-chaplaincy',
            label: 'Counselling, Health Advice and Chaplaincy',
            body: 'Access support for mental health, health concerns and faith and spiritual support.',
            href: COUNSELLING_URL,
          },
          {
            id: 'mental-health-advice',
            label: 'Mental health advice',
            body: 'Get support from Mental Health Advisers with the impact of your mental health difficulties.',
            href: COUNSELLING_URL,
          },
        ],
      },
    ],
    readMore: { label: 'Visit the Wellbeing Hub', href: WELLBEING_URL },
  },
  {
    id: 'student-life',
    title: 'Student life',
    intro:
      "There's more to UAL than your course. Find your community through the Students' Union, events, clubs and societies.",
    sections: [
      {
        cards: [
          {
            id: 'arts-su',
            label: 'The Arts Student Union (Arts SU)',
            body: 'An independent, member-led organisation. Arts SU is run by students, for students.',
            href: ARTS_SU_URL,
          },
          {
            id: 'events',
            label: 'Events',
            body: "Check out What's On, from Welcome Fair to summer degree shows, there's something for everyone.",
            href: '/explore/student-life/events',
          },
          {
            id: 'sports-societies',
            label: 'Sports and societies',
            body: 'With over 40 societies and 17 sports clubs to join, you can find your community.',
            href: ARTS_SU_ACTIVITIES_URL,
          },
          {
            id: 'volunteering',
            label: 'Volunteering',
            body: 'Give back, build skills and meet people through student volunteering.',
            href: 'https://www.arts-su.com/opportunities/volunteering',
          },
        ],
      },
    ],
    readMore: { label: 'Visit Arts SU', href: ARTS_SU_URL },
  },
  {
    id: 'safety',
    title: 'Safety',
    intro: 'Know how to stay safe on and off campus, and who to contact if something goes wrong.',
    sections: [
      {
        cards: [
          {
            id: 'health-and-safety',
            label: 'Health and safety',
            body: 'Inductions, fire safety and staying safe on campus.',
            href: HEALTH_SAFETY_URL,
          },
          {
            id: 'reporting-a-crime',
            label: 'Reporting a crime',
            body: 'Understand what to do if you witness a crime on or off college grounds.',
            href: WITNESS_CRIME_URL,
          },
          {
            id: 'staying-safe-london',
            label: 'Staying safe in London',
            body: 'Personal safety advice and how UAL student security can help.',
            href: STUDENT_SECURITY_URL,
          },
        ],
      },
    ],
    readMore: { label: 'Read more about student security', href: STUDENT_SECURITY_URL },
  },
];

/**
 * A topic's sections filtered for the student's cohort and type (mirrors the
 * Studying helper): drops cohort-gated sections and international-only cards
 * that don't apply to this student.
 *
 * @param {Topic} topic
 * @param {string} [studentType]    'domestic' | 'international'
 * @param {string} [studentStatus]  'new' | 'returning'; defaults to 'new'
 * @returns {TopicSection[]}
 */
export function visibleTopicSections(topic, studentType, studentStatus = 'new') {
  return topic.sections
    .filter((s) => !s.statuses || s.statuses.includes(studentStatus))
    .map((s) =>
      s.cards
        ? {
            ...s,
            cards: s.cards.filter((c) => !c.internationalOnly || studentType === 'international'),
          }
        : s,
    );
}

/**
 * The /explore landing groups for a student's type: drops international-only
 * groups (e.g. Moving to the UK) and international-only cards for domestic
 * students.
 *
 * @param {string} [studentType]  'domestic' | 'international'
 * @returns {TopicSection[]}
 */
export function visibleExploreLanding(studentType) {
  const international = studentType === 'international';
  return EXPLORE_LANDING.filter((g) => !g.internationalOnly || international).map((g) => ({
    ...g,
    cards: g.cards.filter((c) => !c.internationalOnly || international),
  }));
}
