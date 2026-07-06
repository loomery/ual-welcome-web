/**
 * Breadcrumb trail derived entirely from the current pathname — no per-route
 * config. Every URL segment becomes a crumb, humanised for display and linking
 * to its cumulative path. Home ('/') has no breadcrumbs.
 *
 * @typedef {{ label: string, href: string }} Crumb
 */

/** "library-service" → "Library service" */
function toLabel(segment) {
  const words = decodeURIComponent(segment).replace(/-/g, ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/**
 * @param {string | null} pathname
 * @returns {Crumb[]}
 */
export function buildBreadcrumbs(pathname) {
  const segments = (pathname ?? '').split('/').filter(Boolean);
  if (segments.length === 0) return [];

  let href = '';
  const trail = [{ label: 'Home', href: '/' }];

  for (const segment of segments) {
    href += `/${segment}`;
    trail.push({ label: toLabel(segment), href });
  }

  return trail;
}
