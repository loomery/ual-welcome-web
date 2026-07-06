'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { buildBreadcrumbs } from '../../utils/breadcrumbs';

/**
 * Breadcrumbs — UAL DS "Navigation / Breadcrumbs". Rendered once at the layout
 * level; the trail is derived from the current pathname (see
 * `utils/breadcrumbs`), so pages never declare their own crumbs.
 *
 * Underlined links separated by ">", wrapping on narrow viewports, orange on
 * hover/focus. The last item is the current page and carries
 * `aria-current="page"`. Renders nothing when there is no trail (e.g. home).
 *
 * @param {Object} props
 * @param {string} [props.className]  Extra classes on the <nav> wrapper.
 */
export function Breadcrumbs({ className = '' }) {
  const pathname = usePathname();
  const items = buildBreadcrumbs(pathname);

  if (items.length === 0) return null;

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
