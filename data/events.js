/**
 * @typedef {'Talk' | 'Tour' | 'Social' | 'Workshop'} EventCategory
 *
 * @typedef {Object} UalEvent
 * @property {string} id
 * @property {string} title
 * @property {string} description        Used as "About event" on the detail page.
 * @property {string} startsAt           ISO-8601 start datetime.
 * @property {string} endsAt             ISO-8601 end datetime.
 * @property {string} location           Venue / room name.
 * @property {string} college            College name or "All colleges".
 * @property {EventCategory} category
 * @property {string} [whatToBring]      Optional — shown in "What do I need to bring?" section.
 * @property {string} [externalUrl]      Optional — "View more about this event" CTA link.
 */

/** @type {UalEvent[]} */
export const EVENTS = [
  // ── Monday 21 September ─────────────────────────────────────────────────
  {
    id: 'welcome-talk-csm',
    title: 'CSM Welcome Talk',
    description:
      'A welcome introduction from the Dean of Central Saint Martins. Covers campus facilities, key contacts, important dates for your first term and a live Q&A.',
    startsAt: '2026-09-21T10:00:00+01:00',
    endsAt: '2026-09-21T11:30:00+01:00',
    location: 'Granary Building – Platform Theatre, 1 Granary Square, London N1C 4AA',
    college: 'Central Saint Martins',
    category: 'Talk',
    whatToBring: 'All materials will be provided. Bring your student ID.',
    externalUrl: 'https://www.arts.ac.uk/colleges/central-saint-martins',
  },
  {
    id: 'welcome-talk-lcf',
    title: 'LCF Welcome Address',
    description:
      'Join the Dean and senior staff for an introduction to London College of Fashion at the East Bank campus. Hear about the academic year ahead, student support services and life at Stratford.',
    startsAt: '2026-09-21T10:00:00+01:00',
    endsAt: '2026-09-21T11:30:00+01:00',
    location: 'LCF East Bank – Main Auditorium, Here East, London E20 3BS',
    college: 'London College of Fashion',
    category: 'Talk',
    whatToBring: 'Bring your student ID and a notebook.',
    externalUrl: 'https://www.arts.ac.uk/colleges/london-college-of-fashion',
  },
  {
    id: 'welcome-talk-lcc',
    title: 'LCC Induction Talk',
    description:
      'An introduction to London College of Communication — meet your course leaders, find out about facilities on the Elephant & Castle campus and get answers to your first-week questions.',
    startsAt: '2026-09-21T11:00:00+01:00',
    endsAt: '2026-09-21T12:30:00+01:00',
    location: 'LCC – Stanley Building Lecture Theatre, Elephant & Castle, London SE1 6SB',
    college: 'London College of Communication',
    category: 'Talk',
    whatToBring: 'Student ID required for building access.',
    externalUrl: 'https://www.arts.ac.uk/colleges/london-college-of-communication',
  },
  {
    id: 'welcome-talk-wimbledon',
    title: 'Wimbledon Welcome Talk',
    description:
      'Welcome to Wimbledon College of Arts. Meet the Principal, explore the offer across Fine Art, Theatre and Screen, and hear from current students about making the most of your time here.',
    startsAt: '2026-09-21T10:30:00+01:00',
    endsAt: '2026-09-21T12:00:00+01:00',
    location: 'Wimbledon College of Arts – Main Hall, Merton Hall Road, London SW19 3QA',
    college: 'Wimbledon College of Arts',
    category: 'Talk',
    whatToBring: 'Nothing required — just show up.',
    externalUrl: 'https://www.arts.ac.uk/colleges/wimbledon-college-of-arts',
  },

  // ── Tuesday 22 September ────────────────────────────────────────────────
  {
    id: 'campus-tour-csm',
    title: 'CSM Campus Tour',
    description:
      'Student ambassadors lead guided tours of the Granary Building — print rooms, studios, workshops, the library and the famous Granary Square entrance. Tours depart every 30 minutes.',
    startsAt: '2026-09-22T10:00:00+01:00',
    endsAt: '2026-09-22T12:30:00+01:00',
    location: 'Central Saint Martins – Meet at Main Reception, 1 Granary Square N1C 4AA',
    college: 'Central Saint Martins',
    category: 'Tour',
    whatToBring: 'Wear comfortable shoes.',
    externalUrl: 'https://www.arts.ac.uk/colleges/central-saint-martins',
  },
  {
    id: 'library-tour-lcc',
    title: 'LCC Library Induction',
    description:
      "Walk through LCC's library, learn how to find and reserve resources online, and collect your reader card. Librarians will be on hand to answer questions.",
    startsAt: '2026-09-22T13:00:00+01:00',
    endsAt: '2026-09-22T14:00:00+01:00',
    location: 'LCC Library, Ground Floor, Elephant & Castle SE1 6SB',
    college: 'London College of Communication',
    category: 'Tour',
    whatToBring: 'Bring your student ID card.',
    externalUrl: 'https://www.arts.ac.uk/colleges/london-college-of-communication',
  },
  {
    id: 'welcome-talk-chelsea',
    title: 'Chelsea Welcome Talk',
    description:
      'Introduction to Chelsea College of Arts with the Principal and Heads of Programmes. Followed by a guided walk around the Pimlico campus and Tate Britain next door.',
    startsAt: '2026-09-22T10:00:00+01:00',
    endsAt: '2026-09-22T11:30:00+01:00',
    location: 'Chelsea College of Arts – Lecture Theatre, 16 John Islip Street, London SW1P 4JU',
    college: 'Chelsea College of Arts',
    category: 'Talk',
    whatToBring: 'Student ID for access.',
    externalUrl: 'https://www.arts.ac.uk/colleges/chelsea-college-of-arts',
  },
  {
    id: 'cci-welcome-workshop',
    title: 'CCI Welcome & Tech Setup',
    description:
      'Get your CCI digital environment ready for year one. Covers UAL email, Moodle, GitHub, specialist software and the Barbican campus facilities. Hands-on with CCI technical staff.',
    startsAt: '2026-09-22T10:00:00+01:00',
    endsAt: '2026-09-22T12:30:00+01:00',
    location: 'Creative Computing Institute – Studio 1, Barbican, London EC2Y 8DS',
    college: 'Creative Computing Institute',
    category: 'Workshop',
    whatToBring: 'Bring your laptop fully charged.',
    externalUrl: 'https://www.arts.ac.uk/colleges/creative-computing-institute',
  },
  {
    id: 'lcf-library-archive-tour',
    title: 'LCF Library & Fashion Archive Tour',
    description:
      "Discover the LCF Library and the UAL Fashion Archive — one of the UK's most significant collections. Learn how to book specialist items, access online databases and use the reading rooms.",
    startsAt: '2026-09-22T14:00:00+01:00',
    endsAt: '2026-09-22T15:30:00+01:00',
    location: 'LCF East Bank – Library, Here East, London E20 3BS',
    college: 'London College of Fashion',
    category: 'Tour',
    whatToBring: 'Bring your student ID.',
    externalUrl: 'https://www.arts.ac.uk/colleges/london-college-of-fashion',
  },

  // ── Wednesday 23 September ──────────────────────────────────────────────
  {
    id: 'sus-social',
    title: "Students' Union Meet & Mingle",
    description:
      'Clubs, societies, sports, campaigning — and get your SU card. Free food, free drinks and live music. The best way to meet students from across all six UAL colleges on day one of welcome week.',
    startsAt: '2026-09-23T18:00:00+01:00',
    endsAt: '2026-09-23T21:00:00+01:00',
    location: 'Arts SU, 107 Charing Cross Road, London WC2H 0DU',
    college: 'All colleges',
    category: 'Social',
    whatToBring: 'Nothing required — just show up.',
    externalUrl: 'https://www.arts.ac.uk/students/student-union',
  },
  {
    id: 'camberwell-studio-induction',
    title: 'Camberwell Studio Induction',
    description:
      "Get to know Camberwell's studios, workshops and technical facilities. Health & safety briefing, equipment sign-up and a walk through the printmaking, painting and ceramics spaces.",
    startsAt: '2026-09-23T10:00:00+01:00',
    endsAt: '2026-09-23T12:00:00+01:00',
    location: 'Camberwell College of Arts – Main Building, Wilson Road, London SE5 8LU',
    college: 'Camberwell College of Arts',
    category: 'Talk',
    whatToBring: 'Wear clothes you can move in.',
    externalUrl: 'https://www.arts.ac.uk/colleges/camberwell-college-of-arts',
  },
  {
    id: 'freshers-fair',
    title: 'UAL Freshers Fair',
    description:
      "Over 60 student clubs, societies and organisations all in one place. From film and music to activism and sport — find your people at UAL's biggest social event of welcome week.",
    startsAt: '2026-09-23T12:00:00+01:00',
    endsAt: '2026-09-23T16:00:00+01:00',
    location: 'Arts SU, 107 Charing Cross Road, London WC2H 0DU',
    college: 'All colleges',
    category: 'Social',
    whatToBring: 'Nothing required.',
    externalUrl: 'https://www.arts.ac.uk/students/student-union',
  },
  {
    id: 'lcc-photography-workshop',
    title: 'LCC Photography Studio Induction',
    description:
      'Introduction to the photography studios at LCC — lighting rigs, darkrooms, digital editing suites and equipment loan. Health & safety sign-off required before independent use.',
    startsAt: '2026-09-23T14:00:00+01:00',
    endsAt: '2026-09-23T16:00:00+01:00',
    location: 'LCC Photography Studios, Floor 4, Elephant & Castle SE1 6SB',
    college: 'London College of Communication',
    category: 'Workshop',
    whatToBring: 'Bring a memory card if you have one.',
    externalUrl: 'https://www.arts.ac.uk/colleges/london-college-of-communication',
  },

  // ── Thursday 24 September ───────────────────────────────────────────────
  {
    id: 'printmaking-taster',
    title: 'Printmaking Taster Workshop',
    description:
      'Hands-on intro to screen printing and etching at Camberwell. No experience needed — technicians guide you through a full print from design to finished piece.',
    startsAt: '2026-09-24T14:00:00+01:00',
    endsAt: '2026-09-24T16:00:00+01:00',
    location: 'Camberwell Print Rooms, Wilson Road, London SE5 8LU',
    college: 'Camberwell College of Arts',
    category: 'Workshop',
    whatToBring: "Wear clothes you don't mind getting inky.",
    externalUrl: 'https://www.arts.ac.uk/colleges/camberwell-college-of-arts',
  },
  {
    id: 'chelsea-drawing-workshop',
    title: 'Chelsea Life Drawing Drop-in',
    description:
      "Open life drawing session in Chelsea's studio spaces — a relaxed way to warm up your practice before term begins. Facilitated by a current postgraduate student.",
    startsAt: '2026-09-24T13:00:00+01:00',
    endsAt: '2026-09-24T15:00:00+01:00',
    location: 'Chelsea College of Arts – Studio C, 16 John Islip Street SW1P 4JU',
    college: 'Chelsea College of Arts',
    category: 'Workshop',
    whatToBring: 'Bring your own drawing materials if you have them — some will be provided.',
    externalUrl: 'https://www.arts.ac.uk/colleges/chelsea-college-of-arts',
  },
  {
    id: 'ual-library-dropin',
    title: 'UAL Library Card Drop-in',
    description:
      "Can't make your college library induction? Drop in any time during the day to get your UAL library card, a quick tour and a guide to online resources.",
    startsAt: '2026-09-24T10:00:00+01:00',
    endsAt: '2026-09-24T16:00:00+01:00',
    location: 'UAL Library Services – available at all six college libraries',
    college: 'All colleges',
    category: 'Tour',
    whatToBring: 'Bring your student ID.',
  },
  {
    id: 'welfare-dropin',
    title: 'Student Welfare Drop-in',
    description:
      'Meet the Student Advice Service, Disability & Dyslexia Support and the counselling team. Find out what support is available, how to access it and ask questions in a relaxed setting.',
    startsAt: '2026-09-24T11:00:00+01:00',
    endsAt: '2026-09-24T15:00:00+01:00',
    location: 'Arts SU, 107 Charing Cross Road, London WC2H 0DU',
    college: 'All colleges',
    category: 'Talk',
    whatToBring: 'Nothing required.',
    externalUrl:
      'https://www.arts.ac.uk/students/student-services/health-wellbeing-and-support-for-students',
  },

  // ── Friday 25 September ─────────────────────────────────────────────────
  {
    id: 'east-bank-walk',
    title: 'East Bank Campus Walk',
    description:
      "Guided walk around the new LCF campus at Stratford's East Bank — one of London's most significant new cultural and education districts. Includes Sadler's Wells East, BBC and V&A East.",
    startsAt: '2026-09-25T11:00:00+01:00',
    endsAt: '2026-09-25T12:30:00+01:00',
    location: 'LCF East Bank – Meet at Main Entrance, Here East, London E20 3BS',
    college: 'London College of Fashion',
    category: 'Tour',
    whatToBring: 'Comfortable walking shoes recommended.',
    externalUrl: 'https://www.arts.ac.uk/colleges/london-college-of-fashion',
  },
  {
    id: 'csm-grad-exhibition',
    title: 'CSM Graduate Work Exhibition',
    description:
      "Preview of graduate work from last year's degree shows — an inspiring look at what CSM students go on to make. Wine and soft drinks provided. All welcome.",
    startsAt: '2026-09-25T18:00:00+01:00',
    endsAt: '2026-09-25T20:30:00+01:00',
    location: 'Central Saint Martins – Gallery, 1 Granary Square, London N1C 4AA',
    college: 'Central Saint Martins',
    category: 'Social',
    whatToBring: 'Nothing required.',
    externalUrl: 'https://www.arts.ac.uk/colleges/central-saint-martins',
  },
  {
    id: 'wimbledon-studio-open-day',
    title: 'Wimbledon Studio Open Day',
    description:
      'Explore the painting, sculpture, theatre design and screen studios at Wimbledon. Technicians and second-year students on hand to show you the equipment and answer questions.',
    startsAt: '2026-09-25T11:00:00+01:00',
    endsAt: '2026-09-25T13:00:00+01:00',
    location: 'Wimbledon College of Arts – Studios, Merton Hall Road, London SW19 3QA',
    college: 'Wimbledon College of Arts',
    category: 'Tour',
    whatToBring: 'Nothing required.',
    externalUrl: 'https://www.arts.ac.uk/colleges/wimbledon-college-of-arts',
  },
  {
    id: 'all-colleges-mixer',
    title: 'All Colleges Freshers Mixer',
    description:
      'End of welcome week social — meet students from across all UAL colleges. DJ, bar, and plenty of room to connect. The unofficial start of your social life at UAL.',
    startsAt: '2026-09-25T17:00:00+01:00',
    endsAt: '2026-09-25T21:00:00+01:00',
    location: 'Moth Club, Valette Street, London E9 6NU',
    college: 'All colleges',
    category: 'Social',
    whatToBring: 'Bring your student ID — entry is free with it.',
    externalUrl: 'https://www.arts.ac.uk/students/student-union',
  },

  // ── Weekend 26–27 September ─────────────────────────────────────────────
  {
    id: 'london-gallery-walk',
    title: 'London Gallery Walk',
    description:
      "Student-led walk taking in Tate Modern, the Hayward Gallery and Southbank Centre — all within walking distance. Includes a short talk about free student access and UAL's gallery partnerships.",
    startsAt: '2026-09-26T11:00:00+01:00',
    endsAt: '2026-09-26T14:00:00+01:00',
    location: 'Meet at Tate Modern – Turbine Hall Entrance, Bankside, London SE1 9TG',
    college: 'All colleges',
    category: 'Tour',
    whatToBring: 'Wear comfortable shoes. Bring a packed lunch or money for food.',
    externalUrl: 'https://www.arts.ac.uk/study-at-ual/student-experience',
  },
  {
    id: 'east-bank-open-studios',
    title: 'LCF East Bank Open Studios',
    description:
      'Open day at the LCF Stratford studios — fashion studios, maker spaces and the garment archive all open for self-guided exploration. LCF staff and students available throughout.',
    startsAt: '2026-09-26T13:00:00+01:00',
    endsAt: '2026-09-26T16:00:00+01:00',
    location: 'LCF East Bank – Studios, Here East, London E20 3BS',
    college: 'London College of Fashion',
    category: 'Workshop',
    whatToBring: 'Bring a sketchbook if you have one.',
    externalUrl: 'https://www.arts.ac.uk/colleges/london-college-of-fashion',
  },
  {
    id: 'peckham-photography-walk',
    title: 'Peckham Photography Walk',
    description:
      'Explore Peckham Levels, Rye Lane and the surrounding area with Camberwell photography students. A great intro to the neighbourhood and a chance to get shooting before the course begins.',
    startsAt: '2026-09-27T11:00:00+01:00',
    endsAt: '2026-09-27T13:00:00+01:00',
    location: 'Meet outside Peckham Rye Station, London SE15 4RX',
    college: 'Camberwell College of Arts',
    category: 'Tour',
    whatToBring: 'Bring a camera — phone is fine.',
    externalUrl: 'https://www.arts.ac.uk/colleges/camberwell-college-of-arts',
  },
];
