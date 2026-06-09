/**
 * Essential setup tasks for new UAL students.
 *
 * The "Get set up for term" page (/checklist) lists these inline: each task
 * shows a completion circle, a title, a short description, and an inline
 * action — either a link (`cta`), app-download buttons (`apps`), or both,
 * plus an optional availability `note`. Most tasks complete in place; only
 * MFA has its own detail page (/checklist/mfa) with the device-path guide.
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
 * @property {Cta} [cta]                 Inline action link.
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
    title: 'Access your UAL email',
    tag: 'essential',
    shortDescription: 'This email is needed to enrol and get setup on all available UAL services.',
    cta: {
      label: 'Setup email',
      href: 'https://www.arts.ac.uk/students/welcome/your-journey-to-UAL/get-connected',
    },
  },
  {
    id: 'student-portal',
    title: 'Student portal',
    tag: 'essential',
    shortDescription: 'Get the latest UAL news, timetable and access available online resources',
    cta: { label: 'Go to Student portal', href: 'https://www.arts.ac.uk/students' },
  },
  {
    id: 'mfa',
    title: 'Multi-factor authentication',
    tag: 'essential',
    shortDescription:
      'Multi-Factor Authentication (MFA) adds an extra layer of protection to your identity, your data and our systems',
    cta: { label: 'Get started', href: '/checklist/mfa' },
  },
  {
    id: 'myual-app',
    title: 'Download your MyUAL app',
    tag: 'essential',
    shortDescription: 'Get the latest UAL news, timetable and access available online resources',
    // TODO(UAL): replace with the real MyUAL App Store / Google Play links.
    apps: {
      apple: 'https://www.apple.com/app-store/',
      android: 'https://play.google.com/store',
    },
  },
  {
    id: 'moodle',
    title: 'Set up Moodle',
    tag: 'essential',
    shortDescription:
      'Moodle is your virtual learning environment, it has course materials, assignments, announcements.',
    note: 'Available after you have fully enrolled',
    cta: { label: 'Go to Moodle', href: 'https://moodle.arts.ac.uk' },
  },
  {
    id: 'seats-app',
    title: 'Download your SEAtS app',
    tag: 'essential',
    shortDescription:
      'You will need to mark your own attendance to sessions using the SEAtS mobile phone app once you start',
    // TODO(UAL): replace with the real SEAtS App Store / Google Play links.
    apps: {
      apple: 'https://www.apple.com/app-store/',
      android: 'https://play.google.com/store',
    },
  },
];

/** Convenience lookup by id */
export const TASKS_BY_ID = Object.fromEntries(TASKS.map((t) => [t.id, t]));

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
