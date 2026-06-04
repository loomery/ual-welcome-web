import {
  HomeIcon,
  ChecklistIcon,
  MapIcon,
  CalendarIcon,
  SupportIcon,
  PinIcon,
  FeedbackIcon,
  HeartIcon,
} from '../Icon/NavIcons';

/**
 * @typedef {Object} NavItem
 * @property {string} to          Internal route (use this OR href, not both)
 * @property {string} [href]      External URL — renders as <a> with target=_blank
 * @property {string} label
 * @property {import('react').ComponentType<import('react').SVGProps<SVGSVGElement>>} Icon
 * @property {boolean} [primary]  Surface in the mobile bottom bar. The bar holds
 *                                only a handful of primary destinations (thumb
 *                                zone, always visible); everything else lives in
 *                                the "More" sheet. Desktop nav shows all items.
 * @property {string} [group]     Section heading the item sits under inside the
 *                                "More" sheet accordion. Items without a group
 *                                fall into a catch-all section.
 */

/**
 * Full, ordered list of navigation destinations. Desktop chrome (SideNav /
 * Header) renders every item — space scales fine there. The mobile bottom bar
 * is the constrained surface, so only the `primary` items appear in it (~4);
 * the rest fall into the scalable "More" sheet. To promote/demote a
 * destination on mobile, just flip its `primary` flag.
 *
 * @type {NavItem[]}
 */
export const NAV_ITEMS = [
  { to: '/', label: 'Home', Icon: HomeIcon, primary: true },
  { to: '/checklist', label: 'Get Setup', Icon: ChecklistIcon, primary: true },
  { to: '/events', label: 'Events', Icon: CalendarIcon, primary: true },
  { to: '/map', label: 'Map', Icon: MapIcon, primary: true },
  { to: '/help', label: 'Support', Icon: SupportIcon, group: 'Help & wellbeing' },
];

/** Items pinned to the mobile bottom bar (thumb-reachable, always visible). */
export const PRIMARY_NAV_ITEMS = NAV_ITEMS.filter((item) => item.primary);

/** Overflow items shown in the mobile "More" sheet — the scalable bucket. */
export const SECONDARY_NAV_ITEMS = NAV_ITEMS.filter((item) => !item.primary);

/**
 * ⚠️ TEMPORARY — scalability simulation. A batch of fake overflow destinations
 * (all external, so clicks are harmless) used to feel how the "More" sheet
 * behaves with many items: scrolling, density, and whether grouping becomes
 * necessary. Delete this constant — and its use in BottomNav.jsx — once the
 * pattern has been evaluated.
 */
export const DEMO_OVERFLOW_ITEMS = [
  {
    href: 'https://www.arts.ac.uk/students/library-services',
    label: 'Library Services',
    Icon: ChecklistIcon,
    group: 'Study & learning',
  },
  {
    href: 'https://www.arts.ac.uk/students/timetables',
    label: 'Timetable',
    Icon: CalendarIcon,
    group: 'Study & learning',
  },
  {
    href: 'https://www.arts.ac.uk/students/academic-calendar',
    label: 'Academic Calendar',
    Icon: CalendarIcon,
    group: 'Study & learning',
  },
  {
    href: 'https://www.arts.ac.uk/students/language-development',
    label: 'Language Centre',
    Icon: ChecklistIcon,
    group: 'Study & learning',
  },
  {
    href: 'https://www.arts.ac.uk/students/it-services',
    label: 'IT & Computing Support',
    Icon: SupportIcon,
    group: 'Study & learning',
  },
  {
    href: 'https://www.arts.ac.uk/students/student-services',
    label: 'Student Hub',
    Icon: HomeIcon,
    group: 'Campus life',
  },
  {
    href: 'https://www.arts.ac.uk/students/accommodation',
    label: 'Halls of Residence',
    Icon: PinIcon,
    group: 'Campus life',
  },
  {
    href: 'https://www.arts-su.com',
    label: "Students' Union",
    Icon: FeedbackIcon,
    group: 'Campus life',
  },
  {
    href: 'https://www.arts.ac.uk/careers',
    label: 'Careers & Employability',
    Icon: HeartIcon,
    group: 'Campus life',
  },
  {
    href: 'https://www.arts.ac.uk/students/maps-and-travel',
    label: 'Maps & Travel',
    Icon: MapIcon,
    group: 'Campus life',
  },
  {
    href: 'https://www.arts.ac.uk/students/student-health-and-wellbeing',
    label: 'Health & Wellbeing',
    Icon: SupportIcon,
    group: 'Help & wellbeing',
  },
  {
    href: 'https://www.arts.ac.uk/students/student-fees-and-funding',
    label: 'Money & Funding',
    Icon: ChecklistIcon,
    group: 'Help & wellbeing',
  },
  {
    href: 'https://www.arts.ac.uk/students/disability-and-dyslexia',
    label: 'Disability Service',
    Icon: SupportIcon,
    group: 'Help & wellbeing',
  },
  {
    href: 'https://www.arts.ac.uk/contact-us',
    label: 'Contact UAL',
    Icon: FeedbackIcon,
    group: 'Contact',
  },
];

/**
 * Preferred display order for the "More" sheet accordion sections. Any group
 * not listed here is appended afterwards in first-seen order; ungrouped items
 * collapse into a trailing catch-all.
 */
export const NAV_GROUP_ORDER = ['Study & learning', 'Campus life', 'Help & wellbeing', 'Contact'];

/** Label used for items that don't declare a `group`. */
const FALLBACK_GROUP = 'More';

/**
 * @typedef {Object} NavGroup
 * @property {string} name
 * @property {NavItem[]} items
 */

/**
 * Bucket a flat list of nav items into ordered accordion sections by their
 * `group` field, preserving item order within each section. Sections appear in
 * {@link NAV_GROUP_ORDER}; unknown groups follow in first-seen order.
 *
 * @param {NavItem[]} items
 * @param {string[]} [order]
 * @returns {NavGroup[]}
 */
export function groupNavItems(items, order = NAV_GROUP_ORDER) {
  /** @type {Map<string, NavItem[]>} */
  const buckets = new Map();
  for (const item of items) {
    const key = item.group ?? FALLBACK_GROUP;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(item);
  }

  /** @type {NavGroup[]} */
  const groups = [];
  const seen = new Set();
  for (const name of order) {
    if (buckets.has(name)) {
      groups.push({ name, items: buckets.get(name) });
      seen.add(name);
    }
  }
  for (const [name, groupItems] of buckets) {
    if (!seen.has(name)) groups.push({ name, items: groupItems });
  }
  return groups;
}
