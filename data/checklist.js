/**
 * Essential setup tasks for new UAL students.
 *
 * The "Essentials" page (/essentials) lists these inside a "To do list" card:
 * each row has a completion checkbox, a title, a short description, an optional
 * availability `note`, and a chevron that links to the task destination (`cta`
 * — the MFA task links to its own /essentials/mfa detail page, the rest to
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
 *   (/essentials/{id}); when set, the checklist row links here instead of `cta`.
 *
 * Detail-page copy supports inline links written as [label](url) — rendered
 * by the RichText component.
 *
 * @typedef {Object} DetailSection
 * @property {string} heading
 * @property {string} [lead]     Intro line shown above a bullet list.
 * @property {string} [body]     Paragraph (kept for single-paragraph sections).
 * @property {string[]} [paragraphs]  Multiple paragraphs.
 * @property {string[]} [bullets]  Bulleted points.
 * @property {Cta} [link]        Trailing arrow link.
 *
 * @typedef {Object} SubTaskStep
 * @property {string} text
 * @property {string[]} [bullets]  Nested points under this step.
 *
 * @typedef {Object} SubTaskItem
 * @property {string} id
 * @property {string} label
 * @property {string} [href]         External destination (adds the external-link icon).
 * @property {AppLinks} [apps]       App-store download links (iOS / Android).
 * @property {string} [description]
 * @property {string} [lead]         e.g. "What you’ll need to do" above numbered steps.
 * @property {SubTaskStep[]} [steps] Numbered sub-steps.
 * @property {string[]} [bullets]
 * @property {string} [note]         Muted info pill.
 * @property {Cta} [link]            Trailing arrow link.
 *
 * @typedef {Object} SubTaskList
 * @property {string} title        e.g. "Accounts to set up" / "Set up steps".
 * @property {boolean} [ordered]   Render as a plain numbered how-to list (no
 *   checkboxes or progress count) instead of a tick-off checklist.
 * @property {SubTaskItem[]} items Completion is persisted per item.
 *
 * @typedef {Object} HelpBlock
 * @property {string} [intro]
 * @property {HelpChannel[]} [channels]  Flat list of contact cards.
 * @property {{ heading: string, channels: HelpChannel[] }[]} [groups]  Contact
 *   cards split into labelled sub-groups (e.g. General enquiries / Mental health).
 *
 * @typedef {Object} TaskDetail
 * @property {string} [title]    Page H1 (defaults to the task title).
 * @property {string} [tag]      Pill label (defaults to 'Essential').
 * @property {string} [intro]    Lead paragraph (defaults to the task's shortDescription).
 * @property {DetailSection[]} sections
 * @property {SubTaskList} [subTasks]
 * @property {Cta} [video]       "Watch a video guide" link.
 * @property {Cta} [readMore]    Full-width dark banner CTA.
 * @property {HelpBlock} [help]
 */

// TODO(UAL): replace placeholder URLs with the canonical UAL destinations.
const AUTHENTICATOR_APPS = {
  apple: 'https://apps.apple.com/app/microsoft-authenticator/id983156458',
  android: 'https://play.google.com/store/apps/details?id=com.azure.authenticator',
};

// TODO(UAL): confirm the canonical SEAtS app store links.
const SEATS_APPS = {
  apple: 'https://apps.apple.com/gb/app/seats-mobile/id1073579321',
  android: 'https://play.google.com/store/apps/details?id=com.seats.mobile',
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
    detail: {
      title: 'Pay fees or confirm funding',
      intro:
        'Discover opportunities to fund your studies and get advice on your fees and finances.',
      sections: [
        {
          heading: 'Tuition fees',
          paragraphs: [
            'Tuition fees cover the cost of studying. They vary depending on your course level (i.e. undergraduate or postgraduate) and your fee status (home or international).',
            'Check your [tuition fees](https://www.arts.ac.uk/study-at-ual/fees-and-funding/tuition-fees). If you have questions about your fee status, reply to your offer email or [contact the Student Advice Service](https://www.arts.ac.uk/students/student-services/student-advice-service)',
          ],
        },
        {
          heading: 'How to pay your tuition fees',
          body: 'Find out how to [pay your tuition fees](https://www.arts.ac.uk/study-at-ual/fees-and-funding/how-to-pay-your-fees). You’ll be asked to confirm your funding or pay your fees when you enrol onto your course. Options include direct payments, student loans or through a sponsor via pro-forma invoice.',
        },
        {
          heading: 'Funding and scholarships',
          body: 'The Student Advice team provides students with information and advice about funding options available to cover tuition fees, living costs and course costs.',
          link: {
            label: 'Search for all available scholarships',
            href: 'https://www.arts.ac.uk/study-at-ual/fees-and-funding/scholarships-search',
          },
        },
        {
          heading: 'Immigration and visas',
          paragraphs: [
            "If you're joining us from a country outside of the UK, you will likely need visa or immigration permission allowing you to live and study in the UK.",
            'Before you travel, check what requirements there are and that you have applied for the right type of study visa for your needs.',
            'You can check which type you may need using the [UK Government’s visa checking tool](https://www.gov.uk/check-uk-visa)',
          ],
          lead: 'Find out more about immigration, visas and who to contact at UAL.',
          link: {
            label: 'Immigration and visa support',
            href: 'https://www.arts.ac.uk/students/student-services/immigration-and-visa-advice',
          },
        },
      ],
      help: {
        intro:
          'The Student Advice Service can help with financial based questions and give guidance on managing money.',
        channels: [
          {
            id: 'advice',
            label: 'Student Advice Service',
            value: 'Enquiry form',
            href: 'https://www.arts.ac.uk/students/student-services/student-advice-service',
          },
        ],
      },
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
          body: 'Your UAL email is where you’ll receive important updates about your studies, course, and time at UAL, so you must check it regularly.',
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
    cta: { label: 'Get started', href: '/essentials/mfa' },
  },
  {
    id: 'enrol',
    title: 'Enrol',
    tag: 'essential',
    statuses: ['new'],
    shortDescription: 'You must enrol each academic year to join or continue your course.',
    // TODO(UAL): replace with the canonical enrolment URL.
    cta: { label: 'Enrol', href: 'https://www.arts.ac.uk/students/enrolment' },
    detail: {
      title: 'Enrol for the new academic year',
      intro:
        'You must enrol each academic year to join or continue your course. When it’s time for you to enrol, we’ll send an email with instructions on what to do.',
      sections: [
        {
          heading: 'How to enrol',
          body: 'Enrolment opens for new students from [Monday 17 August 2026]. Not everyone gets invited to enrol straight away. We send invitations out to students who are eligible to enrol in batches, so check your inbox regularly.',
        },
      ],
      subTasks: {
        title: 'Accounts to set up',
        items: [
          {
            id: 'portal',
            label: 'Log in to your UAL Portal',
            href: 'https://ualportal.arts.ac.uk/urd/sits.urd/run/siw_lgn',
          },
          {
            id: 'enrolment-form',
            label: 'Complete the online enrolment form',
            steps: [
              { text: 'Reconfirm your passport upload. Let us know about any change' },
              {
                text: 'Confirm tuition payment or funding. Pay your tuition fees or provide confirmation of your funding arrangements',
              },
            ],
            note: 'You won’t be able to delete previous versions of any documents. UAL is required to keep a full record of your enrolment while you study with us',
            link: {
              label: 'More details on payment and funding',
              href: 'https://www.arts.ac.uk/students/stories/fees-and-funding',
            },
          },
          { id: 'confirmation', label: 'Await your confirmation email' },
        ],
      },
      video: { label: 'Watch a video guide', href: 'https://www.youtube.com/watch?v=6Ol9tAoDutQ' },
      readMore: {
        label: 'Read more about enrolling at UAL',
        href: 'https://www.arts.ac.uk/study-at-ual/how-to-enrol/information-for-new-students',
      },
      help: {
        intro:
          'If you have problems logging in to your UAL email and network account, contact IT Services for help. They are available 24/7, 365 days a year.',
        channels: IT_HELP_CHANNELS,
      },
    },
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
    detail: {
      intro:
        'There are multiple accounts you need during your term. Activate them before you start.',
      subTasks: {
        title: 'Accounts to set up',
        items: [
          {
            id: 'student-portal',
            label: 'Student portal',
            description:
              'Get the latest UAL news, timetable and access available online resources.',
            href: 'https://ualportal.arts.ac.uk/urd/sits.urd/run/siw_lgn',
          },
          {
            id: 'moodle',
            label: 'Moodle',
            description:
              'Moodle is the online home for your course. You’ll use your Moodle dashboard to:',
            bullets: [
              'Access course materials',
              'Take part in activities such as discussions and online seminars',
              'Submit assessments',
              'Find important information about your course',
            ],
            note: 'Available after you have fully enrolled. You’ll have access to a Course site and individual sites for each of your Units.',
            href: 'https://moodle.arts.ac.uk/login/index.php',
          },
          {
            id: 'seats',
            label: 'Download your SEAtS app',
            description:
              'You will need to mark your own attendance to sessions using the SEAtS mobile phone app once you start.',
            apps: SEATS_APPS,
          },
        ],
      },
      help: {
        intro:
          'If you have problems logging in to your UAL email and network account, contact IT Services for help. They are available 24/7, 365 days a year.',
        channels: IT_HELP_CHANNELS,
      },
    },
  },
  {
    id: 'enrol-returning',
    title: 'Enrol for the new academic year',
    tag: 'essential',
    statuses: ['returning'],
    shortDescription: 'You must enrol each academic year to join or continue your course.',
    // TODO(UAL): replace with the canonical enrolment URL.
    cta: { label: 'Enrol', href: 'https://www.arts.ac.uk/students/enrolment' },
    detail: {
      intro: 'You need to complete these tasks in order to start your term.',
      sections: [
        {
          heading: 'How to enrol',
          paragraphs: [
            'You must enrol each academic year to continue your course. When it’s time for you to enrol we’ll send you an email with instructions on what to do.',
            'Enrolment opens for returning students from [Monday 3 August 2026]. Not everyone gets invited to enrol straight away. We send invitations out to students who are eligible to enrol in batches, so check your inbox regularly.',
          ],
        },
      ],
      subTasks: {
        title: 'Accounts to set up',
        items: [
          {
            id: 'portal-details',
            label: 'Check your details in your UAL Portal',
            href: 'https://ualportal.arts.ac.uk/urd/sits.urd/run/siw_lgn',
            lead: 'What you’ll need to do',
            bullets: [
              'View your personal information and download status letters under ‘My Study Details’.',
              'Double check your details are up to date. If your contact details or personal information change, please update them as soon as possible.',
            ],
          },
          {
            id: 'enrolment-form',
            label: 'Complete the online enrolment form',
            lead: 'What you’ll need to do',
            steps: [
              { text: 'Add your student number. Find in the portal' },
              {
                text: 'Upload copies of:',
                bullets: [
                  'Passport (Birth certificate if you don’t have a passport)',
                  'Academic qualifications',
                ],
              },
              { text: 'Confirm tuition payment/funding' },
              { text: 'Upload a passport sized photo for your student ID card' },
            ],
          },
          { id: 'confirmation', label: 'Await your confirmation email' },
        ],
      },
      video: { label: 'Watch a video guide', href: 'https://www.youtube.com/watch?v=6Ol9tAoDutQ' },
      readMore: {
        label: 'Read more about enrolling at UAL',
        href: 'https://www.arts.ac.uk/study-at-ual/how-to-enrol',
      },
      help: {
        intro:
          'If you have problems logging in to your UAL email and network account, contact IT Services for help. They are available 24/7, 365 days a year.',
        channels: [
          {
            id: 'email',
            label: 'Email us',
            value: 'servicedesk@arts.ac.uk',
            note: 'Reply directly to the ‘Start your enrolment: Online registration open’ email we sent',
            href: 'mailto:servicedesk@arts.ac.uk',
          },
          {
            id: 'call',
            label: 'Call us',
            value: '+44 (0)20 7514 9898',
            note: 'Contact IT Services for help',
            href: 'tel:+442075149898',
          },
        ],
      },
    },
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
    detail: {
      intro:
        'Your timetable will be published at the end of August. We’ll email you when it’s ready to view.',
      sections: [
        {
          heading: 'Term dates',
          paragraphs: [
            'Term dates and the start of your course vary depending on your level of study. Take a look at UAL [standard term dates](https://www.arts.ac.uk/students/academic-support/term-dates).',
          ],
          lead: 'Make sure you know when your first session or course induction is.',
          bullets: [
            'Check your UAL email to see if we’ve contacted you about any events for your course',
            'Check your timetable to see when your first class is.',
          ],
        },
        {
          heading: 'Access your timetable',
          body: 'You can see your current timetable online in a variety of ways: choose what works for you.',
          link: {
            label: 'Get your timetable',
            href: 'https://www.arts.ac.uk/students/student-timetables',
          },
        },
      ],
    },
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
    detail: {
      sections: [
        {
          heading: 'When to collect',
          paragraphs: [
            "Once you’ve completed the online registration step of enrolment, we'll contact you by email inviting you to collect your Student ID card. Each College or Institute has dedicated collection dates and locations for ID card collection.",
            'Find out [when and where you can collect your ID card](https://www.arts.ac.uk/study-at-ual/how-to-enrol/student-id-card-collection)',
          ],
        },
      ],
      help: {
        intro:
          'If your Student ID card is lost, expired or faulty, contact the Student Centre at [College/Institute] for guidance.',
        channels: [
          {
            id: 'faqs',
            label: 'FAQs',
            value: 'Online',
            href: 'https://www.arts.ac.uk/colleges/central-saint-martins/student-life-at-csm/facilities/library-and-shared-spaces/central-saint-martins-student-centre/frequently-asked-questions',
          },
          {
            id: 'email',
            label: 'Email us',
            value: 'csmstudentcentre@arts.ac.uk',
            href: 'mailto:csmstudentcentre@arts.ac.uk',
          },
          {
            id: 'call',
            label: 'Call us',
            value: '+44 (0)207 514 7202',
            href: 'tel:+442075147202',
          },
        ],
      },
    },
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
 * @property {TaskDetail} [detail]  Detail page (/essentials/{id}); when set, the
 *   link goes there instead of `href`.
 *
 * @type {OtherTask[]}
 */
// TODO(UAL): replace placeholder URLs with the canonical UAL destinations.
export const OTHER_TASKS = [
  {
    id: 'doctor',
    label: 'Register with a doctor',
    href: 'https://www.arts.ac.uk/students/student-health-and-wellbeing',
    detail: {
      title: 'Get setup with a local doctor',
      tag: 'Important',
      intro:
        'Looking after your physical health is an important part of making the most of your time at university.',
      sections: [
        {
          heading: 'About',
          paragraphs: [
            'Local doctors, also known as a GP (General practice) provides access to healthcare, routine prescriptions, and emergency support.',
            'We recommend registering with a doctor (GP) near your new home so you can access medical care easily if needed.',
          ],
          lead: 'Free NHS treatment is accessible to:',
          bullets: [
            'All UK students',
            'EU and International students on a full-time course lasting more than 6 months.',
            'You may need to pay for prescriptions, dental treatment and eye care.',
          ],
        },
      ],
      subTasks: {
        title: 'Set up steps',
        ordered: true,
        items: [
          {
            id: 'find',
            label: 'Find your nearest doctors using the button below',
            link: {
              label: 'Find your nearest doctors',
              href: 'https://www.nhs.uk/service-search/find-a-GP',
            },
          },
          { id: 'browse', label: 'Browse your options on the nhs website' },
          { id: 'register', label: 'Fill in the registration form on the website' },
        ],
      },
      readMore: {
        label: 'Read more about health at UAL',
        href: 'https://www.arts.ac.uk/students/student-services/counselling-health-advice-and-chaplaincy/health-advice',
      },
    },
  },
  {
    id: 'consent',
    label: 'Complete sexual consent training',
    href: 'https://www.arts.ac.uk/students',
    detail: {
      title: 'Complete sexual consent training module',
      tag: 'Important',
      intro:
        'At UAL we are committed to promoting a positive consent culture and raising awareness of support both within and outside the University.',
      sections: [
        {
          heading: 'About',
          paragraphs: [
            'The course reinforces the message that enthusiastic sexual consent (both giving and getting) is a crucial part of all sexual interactions and contributes to respectful, equal and fulfilling relationships.',
            'This short online training module aims to start a conversation about what sexual consent means and challenge myths surrounding sexual violence. You will learn about consent, consent myths, how to tackle rape culture and where you can find support.',
            'No one ever deserves to experience any form of sexual violence or harassment and it is never the survivor’s fault.',
          ],
        },
        {
          heading: 'Trigger warning',
          body: 'Please be aware when sharing / accessing this course that the module includes scenarios that discuss rape and sexual assault.',
        },
      ],
      subTasks: {
        title: 'Set up steps',
        items: [
          {
            id: 'module',
            label: 'Complete the sexual consent training module',
            // TODO(UAL): replace with the canonical consent-module URL.
            href: 'https://www.arts.ac.uk/students',
          },
        ],
      },
      help: {
        groups: [
          {
            heading: 'General enquiries',
            channels: [
              {
                id: 'general-email',
                label: 'Email us',
                value: 'counselling@arts.ac.uk',
                href: 'mailto:counselling@arts.ac.uk',
              },
              {
                id: 'general-call',
                label: 'Call us',
                value: '+44 (0)20 7514 6251',
                href: 'tel:+442075146251',
              },
            ],
          },
          {
            heading: 'Mental health or wellbeing support',
            channels: [
              {
                id: 'wellbeing-email',
                label: 'Email us',
                value: 'studenthealth@arts.ac.uk',
                href: 'mailto:studenthealth@arts.ac.uk',
              },
              {
                id: 'wellbeing-call',
                label: 'Call us',
                value: '+44 (0)20 7514 6426',
                href: 'tel:+442075146426',
              },
            ],
          },
        ],
      },
    },
  },
  {
    id: 'uk-bank',
    label: 'Open a UK bank account',
    href: 'https://www.arts.ac.uk/students/student-services/international-students',
    internationalOnly: true,
    detail: {
      tag: 'Important',
      intro:
        'Simplify finances by opening a UK bank account. Save on potential oversea bank charges.',
      sections: [
        {
          heading: 'About',
          paragraphs: [
            "It's important to have a UK bank account while you are studying here to be able to pay for your bills and everyday things, get paid by employers, and keep your money safe.",
            'Check out useful information on how to open UK bank accounts in our guide to Moving to the UK.',
            'If you continue to use the debit or credit card from your home bank you may have to pay overseas bank charges. Find some good advice about the best student bank accounts.',
          ],
        },
        {
          heading: 'How to open a bank account',
          paragraphs: [
            'It will take a few weeks after arriving in the UK to open your new bank account. Make sure you have another source of money for your first few weeks in London, such as cash or a debit/credit card from your home country with low international fees.',
            "To open a bank account, you'll need to visit a bank branch.",
          ],
        },
      ],
      subTasks: {
        title: 'Set up steps',
        items: [
          {
            id: 'choose-bank',
            label: 'Choose a bank',
            link: {
              label: 'Check out the best student bank accounts',
              href: 'https://www.moneysavingexpert.com/students/student-bank-account/',
            },
          },
          {
            id: 'documents',
            label: 'Gather required documents',
            bullets: [
              'Your passport',
              'Proof of your address in your home country. ( For example: banks will accept an offer letter from UAL.)',
              'Proof of your UK address, such as your housing contract or a utility bill',
            ],
          },
          {
            id: 'bank-letter',
            label: "Request a 'bank letter' from UAL",
            lead: 'Send an email to your college, including these details:',
            bullets: [
              'Your Student ID.',
              'UK address. Please include room or flat number.',
              'Home country address.',
              "Optional: Chosen bank name. If you haven't decided yet we'll send you a general letter.",
            ],
            link: {
              label: 'View more about requesting a bank letter',
              href: 'https://www.arts.ac.uk/study-at-ual/international/moving-to-the-uk#request',
            },
          },
          {
            id: 'visit-branch',
            label: 'Visit bank branch and apply',
            description:
              'Visit your chosen bank with your required documents. Talk to a member of staff at the bank branch and they will help you set up a bank account',
          },
        ],
      },
    },
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
