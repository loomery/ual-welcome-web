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
 */

// TODO(UAL): replace placeholder URLs with the canonical UAL destinations.
const AUTHENTICATOR_APPS = {
  apple: 'https://apps.apple.com/app/microsoft-authenticator/id983156458',
  android: 'https://play.google.com/store/apps/details?id=com.azure.authenticator',
};

const MICROSOFT_SIGNIN = 'https://www.office.com';

/** @type {Task[]} */
export const TASKS = [
  {
    id: 'ual-email',
    title: 'Set up your email and UAL network account',
    tag: 'essential',
    shortDescription:
      'Once you’ve accepted your offer to study with us, you’ll need to set up your UAL email address to enrol as a student.',
    cta: {
      label: 'Set up email',
      href: 'https://www.arts.ac.uk/students/welcome/your-journey-to-UAL/get-connected',
    },
  },
  {
    id: 'mfa',
    title: 'Set up multi-factor authentication (MFA)',
    tag: 'essential',
    shortDescription:
      'Multi-Factor Authentication (MFA) adds an extra layer of protection to your identity, your data and our systems.',
    cta: { label: 'Get started', href: '/checklist/mfa' },
  },
  {
    id: 'enrol',
    title: 'Enrol',
    tag: 'essential',
    shortDescription: 'You must enrol each academic year to join or continue your course.',
    // TODO(UAL): replace with the canonical enrolment URL.
    cta: { label: 'Enrol', href: 'https://www.arts.ac.uk/students/enrolment' },
  },
  {
    id: 'digital-accounts',
    title: 'Set up your digital accounts',
    tag: 'essential',
    shortDescription:
      'There are multiple accounts you need during your term. Activate them before you start.',
    // TODO(UAL): replace with the canonical digital-accounts URL.
    cta: { label: 'Get started', href: 'https://www.arts.ac.uk/students/it-services' },
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
];

/**
 * Tasks visible to a given student type. (No task is currently
 * international-only, but the filter is kept so the data model and the
 * screens that consume it stay forward-compatible.)
 *
 * @param {string} [studentType]  one of STUDENT_TYPE_OPTIONS[].id ('domestic' | 'international')
 * @returns {Task[]}
 */
export function visibleTasks(studentType) {
  return TASKS.filter((t) => !t.internationalOnly || studentType === 'international');
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
  channels: [
    {
      id: 'call',
      label: 'Call us',
      value: '+44 (0)20 7514 9898',
      note: '24/7, 365 days a year',
      href: 'tel:+442075149898',
    },
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
  ],
};

/** @type {Cta} */
export const MFA_READ_MORE = {
  label: 'Read more about MFA at UAL',
  href: 'https://www.arts.ac.uk/students/it-services',
};
