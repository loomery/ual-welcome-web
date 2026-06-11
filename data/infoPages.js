/**
 * Content for the personalised-home "interest" cards that link to a dedicated
 * info page. Each page is described as an ordered list of content blocks that
 * screens/Info/InfoScreen renders generically, so adding or editing a page is
 * a pure-data change.
 *
 * The pages mirror the Figma "personalised home → linked pages" board
 * (node 421-11884): Resources, Library service, Borrowing a laptop, Get set
 * up with a local doctor, Safety at UAL, and Find your campus. Cards on the
 * dashboard whose destination is not yet designed in Figma keep their `#`
 * placeholder and are intentionally absent here.
 *
 * @typedef {Object} InfoLink
 * @property {string} title
 * @property {string} [body]   Short supporting line shown under the title.
 * @property {string} href     Internal route if it starts with '/', else external.
 *
 * @typedef {Object} InfoRow
 * @property {string} [group]  Optional column/group label (e.g. "Closest stations").
 * @property {string} label
 * @property {string} value
 *
 * @typedef {Object} InfoBlock
 * @property {'prose'|'list'|'links'|'table'} type
 * @property {string} [heading]
 * @property {string[]} [body]          Paragraphs (type: 'prose').
 * @property {boolean} [ordered]        Render an <ol> instead of <ul> (type: 'list').
 * @property {string[]} [items]         List items (type: 'list').
 * @property {boolean} [accordion]      Render the list inside an expanded accordion (type: 'list').
 * @property {string} [image]           public/ path of a photo shown beside the list (type: 'list').
 * @property {string} [imageAlt]        Alt text for that photo.
 * @property {InfoLink[]} [links]       Link tiles (type: 'links').
 * @property {boolean} [media]          Render link tiles as media cards with the fallback image.
 * @property {InfoRow[]} [rows]         Two-column rows (type: 'table').
 * @property {{ label: string, href: string, variant?: 'hyperlink' }} [cta]
 *   Optional call to action — a prominent black button by default, or an
 *   inline underlined link when `variant: 'hyperlink'`.
 *
 * @typedef {Object} InfoPage
 * @property {string} slug      URL slug under /info/<slug>.
 * @property {string} title
 * @property {string} [lead]    Standfirst under the title.
 * @property {InfoBlock[]} blocks
 */

/** @type {InfoPage[]} */
export const INFO_PAGES = [
  {
    slug: 'resources',
    title: 'Resources',
    lead: 'Tools and guides to return to throughout your academic years.',
    blocks: [
      {
        type: 'links',
        heading: 'Study tools',
        media: true,
        links: [
          {
            title: 'Miro',
            body: 'A digital whiteboard to plan projects and collaborate in groups.',
            href: 'https://miro.com',
          },
          {
            title: 'MyBlog: creating a blog',
            body: 'Quickly and easily create a blog to share reflections or information.',
            href: 'https://myblog.arts.ac.uk',
          },
          {
            title: 'Padlet',
            body: 'Create a scrapbook, portfolio, noticeboard, mind map, blog or discussion forum.',
            href: 'https://padlet.com',
          },
        ],
      },
      {
        type: 'links',
        heading: 'UAL Libraries',
        media: true,
        links: [
          {
            title: 'Library service',
            body: 'Understand how UAL libraries function, see opening times and contact details.',
            href: '/info/library-service',
          },
          {
            title: 'Library search',
            body: 'Search the catalogue, find books and articles.',
            href: 'https://www.arts.ac.uk/students/library-services',
          },
          {
            title: 'Borrowing a laptop',
            body: 'Log in and book a study space.',
            href: '/info/borrowing-a-laptop',
          },
        ],
      },
    ],
  },
  {
    slug: 'library-service',
    title: 'Library service',
    lead: 'Tools and guides to help you throughout your academic years.',
    blocks: [
      {
        type: 'prose',
        heading: 'Welcome',
        body: [
          'As a UAL student you can access all of our libraries. The libraries have open-access and bookable study spaces with computers, photocopying and printing facilities. You can also borrow a laptop and get help from the library staff to develop your research or digital skills.',
        ],
      },
      {
        type: 'prose',
        heading: 'Accessing a library',
        body: [
          'Your student ID is your library card. As soon as you have your ID card, you can borrow from a library.',
        ],
      },
      {
        type: 'prose',
        heading: 'Library service hours',
        body: [
          'Opening hours vary between sites and may change at short notice.',
          'Current term (Monday 29 September to Sunday 2 November): Monday to Friday 9am to 10pm, Saturday and Sunday 10am to 6pm.',
        ],
      },
      {
        type: 'links',
        heading: 'Contact library services',
        media: true,
        links: [
          { title: 'Ask us: ask a question', href: 'https://arts.libanswers.com' },
          { title: 'FAQs', href: 'https://arts.libanswers.com/faq' },
          {
            title: 'Contact your librarian',
            href: 'https://www.arts.ac.uk/students/library-services',
          },
        ],
      },
    ],
  },
  {
    slug: 'borrowing-a-laptop',
    title: 'Borrowing a laptop',
    blocks: [
      {
        type: 'list',
        heading: 'How to borrow a laptop',
        ordered: true,
        accordion: true,
        image: '/images/laptop-lockers.jpg',
        imageAlt: 'A bank of green laptop lockers with a touch screen in the Learning Zone',
        items: [
          'Visit one of the laptop lockers.',
          'Swipe your UAL ID card on the card reader below the touch screen.',
          'Read and agree to the terms and conditions of the loan.',
          'Press “Borrow” on the touch screen.',
          'Select the type of computer device you want to loan.',
          'Look for the flashing locker.',
          'Open the door and unplug the laptop.',
          'Close the door carefully but firmly.',
        ],
      },
      {
        type: 'list',
        heading: 'How to return a laptop',
        ordered: true,
        accordion: true,
        items: [
          'Go to the laptop locker you originally borrowed the laptop from.',
          'Swipe your UAL ID card on the card reader below the touch screen.',
          'Press “Return” on the touch screen.',
          'Look for the flashing locker.',
          'Open the door.',
          'Carefully plug the laptop back into the charging cable.',
          'Close the door carefully but firmly.',
          'Check the door is fully locked by pulling the handle.',
        ],
      },
      {
        type: 'prose',
        heading: 'Where are the lockers located',
        body: ['Central Saint Martins: Learning Zone on floor 1.'],
      },
      {
        type: 'prose',
        heading: 'Borrowing rules',
        body: [
          'Loaned laptops must stay on the site they were borrowed from and must be returned before the end of each day.',
          'You are responsible for the safety of the laptop when it is on loan to you.',
        ],
        cta: {
          label: 'Read full terms and conditions',
          href: 'https://www.arts.ac.uk/__data/assets/pdf_file/0031/358258/Library-Services-laptop-loan-terms-and-conditions-v1-20160915_accessible.pdf',
          variant: 'hyperlink',
        },
      },
    ],
  },
  {
    slug: 'local-doctor',
    title: 'Get set up with a local doctor',
    blocks: [
      {
        type: 'prose',
        heading: 'About',
        body: [
          'Local doctors, also known as a GP (general practice), provide access to healthcare, routine prescriptions and emergency support.',
        ],
      },
      {
        type: 'prose',
        heading: 'Who should register',
        body: [
          'Free NHS treatment is accessible to all UK students, and to EU and international students on a full-time course lasting more than 6 months.',
        ],
      },
      {
        type: 'prose',
        heading: 'When to register',
        body: [
          'At the beginning of your studies, even if you are already registered elsewhere in the UK.',
        ],
      },
      {
        type: 'list',
        heading: 'Times when payment is due',
        items: ['Prescriptions and medication', 'Dental treatment', 'Optical services'],
      },
      {
        type: 'list',
        heading: 'How to register',
        ordered: true,
        items: [
          'Find your nearest doctor using the button below.',
          'Browse your options on the NHS website.',
          'Fill in the registration form on the NHS website.',
        ],
        cta: {
          label: 'Find your nearest doctor',
          href: 'https://www.nhs.uk/service-search/find-a-gp',
        },
      },
    ],
  },
  {
    slug: 'safety-at-ual',
    title: 'Safety at UAL',
    blocks: [
      {
        type: 'prose',
        heading: 'On campus',
        body: ['Let someone at site reception know, or speak to one of the security team members.'],
      },
      {
        type: 'prose',
        heading: 'Critical emergency',
        body: [
          'Call 999.',
          'Call when someone is seriously ill or injured, their life is at immediate risk, or you have witnessed a crime.',
        ],
      },
    ],
  },
];

/** Convenience lookup by slug. */
export const INFO_PAGES_BY_SLUG = Object.fromEntries(INFO_PAGES.map((p) => [p.slug, p]));
