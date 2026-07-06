'use client';

import Link from 'next/link';
import { useSelectedLayoutSegments } from 'next/navigation';

/** "library-service" → "Library service" */
function toLabel(segment) {
  const words = decodeURIComponent(segment).replace(/-/g, ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/**
 * Breadcrumbs — UAL DS "Navigation / Breadcrumbs". Rendered once at the layout
 * level; the trail comes straight from the router via
 * `useSelectedLayoutSegments()` (the Next.js hook made for breadcrumbs), so it
 * follows whatever route is active with no per-page or per-route config.
 *
 * Underlined links separated by ">", wrapping on narrow viewports, orange on
 * hover/focus. The last item is the current page (`aria-current="page"`).
 * Renders nothing at the root (no segments).
 *
 * @param {Object} props
 * @param {string} [props.className]  Extra classes on the <nav> wrapper.
 */
export function Breadcrumbs({ className = '' }) {
  const segments = useSelectedLayoutSegments();

  if (segments.length === 0) return null;

  const items = [
    { label: 'Home', href: '/' },
    ...segments.map((segment, index) => ({
      label: toLabel(segment),
      href: `/${segments.slice(0, index + 1).join('/')}`,
    })),
  ];

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol role="list" className="flex flex-wrap items-center gap-x-3 gap-y-2">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-x-3">
              <Link
                href={item.href}
                aria-current={isLast ? 'page' : undefined}
                className="text-step-d1 text-ual-dark underline hover:text-ual-orange focus-visible:text-ual-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange"
              >
                {item.label}
              </Link>
              {!isLast && (
                <span aria-hidden="true" className="text-step-d1 text-ual-dark">
                  &gt;
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
