import Link from 'next/link';

/**
 * Breadcrumbs — UAL DS "Navigation / Breadcrumbs": underlined links
 * separated by ">", wrapping on narrow viewports. The last item is the
 * current page and carries `aria-current="page"`.
 *
 * @param {Object} props
 * @param {Array<{ label: string, href: string }>} props.items  Trail in order, last item = current page
 */
export function Breadcrumbs({ items }) {
  if (!items?.length) return null;

  return (
    <nav aria-label="Breadcrumb">
      <ol role="list" className="flex flex-wrap items-center gap-x-3 gap-y-2">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-x-3">
              <Link
                href={item.href}
                aria-current={isLast ? 'page' : undefined}
                className="text-step-d1 text-ual-dark underline"
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
