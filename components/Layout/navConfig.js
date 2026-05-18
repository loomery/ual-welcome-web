import { HomeIcon, ChecklistIcon, MapIcon, CalendarIcon, SupportIcon } from '../Icon/NavIcons';

/**
 * @typedef {Object} NavItem
 * @property {string} to          Internal route (use this OR href, not both)
 * @property {string} [href]      External URL — renders as <a> with target=_blank
 * @property {string} label
 * @property {import('react').ComponentType<import('react').SVGProps<SVGSVGElement>>} Icon
 */

/** @type {NavItem[]} */
export const NAV_ITEMS = [
  { to: '/', label: 'Home', Icon: HomeIcon },
  { to: '/checklist', label: 'Get Setup', Icon: ChecklistIcon },
  { to: '/events', label: 'Events', Icon: CalendarIcon },
  { to: '/map', label: 'Map', Icon: MapIcon },
  { to: '/help', label: 'Support', Icon: SupportIcon },
];
