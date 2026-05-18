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
 * @property {'text'|'accordion'} [type]
 * @property {string[]} [items]
 *
 * @typedef {Object} Step
 * @property {string} id
 * @property {string} title
 * @property {string} [href]
 * @property {string[]} [details]
 *
 * @typedef {Object} Cta
 * @property {string} label
 * @property {string} href
 *
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {TaskTag} tag
 * @property {string} shortDescription
 * @property {ContentSection[]} [sections]
 * @property {Step[]} [steps]
 * @property {Cta} cta
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
    title: 'Activate your UAL accounts',
    tag: 'essential',
    shortDescription: 'The accounts you need to do setup for term.',
    sections: [
      {
        title: 'What you need to activate',
        body: 'Once you have your UAL email, you can activate your full suite of UAL digital accounts — including Moodle (your virtual learning environment), Microsoft 365, and library access.',
        type: 'text',
      },
      {
        title: 'How to activate',
        body: 'Log in to the UAL IT portal using your UAL email and the password you set up. From there you can activate all connected services. Allow up to 24 hours for all services to become available.',
        type: 'text',
      },
      {
        title: 'Need help?',
        type: 'accordion',
        items: ['Email: servicedesk@arts.ac.uk', 'Phone number: +44 (0)20 7514 9898'],
      },
    ],
    cta: {
      label: 'Go to IT setup',
      href: 'https://www.arts.ac.uk/students/welcome/your-journey-to-UAL/get-connected',
    },
  },
];

/** Convenience lookup by id */
export const TASKS_BY_ID = Object.fromEntries(TASKS.map((t) => [t.id, t]));
