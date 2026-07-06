import { EVENTS } from '../data/events';
import { HELP_BY_ID } from '../data/help';
import { INFO_PAGES_BY_SLUG } from '../data/infoPages';

/**
 * Breadcrumb trail derived from the current pathname, so pages never declare
 * their own crumbs — the layout builds them from the URL.
 *
 * @typedef {{ label: string, href: string }} Crumb
 */

/** Top-level sections that have an index page. Segment → label. */
const SECTION_LABELS = {
  checklist: 'Tasks',
  events: 'Events',
  help: 'Get help',
  map: 'Map',
};

/**
 * Segments that only nest content and have no page of their own, so they never
 * render a crumb (e.g. `/info` exists only as `/info/[slug]`).
 */
const SECTIONLESS = new Set(['info']);

/** Resolve a child segment's label from its parent section. */
const DETAIL_LABEL = {
  events: (id) => EVENTS.find((e) => e.id === id)?.title,
  help: (id) => HELP_BY_ID[id]?.title,
  info: (slug) => INFO_PAGES_BY_SLUG[slug]?.title,
  checklist: (child) => (child === 'mfa' ? 'Multi-factor authentication (MFA)' : undefined),
};

/** Fallback label for an unrecognised segment: "welcome-talk" → "Welcome talk". */
function titleCase(segment) {
  const words = segment.replace(/-/g, ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/**
 * Build the breadcrumb trail for a pathname. Home ('/') and unknown paths with
 * no resolvable section return an empty trail (no breadcrumbs shown).
 *
 * @param {string | null} pathname
 * @returns {Crumb[]}
 */
export function buildBreadcrumbs(pathname) {
  const segments = (pathname ?? '').split('/').filter(Boolean);
  if (segments.length === 0) return [];

  const trail = [{ label: 'Home', href: '/' }];
  let href = '';
  let parent = null;

  for (const segment of segments) {
    href += `/${segment}`;

    if (SECTIONLESS.has(segment)) {
      // No crumb, but remember it so the child resolves its label.
      parent = segment;
      continue;
    }

    const label =
      (parent && DETAIL_LABEL[parent]?.(segment)) ?? SECTION_LABELS[segment] ?? titleCase(segment);

    trail.push({ label, href });
    parent = segment;
  }

  return trail;
}
