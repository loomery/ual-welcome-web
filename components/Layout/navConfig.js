/**
 * @typedef {Object} NavItem
 * @property {string} [to]     Internal route (use this OR href, not both)
 * @property {string} [href]   External URL — renders as <a> with target=_blank
 * @property {string} label
 */

/**
 * Primary navigation — the single source of truth for both the desktop side nav
 * and the mobile hamburger menu. Order and labels come from the Figma design.
 *
 * @type {NavItem[]}
 */
export const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/essentials', label: 'Essentials' },
  { to: '/studying', label: 'Studying' },
  { to: '/explore', label: 'Explore' },
  { to: '/help', label: 'Get help' },
];

/**
 * Secondary links shown beneath the divider in the side nav and mobile menu.
 * Use `to` for internal routes (rendered with next/link so the sub-path
 * basePath is applied) and `href` for external links.
 *
 * @type {NavItem[]}
 */
export const MENU_SECONDARY = [
  { to: '/info/about-the-beta', label: 'What is a beta?' },
  { href: 'https://www.arts.ac.uk/', label: 'Main UAL website' },
];
