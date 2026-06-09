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
  { to: '/checklist', label: 'Get set up', Icon: ChecklistIcon },
  { to: '/events', label: 'Events', Icon: CalendarIcon },
  { to: '/map', label: 'Map', Icon: MapIcon },
  { to: '/help', label: 'Get help', Icon: SupportIcon },
];

/**
 * Desktop side-nav order + labels, matching the Figma home design
 * (Home / Tasks / Events / Map / Help). The side nav is text-only, so
 * these items carry no icon.
 *
 * @type {Array<{ to: string, label: string }>}
 */
export const SIDE_NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/checklist', label: 'Tasks' },
  { to: '/events', label: 'Events' },
  { to: '/map', label: 'Map' },
  { to: '/help', label: 'Help' },
];
