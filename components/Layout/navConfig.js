import { HomeIcon, ChecklistIcon, MapIcon, CalendarIcon } from '../Icon/NavIcons';

/**
 * @typedef {Object} NavItem
 * @property {string} to
 * @property {string} label
 * @property {import('react').ComponentType<import('react').SVGProps<SVGSVGElement>>} Icon
 */

/** @type {NavItem[]} */
export const NAV_ITEMS = [
  { to: '/', label: 'Home', Icon: HomeIcon },
  { to: '/checklist', label: 'Checklist', Icon: ChecklistIcon },
  { to: '/map', label: 'Map', Icon: MapIcon },
  { to: '/events', label: 'Events', Icon: CalendarIcon },
];
