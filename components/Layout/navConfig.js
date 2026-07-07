import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import HelpOutlinedIcon from '@mui/icons-material/HelpOutlined';

/**
 * @typedef {Object} NavItem
 * @property {string} to          Internal route (use this OR href, not both)
 * @property {string} [href]      External URL — renders as <a> with target=_blank
 * @property {string} label
 * @property {import('react').ComponentType} Icon
 */

/** @type {NavItem[]} */
export const NAV_ITEMS = [
  { to: '/', label: 'Home', Icon: HomeOutlinedIcon },
  { to: '/checklist', label: 'Get set up', Icon: ChecklistOutlinedIcon },
  { to: '/events', label: 'Events', Icon: CalendarMonthOutlinedIcon },
  { to: '/map', label: 'Map', Icon: MapOutlinedIcon },
  { to: '/help', label: 'Get help', Icon: HelpOutlinedIcon },
];

/**
 * Desktop side-nav order + labels
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
