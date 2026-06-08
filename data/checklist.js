/**
 * Essential tasks for new UAL students.
 *
 * Data model:
 *
 * Task
 *  ├─ id              string — used as URL slug (/checklist/[id])
 *  ├─ title           string
 *  ├─ tag             'essential'
 *  ├─ shortDescription  shown in the task list card
 *  ├─ sections[]      rich content blocks on the detail page
 *  ├─ steps[]         optional sub-tasks with individual completion tracking
 *  └─ cta             { label, href } — primary action button on detail page
 *
 * Progress is tracked separately in localStorage:
 *   'ual:task:status:v1'  →  Record<taskId, 'not-started'|'in-progress'|'complete'>
 *   'ual:task:steps:v1'   →  Record<taskId, Record<stepId, boolean>>
 *
 * @typedef {'essential'} TaskTag
 * @typedef {'not-started'|'in-progress'|'complete'} TaskStatus
 *
 * @typedef {Object} ContentSection
 * @property {string} title
 * @property {string} [body]
 * @property {'text'|'accordion'|'note'} [type]  'note' renders a muted info box
 * @property {string[]} [items]
 *
 * @typedef {Object} Cta
 * @property {string} label
 * @property {string} href
 *
 * @typedef {Object} AppLinks
 * @property {string} [apple]    App Store URL
 * @property {string} [android]  Google Play URL
 *
 * @typedef {Object} Step
 * @property {string} id
 * @property {string} title
 * @property {string} [href]         Makes the title itself a link
 * @property {string} [description]  Supporting copy under the title
 * @property {string[]} [details]    Expandable "what you'll need to do" list
 * @property {Cta} [cta]             Inline action link, e.g. "Go to Moodle →"
 * @property {AppLinks} [apps]       App download buttons (Apple / Android)
 * @property {string} [note]         Muted inline badge, e.g. availability caveat
 *
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {TaskTag} tag
 * @property {string} shortDescription
 * @property {ContentSection[]} [sections]
 * @property {Step[]} [steps]
 * @property {Cta} [cta]         Primary action button (omit for step-only tasks)
 * @property {Cta} [helpLink]    Secondary, link-styled help action
 * @property {boolean} [internationalOnly]  If true, only shown to international students
 */

/** @type {Task[]} */
export const TASKS = [
  {
    id: 'ual-email',
    title: 'Access your UAL email',
    tag: 'essential',
    shortDescription: 'This email is needed to enrol and get setup on all available UAL services.',
    sections: [
      {
        title: 'What your UAL email is for',
        body: 'This email is needed to enrol and get setup on all available UAL services. You will use it to receive important communications from UAL throughout your studies.',
        type: 'text',
      },
      {
        title: 'How to access your UAL email',
        body: 'You\'ll be sent an email labelled "[email]" containing your network username and a link asking you to set a password 72 hours after official acceptance and within 10 weeks of your course start date.',
        type: 'text',
      },
      {
        title: 'Contact IT services for help',
        type: 'accordion',
        items: ['Email: servicedesk@arts.ac.uk', 'Phone number: +44 (0)20 7514 9898'],
      },
    ],
    cta: {
      label: 'Go to enrolment email',
      href: 'https://www.arts.ac.uk/students/welcome/your-journey-to-UAL/get-connected',
    },
  },
  {
    id: 'enrol',
    title: 'Enrol at UAL',
    tag: 'essential',
    shortDescription: 'Register as an official UAL student.',
    steps: [
      {
        id: 'portal-login',
        title: 'Log in to your UAL Portal',
        href: 'https://www.arts.ac.uk/study-at-ual/how-to-enrol',
      },
      {
        id: 'enrolment-form',
        title: 'Complete the online enrolment form',
        details: [
          'Add your student number. Find in the portal.',
          "Upload copies of: Passport (Birth certificate if you don't have a passport) and Academic qualifications.",
          'Confirm tuition payment/funding.',
          'Upload a passport-sized photo for your student ID card.',
        ],
      },
      {
        id: 'confirmation',
        title: 'Await your confirmation email',
      },
    ],
    cta: {
      label: 'Go to enrolment portal',
      href: 'https://www.arts.ac.uk/study-at-ual/how-to-enrol',
    },
  },
  {
    id: 'pay-tuition',
    title: 'Pay your tuition fees',
    tag: 'essential',
    shortDescription: 'Pay or confirm funding for your tuition fees to complete enrolment.',
    sections: [
      {
        title: 'Why this matters',
        body: 'You need to pay your tuition fees, or confirm how they will be funded (for example by a student loan or sponsor), before you can fully enrol at UAL.',
        type: 'text',
      },
      {
        title: 'How to pay',
        body: 'You can pay online, set up an instalment plan, or confirm your funding through the UAL fees pages. Check the deadlines and accepted payment methods before you start.',
        type: 'text',
      },
    ],
    cta: {
      label: 'Pay your tuition fees',
      href: 'https://www.arts.ac.uk/study-at-ual/how-to-enrol/pay-your-tuition-fees',
    },
  },
  {
    id: 'get-cas-number',
    title: 'Get your CAS number',
    tag: 'essential',
    internationalOnly: true,
    shortDescription: 'International students need a CAS to apply for a Student visa.',
    sections: [
      {
        title: 'What a CAS is',
        body: 'A CAS (Confirmation of Acceptance for Studies) is a reference number UAL issues to international students. You need it to apply for your Student visa.',
        type: 'text',
      },
      {
        title: 'How to get yours',
        body: 'UAL issues your CAS once you have met the conditions of your offer and confirmed your place. Follow the Student visa guidance to request it and check which documents you need.',
        type: 'text',
      },
    ],
    cta: {
      label: 'Student visa & CAS guidance',
      href: 'https://www.arts.ac.uk/study-at-ual/international/immigration-and-visas/student-visa',
    },
  },
  {
    id: 'student-id',
    title: 'Collect your student ID',
    tag: 'essential',
    shortDescription:
      'Get your ID card to access our college and institute buildings and facilities.',
    sections: [
      {
        title: 'What your student ID is for',
        body: "Your student ID card gives you access to all UAL buildings, libraries, and facilities. You'll also need it to prove your student status for discounts and services.",
        type: 'text',
      },
      {
        title: 'How to collect your card',
        body: "Your card will be ready to collect from your college's main reception once you have completed enrolment. Bring a form of photo ID when you collect it.",
        type: 'text',
      },
    ],
    cta: {
      label: 'Student ID card info',
      href: 'https://www.arts.ac.uk/study-at-ual/how-to-enrol/student-id-card-collection',
    },
  },
  {
    id: 'activate-accounts',
    title: 'Set up your digital accounts',
    tag: 'essential',
    shortDescription: 'The accounts you need to do setup for term',
    steps: [
      {
        id: 'mfa',
        title: 'Multi-factor authentication',
        description:
          'Multi-Factor Authentication (MFA) adds an extra layer of protection to your identity, your data and our systems.',
        cta: { label: 'Get started', href: 'https://aka.ms/mfasetup' },
      },
      {
        id: 'student-portal',
        title: 'Student portal',
        description: 'Get the latest UAL news, timetable and access available online resources.',
        // TODO(UAL): confirm the canonical Student portal URL.
        cta: { label: 'Go to Student portal', href: 'https://www.arts.ac.uk/students' },
      },
      {
        id: 'myual-app',
        title: 'Download your MyUAL app',
        description: 'Get the latest UAL news, timetable and access available online resources.',
        // TODO(UAL): replace with the real MyUAL App Store / Google Play links.
        apps: {
          apple: 'https://www.apple.com/app-store/',
          android: 'https://play.google.com/store',
        },
      },
      {
        id: 'moodle',
        title: 'Set up Moodle',
        description:
          'Moodle is your virtual learning environment, it has course materials, assignments, announcements.',
        note: 'Available after you have fully enrolled',
        cta: { label: 'Go to Moodle', href: 'https://moodle.arts.ac.uk' },
      },
      {
        id: 'seats-app',
        title: 'Download your SEAtS app',
        description:
          'You will need to mark your own attendance to sessions using the SEAtS mobile phone app once you start.',
        // TODO(UAL): replace with the real SEAtS App Store / Google Play links.
        apps: {
          apple: 'https://www.apple.com/app-store/',
          android: 'https://play.google.com/store',
        },
      },
    ],
    sections: [
      {
        type: 'note',
        title: 'About your timetable',
        body: "Your personal timetable won't be available until your course starts. Check back once your course begins.",
      },
    ],
    helpLink: {
      label: 'Having problems? Contact IT support',
      href: 'https://www.arts.ac.uk/students/it-services',
    },
  },
];

/** Convenience lookup by id */
export const TASKS_BY_ID = Object.fromEntries(TASKS.map((t) => [t.id, t]));

/**
 * Tasks visible to a given student type. International-only tasks (e.g. the
 * CAS number) are hidden from UK/Home students. While the profile is still
 * hydrating, `studentType` is undefined and international-only tasks stay
 * hidden — the safe default.
 *
 * @param {string} [studentType]  one of STUDENT_TYPE_OPTIONS[].id ('domestic' | 'international')
 * @returns {Task[]}
 */
export function visibleTasks(studentType) {
  return TASKS.filter((t) => !t.internationalOnly || studentType === 'international');
}
