/**
 * The Studying section: the /studying landing (grids of service cards) and its
 * topic detail pages (/studying/{id} — Library, Tech and IT access, Online
 * study tools, Your college).
 *
 * Topic-page copy supports inline links written as [label](url) (RichText).
 *
 * @typedef {import('./checklist').Cta} Cta
 * @typedef {import('./checklist').HelpChannel} HelpChannel
 *
 * @typedef {Object} ServiceCard
 * @property {string} id
 * @property {string} label
 * @property {string} [body]
 * @property {string} href    Internal route or external URL.
 * @property {boolean} [internationalOnly]  Only shown to international students.
 *
 * @typedef {Object} TopicSection
 * @property {string} [heading]
 * @property {string} [description]  Line under the heading, above cards.
 * @property {string[]} [paragraphs]
 * @property {string} [lead]         Line above a bullet list.
 * @property {string[]} [bullets]
 * @property {Cta} [link]            Trailing arrow link.
 * @property {ServiceCard[]} [cards] Grid of service cards.
 * @property {Array<'new'|'returning'>} [statuses]  Cohorts that see this section
 *   (defaults to both).
 *
 * @typedef {Object} ContactBlock
 * @property {string} title
 * @property {string} [intro]
 * @property {HelpChannel[]} channels
 *
 * @typedef {Object} Topic
 * @property {string} id       Route segment (/studying/{id}).
 * @property {string} title
 * @property {string} intro
 * @property {TopicSection[]} sections
 * @property {Cta} [readMore]  Full-width dark banner CTA.
 * @property {ContactBlock} [contact]
 */

// TODO(UAL): replace placeholder URLs with the canonical UAL destinations.
const FACILITIES_URL = 'https://www.arts.ac.uk/students';
const MIRO_URL = 'https://support.myblog.arts.ac.uk/miro/';
const ADOBE_URL = 'https://www.adobe.com/uk/creativecloud.html';
const MYBLOG_URL = 'https://support.myblog.arts.ac.uk/myblog/';

/** The three card groups on the /studying landing. @type {TopicSection[]} */
export const STUDYING_LANDING = [
  {
    heading: 'Your college',
    cards: [
      {
        id: 'getting-around',
        label: 'Getting around',
        body: 'Building information, and how to get to college.',
        href: '/studying/getting-around',
      },
      {
        id: 'library',
        label: 'Library',
        body: 'Find out about your library from access to library search.',
        href: '/studying/library',
      },
      {
        id: 'facilities',
        label: 'Facilities',
        body: 'Technical facilities, workshops and shared spaces.',
        href: FACILITIES_URL,
      },
    ],
    link: { label: 'View more services', href: '/studying/your-college' },
  },
  {
    heading: 'Online study tools',
    cards: [
      {
        id: 'miro',
        label: 'Miro',
        body: 'A digital whiteboard to plan and collaborate in groups.',
        href: MIRO_URL,
      },
      {
        id: 'adobe',
        label: 'Adobe Creative Cloud',
        body: 'Log in to the full suite from any UAL desktop in libraries and learning areas.',
        href: ADOBE_URL,
      },
      {
        id: 'myblog',
        label: 'MyBlog',
        body: 'A Wordpress-based blogging platform for individual or group blogs or websites.',
        href: MYBLOG_URL,
      },
    ],
    link: { label: 'View more services', href: '/studying/online-study-tools' },
  },
  {
    heading: 'IT services',
    cards: [
      {
        id: 'tech-it',
        label: 'Tech and IT access',
        body: 'IT Services look after your UAL account, your email, computers, printing and online security.',
        href: '/studying/tech-and-it-access',
      },
      {
        id: 'mfa',
        label: 'Multi-factor authentication',
        body: 'Secure your accounts by adding a step to verify your identity on login.',
        href: '/checklist/mfa',
      },
      {
        id: 'contact-it',
        label: 'Contact IT services',
        body: 'IT systems and support to the UAL community.',
        href: 'https://www.arts.ac.uk/students/it-services',
      },
    ],
  },
];

/** @type {Topic[]} */
export const STUDYING_TOPICS = [
  {
    id: 'library',
    title: 'Library',
    intro: 'Tools and guides to help you throughout your academic years',
    sections: [
      {
        heading: 'Welcome',
        paragraphs: [
          'You can visit any of our Higher Education libraries for study, browsing or to collect reserved items (Click and Borrow service).',
          'All our libraries have open access study spaces (non-bookable) as well as bookable study spaces for those who need access to specialist study.',
        ],
        lead: 'This will differ at each site but may include:',
        bullets: [
          'individual study spaces – silent study areas',
          'group study rooms',
          'Macs/PCs',
          'height adjustable tables',
          'special collections viewing requests.',
        ],
      },
      {
        heading: 'Available services at UAL libraries',
        cards: [
          {
            id: 'library-search',
            label: 'Library search',
            body: 'Search for catalogues, find books and articles',
            href: 'https://libsearch.arts.ac.uk/',
          },
          {
            id: 'book-space',
            label: 'Book a study space',
            body: 'You will need to sign in to be able to book a space',
            href: 'https://librarybookings-arts.siso.co/',
          },
          {
            id: 'using-library',
            label: 'View more about using the library',
            href: 'https://www.arts.ac.uk/students/library-services/using-the-libraries',
          },
        ],
      },
      {
        heading: 'Accessing the libraries',
        paragraphs: [
          'As a UAL student you can access all of our libraries. The libraries have open access and bookable study spaces with computers, photocopying and printing facilities. You can also borrow a laptop and get help from the library staff to develop your research or digital skills.',
        ],
      },
      {
        heading: 'Library card',
        paragraphs: [
          'Your Student ID is your library card. As soon as you have your ID card, you can borrow items from any UAL library.',
        ],
      },
      {
        heading: 'Opening times',
        paragraphs: [
          'Opening hours vary between sites and may change at short notice. Please check [our service hours](https://www.arts.ac.uk/students/library-services/library-service-hours) for updates.',
        ],
      },
      {
        heading: 'Special collections and archives',
        paragraphs: [
          'The libraries have outstanding physical and digital collections spanning art, design, communication, fashion and performance. These include historical archives and special collections such as zines, material samples and artists’ books.',
          'Find out more about [UAL’s Special Collections and Archives.](https://www.arts.ac.uk/students/library-services/special-collections-and-archives)',
        ],
      },
    ],
    readMore: {
      label: 'Read more about Library services at UAL',
      href: 'https://www.arts.ac.uk/students/library-services',
    },
    contact: {
      title: 'Contact library team',
      channels: [
        {
          id: 'subject-expert',
          label: 'Speak to a subject expert',
          value: 'Browse the different support and expertise the team can offer',
          // TODO(UAL): replace with the canonical subject-experts URL.
          href: 'https://www.arts.ac.uk/students/library-services',
        },
        {
          id: 'ask-us',
          label: 'Ask us: ask a question',
          value: 'Submit a question and we’ll email you the answer',
          href: 'https://arts.ac.libanswers.com/',
        },
        {
          id: 'faqs',
          label: 'FAQs',
          value: 'Look through answers to our most asked questions',
          href: 'https://arts.ac.libanswers.com/',
        },
      ],
    },
  },
  {
    id: 'tech-and-it-access',
    title: 'Tech and IT access',
    intro:
      'IT Services look after your UAL account, your email, computers, printing and online security.',
    sections: [
      {
        heading: 'Student emails and network account',
        statuses: ['new'],
        paragraphs: [
          'It is good practice to check your UAL email account regularly, it’s where you’ll get important news and updates about your studies, course, and time at UAL',
          'If you have firmly accepted your offer, you can access your UAL email account about 10 weeks before starting your course. Once you have accepted your place you will gain access to the account within 72 hours.',
          "You'll be sent an email containing your network username and a link asking you to set a password. You should do this as soon as possible. The email will be sent to the personal email address you gave us when applying.",
          'You can access your email account from any computer or laptop by logging into the Outlook app, or you can access email through the MyUAL app.',
        ],
      },
      {
        heading: 'Set up multi-factor authentication',
        statuses: ['new'],
        paragraphs: ['Protect your identity, data and our systems'],
        link: { label: 'Get started with MFA', href: '/checklist/mfa' },
      },
      {
        heading: 'Wifi',
        paragraphs: [
          'You can connect to UAL-Wi-Fi across all our sites. Just select the UAL Wi-Fi network and login using your UAL username and password.',
        ],
      },
      {
        heading: 'Printing services',
        paragraphs: [
          'You’ll find printers across College locations, including all libraries and Learning Zones. There are many ways to print - you can even print from your mobile device, or from an off-site location.',
          'Printing costs vary depending on size and colourway. You can view and top-up your printing credit online. There’s also a handy ‘Print credits’ tile on the MyUAL app.',
        ],
        link: {
          label: 'Find out more about printing on site',
          href: 'https://www.arts.ac.uk/students/it-services/printing',
        },
      },
    ],
    contact: {
      title: 'Get help',
      intro:
        'If you get stuck or need help with an account or system, IT support is available 24/7, 365 days a year.',
      channels: [
        {
          id: 'ticket',
          label: 'Raise a ticket',
          value: 'MySupport',
          href: 'https://mysupport.arts.ac.uk/MSMAuthenticationLDAP/Login.aspx?returnurl=https://mysupport.arts.ac.uk/MSMSelfService/Login.aspx',
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
          href: 'tel:+442075149898',
        },
      ],
    },
  },
  {
    id: 'online-study-tools',
    title: 'Online study tools',
    intro: 'Tools you’ll need to find and access during your academic year',
    sections: [
      {
        heading: 'Course information and bookings',
        cards: [
          {
            id: 'timetable',
            label: 'Timetable',
            body: 'Check when and where your classes are.',
            href: 'https://www.arts.ac.uk/students/student-timetables',
          },
          {
            id: 'moodle',
            label: 'Moodle',
            body: 'Your virtual learning environment and course materials.',
            href: 'https://moodle.arts.ac.uk/login/index.php',
          },
          {
            id: 'email',
            label: 'Email',
            body: 'Access your UAL email and calendar.',
            href: 'https://www.office.com',
          },
          {
            id: 'resource-booking',
            label: 'Online resource booking',
            body: 'Book equipment and resources for your course.',
            href: 'https://orb-arts.siso.co/',
          },
          {
            id: 'student-portal',
            label: 'Student portal',
            body: 'Your student record, enrolment and personal details.',
            href: 'https://ualportal.arts.ac.uk/urd/sits.urd/run/siw_lgn',
          },
          {
            id: 'academic-support',
            label: 'Academic support online',
            body: 'Study skills, workshops and academic help.',
            href: 'https://www.arts.ac.uk/students/academic-support',
          },
          {
            id: 'print-credit',
            label: 'Print credit',
            body: 'Top up and manage your printing credit.',
            href: 'https://www.arts.ac.uk/students/it-services/printing#topupyourprintcredit',
          },
          {
            id: 'seats',
            label: 'SEAtS',
            body: 'Mark your attendance at sessions.',
            href: 'https://www.arts.ac.uk/study-at-ual/course-regulations/attendance-policy/attendance-monitoring',
          },
        ],
      },
      {
        heading: 'Study tools',
        description: 'Digital tools to help you with assignments',
        cards: [
          {
            id: 'miro',
            label: 'Miro',
            body: 'A digital whiteboard to plan projects and collaborate in groups',
            href: MIRO_URL,
          },
          {
            id: 'adobe',
            label: 'Adobe Creative Cloud',
            body: 'Log in to the full suite from any UAL desktop in libraries and learning areas.',
            href: ADOBE_URL,
          },
          {
            id: 'myblog',
            label: 'MyBlog',
            body: 'A Wordpress-based blogging platform for individual or group blogs or websites.',
            href: MYBLOG_URL,
          },
          {
            id: 'padlet',
            label: 'Padlet',
            body: 'Collect, organise and share ideas on collaborative boards.',
            href: 'https://support.myblog.arts.ac.uk/2022/07/07/padlet-guide/',
          },
          {
            id: 'office',
            label: 'Office 365',
            body: 'Word, Excel, PowerPoint and more with your UAL account.',
            href: 'https://www.office.com',
          },
          {
            id: 'assistive',
            label: 'Assistive software',
            body: 'Tools to support different ways of studying.',
            href: 'https://www.arts.ac.uk/students/assistive-technology',
          },
        ],
      },
    ],
  },
  {
    id: 'your-college',
    title: 'Your college',
    intro:
      'There’s lots to think about and do as you begin your journey with us at UAL. Here are the key tasks you’ll need to complete to get started.',
    sections: [
      {
        cards: [
          {
            id: 'getting-around',
            label: 'Getting around',
            body: 'Building information, and how to get to college.',
            href: '/studying/getting-around',
          },
          {
            id: 'library',
            label: 'Library',
            body: 'Find out about your library from access to library search.',
            href: '/studying/library',
          },
          {
            id: 'facilities',
            label: 'Facilities',
            body: 'Technical facilities, workshops and shared spaces.',
            href: FACILITIES_URL,
          },
          {
            id: 'disability',
            label: 'Disability support',
            body: 'Professional advice and support for students who are disabled and neurodivergent.',
            href: 'https://www.arts.ac.uk/students/student-services/disability-and-dyslexia',
          },
          {
            id: 'language',
            label: 'Language support',
            body: 'English language support for those who speak it as a second language.',
            href: 'https://www.arts.ac.uk/study-at-ual/language-centre/english-language-development-for-ual-students',
            internationalOnly: true,
          },
        ],
      },
    ],
  },
];

/**
 * A topic's sections filtered for the student's cohort and type (e.g. the
 * "Student emails" section is new-students only; the "Language support" card
 * is international only).
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
