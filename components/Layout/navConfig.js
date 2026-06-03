import { HomeIcon, ChecklistIcon, MapIcon, CalendarIcon, SupportIcon } from '../Icon/NavIcons';

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
  { to: '/help', label: 'Support', Icon: SupportIcon },
];

/** Items pinned to the mobile bottom bar (thumb-reachable, always visible). */
export const PRIMARY_NAV_ITEMS = NAV_ITEMS.filter((item) => item.primary);

/** Overflow items shown in the mobile "More" sheet — the scalable bucket. */
export const SECONDARY_NAV_ITEMS = NAV_ITEMS.filter((item) => !item.primary);
