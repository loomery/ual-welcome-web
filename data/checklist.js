/**
 * Essential setup tasks for new UAL students.
 *
 * The "Essentials" page (/checklist) lists these inside a "To do list" card:
 * each row has a completion checkbox, a title, a short description, an optional
 * availability `note`, and a chevron that links to the task destination (`cta`
 * — the MFA task links to its own /checklist/mfa detail page, the rest to
 * external UAL pages).
 *
 * Progress is tracked separately in localStorage:
 *   'ual:task:status:v1'  →  Record<taskId, 'not-started'|'in-progress'|'complete'>
 *
 * @typedef {'essential'} TaskTag
 * @typedef {'not-started'|'in-progress'|'complete'} TaskStatus
 *
 * @typedef {Object} Cta
 * @property {string} label
 * @property {string} href   Internal route if it starts with '/', else an external link.
 *
 * @typedef {Object} AppLinks
 * @property {string} [apple]    App Store URL
 * @property {string} [android]  Google Play URL
 *
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {TaskTag} tag
 * @property {string} shortDescription   One-liner shown in the list and the dashboard.
 * @property {Cta} [cta]                 Task destination (chevron / "View task").
 * @property {AppLinks} [apps]           App download buttons (Apple / Android).
 * @property {string} [note]             Muted availability caveat.
 * @property {boolean} [internationalOnly]  If true, only shown to international students.
 * @property {Array<'new'|'returning'>} [statuses]  Which cohorts see this task
 *   (defaults to both new and returning students).
 * @property {TaskDetail} [detail]  Content for the task's own detail page
 *   (/checklist/{id}); when set, the checklist row links here instead of `cta`.
 *
 * @typedef {Object} DetailSection
 * @property {string} heading
 * @property {string} [lead]     Intro line shown above a bullet list.
 * @property {string} [body]     Paragraph.
 * @property {string[]} [bullets]  Bulleted points.
 *
 * @typedef {Object} HelpBlock
 * @property {string} intro
 * @property {HelpChannel[]} channels
 *
 * @typedef {Object} TaskDetail
 * @property {string} [intro]    Lead paragraph (defaults to the task's shortDescription).
 * @property {DetailSection[]} sections
 * @property {HelpBlock} [help]
 */

// TODO(UAL): replace placeholder URLs with the canonical UAL destinations.
const AUTHENTICATOR_APPS = {
  apple: 'https://apps.apple.com/app/microsoft-authenticator/id983156458',
  android: 'https://play.google.com/store/apps/details?id=com.azure.authenticator',
};

const MICROSOFT_SIGNIN = 'https://www.office.com';

/**
 * Shared IT Service Desk contact channels, used by the "Get help" block on
 * task detail pages (and the MFA page).
 *
 * @type {import('./checklist').HelpChannel[]}
 */
export const IT_HELP_CHANNELS = [
  {
    id: 'ticket',
    label: 'Raise a ticket',
    value: 'MySupport',
    href: 'https://www.arts.ac.uk/students/it-services',
  },
  {
    id: 'email',
    label: 'Email us',
    value: 'servicedesk@arts.ac.uk',
    href: 'mailto:servicedesk@arts.ac.uk',
  },
  {
    id: 'call',
    label: 'Call us',
    value: '+44 (0)20 7514 9898',
    note: '24/7, 365 days a year',
    href: 'tel:+442075149898',
  },
];

/** @type {Task[]} */
export const TASKS = [
  {
    id: 'pay-tuition',
    title: 'Pay tuition fee',
    tag: 'essential',
    internationalOnly: true,
    shortDescription:
      'Before you start your studies, it is important to know how to pay your tuition fees.',
    // TODO(UAL): replace with the canonical tuition-fees URL.
    cta: {
      label: 'Pay tuition fee',
      href: 'https://www.arts.ac.uk/students/stories/fees-and-funding',
    },
  },
  {
    id: 'ual-email',
    title: 'Set up your email and UAL network account',
    tag: 'essential',
    statuses: ['new'],
    shortDescription:
      'Once you’ve accepted your offer to study with us, you’ll need to set up your UAL email address to enrol as a student.',
    cta: {
      label: 'Set up email',
      href: 'https://www.arts.ac.uk/students/welcome/your-journey-to-UAL/get-connected',
    },
    detail: {
      sections: [
        {
          heading: 'What your UAL email is for',
          body: 'Your UAL email is where you’ll receive important updates about your studies, course, and time at UAL, so make sure to check it regularly.',
        },
        {
          heading: 'Getting access',
          body: 'Once you have accepted your place you will gain access to the account within 72 hours.',
        },
        {
          heading: 'Next steps',
          lead: 'We’ll send instructions:',
          bullets: [
            'To the personal email address you used to apply',
            'About 10 weeks before starting your course',
            'When you have firmly accepted your place',
          ],
        },
      ],
      help: {
        intro:
          'If you have problems logging in to your UAL email and network account, contact IT Services for help. They are available 24/7, 365 days a year.',
        channels: IT_HELP_CHANNELS,
      },
    },
  },
  {
    id: 'mfa',
    title: 'Set up multi-factor authentication (MFA)',
    tag: 'essential',
    statuses: ['new'],
    shortDescription:
      'Multi-Factor Authentication (MFA) adds an extra layer of protection to your identity, your data and our systems.',
    cta: { label: 'Get started', href: '/checklist/mfa' },
  },
  {
    id: 'enrol',
    title: 'Enrol',
    tag: 'essential',
    statuses: ['new'],
    shortDescription: 'You must enrol each academic year to join or continue your course.',
    // TODO(UAL): replace with the canonical enrolment URL.
    cta: { label: 'Enrol', href: 'https://www.arts.ac.uk/students/enrolment' },
  },
  {
    id: 'digital-accounts',
    title: 'Set up your digital accounts',
    tag: 'essential',
    statuses: ['new'],
    shortDescription:
      'There are multiple accounts you need during your term. Activate them before you start.',
    // TODO(UAL): replace with the canonical digital-accounts URL.
    cta: { label: 'Get started', href: 'https://www.arts.ac.uk/students/it-services' },
  },
  {
    id: 'enrol-returning',
    title: 'Enrol for the new academic year',
    tag: 'essential',
    statuses: ['returning'],
    shortDescription: 'You must enrol each academic year to join or continue your course.',
    // TODO(UAL): replace with the canonical enrolment URL.
    cta: { label: 'Enrol', href: 'https://www.arts.ac.uk/students/enrolment' },
  },
  {
    id: 'review-details',
    title: 'Review personal details',
    tag: 'essential',
    statuses: ['returning'],
    shortDescription:
      'Log into Moodle and amend any of your details to ensure they are up to date.',
    cta: { label: 'Go to Moodle', href: 'https://moodle.arts.ac.uk' },
  },
  {
    id: 'first-session',
    title: 'Find out when your first session is',
    tag: 'essential',
    shortDescription:
      'Your timetable will be published at the end of August. We’ll email you when it’s ready to view and tell you how to access it.',
    note: 'Available after you have fully enrolled and set up Moodle',
    // TODO(UAL): replace with the canonical timetable URL.
    cta: { label: 'View timetable', href: 'https://www.arts.ac.uk/students' },
  },
  {
    id: 'id-card',
    title: 'Collect your ID card',
    tag: 'essential',
    statuses: ['new'],
    shortDescription:
      'Get your ID card to access our college and institute buildings and facilities',
    note: 'Available after you have fully enrolled',
    // TODO(UAL): replace with the canonical ID-card URL.
    cta: { label: 'Learn more', href: 'https://www.arts.ac.uk/students' },
  },
];

/**
 * "Other important tasks" — supplementary links shown below the to-do list.
 * Not tracked for completion; each is a plain external link.
 *
 * @typedef {Object} OtherTask
 * @property {string} id
 * @property {string} label
 * @property {string} href
 * @property {boolean} [internationalOnly]  If true, only shown to international students.
 *
 * @type {OtherTask[]}
 */
// TODO(UAL): replace placeholder URLs with the canonical UAL destinations.
export const OTHER_TASKS = [
  {
    id: 'doctor',
    label: 'Register with a doctor',
    href: 'https://www.arts.ac.uk/students/student-health-and-wellbeing',
  },
  {
    id: 'consent',
    label: 'Complete sexual consent training',
    href: 'https://www.arts.ac.uk/students',
  },
  {
    id: 'uk-bank',
    label: 'Open a UK bank account',
    href: 'https://www.arts.ac.uk/students/student-services/international-students',
    internationalOnly: true,
  },
];

/**
 * "Repeated services" — the quick links surfaced once every arrival task is
 * done: the tools a student reaches for throughout the year. Rendered as the
 * shared InterestTile cards.
 *
 * @typedef {Object} Service
 * @property {string} id
 * @property {string} label
 * @property {string} body
 * @property {string} href
 *
 * @type {Service[]}
 */
// TODO(UAL): replace placeholder URLs with the canonical UAL destinations.
export const REPEATED_SERVICES = [
  {
    id: 'timetable',
    label: 'Timetable',
    body: 'Check when and where your classes are.',
    href: 'https://www.arts.ac.uk/students',
  },
  {
    id: 'moodle',
    label: 'Moodle',
    body: 'Your virtual learning environment and course materials.',
    href: 'https://moodle.arts.ac.uk',
  },
  {
    id: 'email',
    label: 'Email',
    body: 'Access your UAL email and calendar.',
    href: 'https://www.office.com',
  },
  {
    id: 'print-credit',
    label: 'Print credit',
    body: 'Top up and manage your printing credit.',
    href: 'https://www.arts.ac.uk/students/it-services',
  },
  {
    id: 'seats',
    label: 'SEAtS',
    body: 'Mark your attendance at sessions.',
    href: 'https://www.arts.ac.uk/students',
  },
  {
    id: 'academic-support',
    label: 'Academic support online',
    body: 'Study skills, workshops and academic help.',
    href: 'https://www.arts.ac.uk/students/academic-support',
  },
];

/**
 * Tasks visible to a given student. New and returning students see different
 * arrival tasks; international students get extra essentials (e.g. "Pay
 * tuition fee") on top of their cohort's list.
 *
 * @param {string} [studentType]    one of STUDENT_TYPE_OPTIONS[].id ('domestic' | 'international')
 * @param {string} [studentStatus]  one of STUDENT_STATUS_OPTIONS[].id ('new' | 'returning'); defaults to 'new'
 * @returns {Task[]}
 */
export function visibleTasks(studentType, studentStatus = 'new') {
  return TASKS.filter((t) => {
    if (t.internationalOnly && studentType !== 'international') return false;
    if (t.statuses && !t.statuses.includes(studentStatus)) return false;
    return true;
  });
}

/**
 * "Other important tasks" links visible to a given student type.
 *
 * @param {string} [studentType]  'domestic' | 'international'
 * @returns {OtherTask[]}
 */
export function visibleOtherTasks(studentType) {
  return OTHER_TASKS.filter((t) => !t.internationalOnly || studentType === 'international');
}

/* ─────────────────────────────────────────────────────────────────────────
 * Multi-factor authentication detail
 * Two registration paths the student can choose between, each with its own
 * ordered step list. Consumed by screens/Checklist/MfaScreen.
 * ───────────────────────────────────────────────────────────────────────── */

/**
 * @typedef {Object} MfaStep
 * @property {string} id
 * @property {string} text
 * @property {Cta} [cta]        Inline action link (e.g. "Go to our Microsoft URL sign in").
 * @property {AppLinks} [apps]  App download buttons.
 *
 * @typedef {Object} MfaPath
 * @property {string} id
 * @property {string} badge     Pill label ("Recommended" / "Quick set up").
 * @property {string} title
 * @property {string} body      One-line description of the path.
 * @property {MfaStep[]} steps
 */

/** @type {MfaPath[]} */
export const MFA_PATHS = [
  {
    id: 'two-device',
    badge: 'Recommended',
    title: 'Smartphone and another device',
    body: 'Use your phone, computer or tablet to approve logins.',
    steps: [
      {
        id: 'signin',
        text: 'On a tablet or computer, sign in to our Microsoft URL using your UAL email and password',
        cta: { label: 'Go to our Microsoft URL sign in', href: MICROSOFT_SIGNIN },
      },
      { id: 'qr', text: 'Follow the on-screen steps until a QR code appears' },
      {
        id: 'app',
        text: "On your phone, download the Microsoft Authenticator app, then tap '+', 'Work or School Account' and 'Scan a QR Code'",
        apps: AUTHENTICATOR_APPS,
      },
      { id: 'scan', text: 'Scan the QR code (allow camera access if prompted)' },
      {
        id: 'code',
        text: "Back on your tablet or computer, select 'Next' and enter the code shown in your Authenticator app",
      },
      { id: 'finish', text: 'Complete the remaining steps on your tablet or computer' },
    ],
  },
  {
    id: 'one-device',
    badge: 'Quick set up',
    title: 'Smartphone only registration',
    body: 'Quick to set up, all you need is your phone.',
    steps: [
      {
        id: 'app',
        text: 'Download the Microsoft Authenticator app on your phone',
        apps: AUTHENTICATOR_APPS,
      },
      {
        id: 'signin',
        text: 'Open a browser and go to our Microsoft URL using your UAL email and password',
        cta: { label: 'Go to our Microsoft URL sign in', href: MICROSOFT_SIGNIN },
      },
      {
        id: 'secure',
        text: "On the 'Keep your account secure' screen, select Next and follow the steps until you reach 'Set up your account in the app'",
      },
      {
        id: 'pair',
        text: "Select 'Pair your account to the app'. The authenticator will open automatically",
      },
      { id: 'await', text: 'Follow the steps in the app until your UAL account appears' },
      {
        id: 'code',
        text: 'Go back in the browser, select Next and enter the code sent to your Authenticator app',
      },
      { id: 'finish', text: 'Complete the remaining steps in the browser' },
    ],
  },
];

/**
 * Shared "Get help" contact block on the MFA page.
 *
 * @typedef {Object} HelpChannel
 * @property {string} id
 * @property {string} label
 * @property {string} value
 * @property {string} href
 * @property {string} [note]
 */

/** @type {{ title: string, channels: HelpChannel[] }} */
export const MFA_HELP = {
  title: 'Contact the UAL IT Service Desk',
  channels: IT_HELP_CHANNELS,
};

/** @type {Cta} */
export const MFA_READ_MORE = {
  label: 'Read more about MFA at UAL',
  href: 'https://www.arts.ac.uk/students/it-services',
};
